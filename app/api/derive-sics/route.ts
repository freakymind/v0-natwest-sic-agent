import { NextResponse } from "next/server"
import { generateText, Output } from "ai"
import { z } from "zod"
import { getSicCatalog, getSicByCode } from "@/lib/sic-codes"

export async function POST(req: Request) {
  try {
    const {
      summary,
      revenueStreams,
      registeredCodes,
      primaryTitle,
    }: {
      summary: string
      revenueStreams: string[]
      registeredCodes: string[]
      primaryTitle: string
    } = await req.json()

    if (!revenueStreams || revenueStreams.length === 0) {
      return NextResponse.json({ suggestions: [] })
    }

    // Only consider SIC codes the business hasn't already registered.
    const catalog = getSicCatalog(registeredCodes)
    const catalogList = catalog
      .map((s) => `- ${s.code}: ${s.title} [${s.section}]`)
      .join("\n")

    const { output } = await generateText({
      model: "openai/gpt-4o-mini",
      output: Output.object({
        schema: z.object({
          suggestions: z.array(
            z.object({
              code: z
                .string()
                .describe("The 5-digit SIC code from the catalog"),
              sourceRevenueStream: z
                .string()
                .describe(
                  "The exact revenue stream (from the provided list) this code maps to"
                ),
              confidence: z
                .enum(["high", "medium", "low"])
                .describe("How confident this SIC matches the revenue stream"),
              summary: z
                .string()
                .describe(
                  "One short sentence describing this activity for the business"
                ),
            })
          ),
        }),
      }),
      prompt: `You are a UK banking compliance assistant. A business has told us about additional revenue streams beyond their registered SIC codes. Map each revenue stream to the single best matching SIC code so we can record it as a (not-yet-registered) declared activity.

The business's primary registered activity is: ${primaryTitle}.
Their description: "${summary}"

Additional revenue streams the user selected:
${revenueStreams.map((r) => `- ${r}`).join("\n")}

Available SIC codes (the business has NOT registered these):
${catalogList}

Rules:
1. Only map a revenue stream to a SIC code if there is a clear, sensible match in the catalog above.
2. Map at most ONE SIC code per revenue stream — pick the best fit.
3. Do NOT invent codes. Only use codes from the catalog above.
4. It is fine to return fewer suggestions than revenue streams, or none, if nothing matches well.
5. Mark "high" confidence only for obvious matches; use "medium"/"low" otherwise.
6. Set sourceRevenueStream to the exact text of the revenue stream it came from.`,
    })

    // Enrich with authoritative catalog data (title/section) and drop any
    // hallucinated codes that aren't in our catalog.
    const seen = new Set<string>()
    const suggestions = (output?.suggestions ?? [])
      .filter((s) => {
        const known = catalog.some((c) => c.code === s.code)
        if (!known || seen.has(s.code)) return false
        seen.add(s.code)
        return true
      })
      .map((s) => {
        const sic = getSicByCode(s.code)
        return {
          code: sic.code,
          title: sic.title,
          section: sic.section,
          summary: s.summary,
          sourceRevenueStream: s.sourceRevenueStream,
          confidence: s.confidence,
        }
      })

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error("Derive SICs error:", error)
    return NextResponse.json(
      { error: "Failed to derive SIC codes" },
      { status: 500 }
    )
  }
}
