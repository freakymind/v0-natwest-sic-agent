import { NextResponse } from "next/server"
import { generateText, Output } from "ai"
import { z } from "zod"
import { getSicCatalog, getSicByCode } from "@/lib/sic-codes"

/**
 * Deterministic fallback: for each revenue stream, find the SIC whose title
 * has the highest word-overlap. Returns at most one suggestion per stream.
 */
function keywordFallback(
  revenueStreams: string[],
  catalog: ReturnType<typeof getSicCatalog>
) {
  const seen = new Set<string>()
  const suggestions: {
    code: string
    title: string
    section: string
    summary: string
    sourceRevenueStream: string
    confidence: "high" | "medium" | "low"
  }[] = []

  for (const stream of revenueStreams) {
    const words = stream.toLowerCase().split(/[\s,/-]+/).filter((w) => w.length > 3)
    let best: (typeof catalog)[number] | null = null
    let bestHits = 0

    for (const sic of catalog) {
      const haystack = sic.title.toLowerCase()
      const hits = words.filter((w) => haystack.includes(w)).length
      if (hits > bestHits) {
        bestHits = hits
        best = sic
      }
    }

    if (best && bestHits > 0 && !seen.has(best.code)) {
      seen.add(best.code)
      suggestions.push({
        code: best.code,
        title: best.title,
        section: best.section,
        summary: `You generate income from "${best.title}" activity, which aligns with your "${stream}" revenue stream.`,
        sourceRevenueStream: stream,
        confidence: bestHits >= 2 ? "medium" : "low",
      })
    }
  }

  return suggestions
}

export async function POST(req: Request) {
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

  // Only consider SIC codes the business has not already registered.
  const catalog = getSicCatalog(registeredCodes)
  const catalogList = catalog
    .map((s) => `- ${s.code}: ${s.title} [${s.section}]`)
    .join("\n")

  try {
    const { output } = await generateText({
      model: "google/gemini-2.0-flash",
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
5. Mark "high" confidence only for obvious matches; use "medium" or "low" otherwise.
6. Set sourceRevenueStream to the exact text of the revenue stream it came from.`,
    })

    // Enrich with authoritative catalog data and drop any hallucinated codes.
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

    // If AI gave us nothing useful, use keyword fallback rather than
    // returning an empty list (which would leave the derive step blank).
    if (suggestions.length === 0) {
      return NextResponse.json({ suggestions: keywordFallback(revenueStreams, catalog) })
    }

    return NextResponse.json({ suggestions })
  } catch {
    // AI unavailable (rate limit, network, etc.) — return keyword-matched
    // suggestions so the user can still complete the journey.
    return NextResponse.json({ suggestions: keywordFallback(revenueStreams, catalog) })
  }
}
