import { generateText, Output } from "ai"
import { z } from "zod"
import { getSicByCode, getSicCatalog } from "@/lib/sic-codes"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const summary: string = (body.summary ?? "").toString().trim()
    const primaryCode: string = (body.primaryCode ?? "").toString().trim()
    const primaryTitle: string = (body.primaryTitle ?? "").toString().trim()
    const revenueStreams: string[] = Array.isArray(body.revenueStreams)
      ? body.revenueStreams.map(String)
      : []
    const exclude: string[] = Array.isArray(body.exclude)
      ? body.exclude.map(String)
      : []

    if (!summary) {
      return Response.json({ error: "Missing summary" }, { status: 400 })
    }

    // Filter out anything the user already has so we only suggest *new* codes.
    const catalog = getSicCatalog([primaryCode, ...exclude])

    const catalogText = catalog
      .map((s) => `- ${s.code} | ${s.section} | ${s.title}`)
      .join("\n")

    const prompt = [
      `You are an onboarding assistant for a UK business bank.`,
      `A user has described what their company does. Based on that description and any additional revenue streams they mentioned, identify other UK SIC 2007 codes from the catalog below that genuinely match work this business does.`,
      ``,
      `BUSINESS DESCRIPTION:`,
      `"${summary}"`,
      ``,
      `PRIMARY SIC ALREADY SELECTED: ${primaryCode} — ${primaryTitle}`,
      revenueStreams.length > 0
        ? `ADDITIONAL REVENUE STREAMS THE USER MENTIONED:\n${revenueStreams
            .map((r) => `- ${r}`)
            .join("\n")}`
        : `ADDITIONAL REVENUE STREAMS: (none)`,
      ``,
      `CATALOG (code | section | title):`,
      catalogText,
      ``,
      `RULES:`,
      `- Only choose codes from the catalog above.`,
      `- Do not repeat the primary SIC code.`,
      `- Pick between 0 and 5 codes — quality over quantity. If nothing genuinely matches, return an empty list.`,
      `- For each match, write a short one-sentence reason (max ~14 words) tying it back to the description or revenue stream.`,
      `- Sort by how strongly each code matches the description, strongest first.`,
    ].join("\n")

    const { experimental_output } = await generateText({
      model: "openai/gpt-5-mini",
      prompt,
      experimental_output: Output.object({
        schema: z.object({
          matches: z
            .array(
              z.object({
                code: z.string(),
                reason: z.string(),
              }),
            )
            .max(5),
        }),
      }),
    })

    // Resolve to titles + section from our catalog and drop hallucinations.
    const seen = new Set<string>()
    const matches = experimental_output.matches
      .filter((m) => {
        if (seen.has(m.code)) return false
        seen.add(m.code)
        return Boolean(m.code) && m.code !== primaryCode
      })
      .map((m) => {
        const sic = getSicByCode(m.code)
        return {
          code: sic.code,
          title: sic.title,
          section: sic.section,
          reason: m.reason,
          inCatalog: Boolean(catalog.find((c) => c.code === m.code)),
        }
      })
      .filter((m) => m.inCatalog)
      .map(({ inCatalog: _i, ...rest }) => rest)

    return Response.json({ matches })
  } catch (e) {
    console.log("[v0] match-sic error:", e)
    return Response.json(
      { error: "Failed to match SIC codes" },
      { status: 500 },
    )
  }
}
