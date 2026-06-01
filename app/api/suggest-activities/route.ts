import { NextResponse } from "next/server"
import { generateText, Output } from "ai"
import { z } from "zod"
import { getActivityCodesForSic, type ActivityCode } from "@/lib/activity-codes"

/**
 * Deterministic fallback: score each activity code against the business
 * description using keyword overlap. Returns codes ranked by match count,
 * first one marked "high", rest "medium". Always returns at least one result
 * so the activities step never blocks on an AI failure.
 */
function keywordFallback(
  activityCodes: ActivityCode[],
  summary: string,
  sicTitle: string
): { code: string; confidence: "high" | "medium" | "low"; reason: string; label: string; riskLevel: "low" | "medium" | "high" }[] {
  const haystack = `${summary} ${sicTitle}`.toLowerCase()
  const scored = activityCodes.map((a) => {
    const words = a.label.toLowerCase().split(/[\s/,()-]+/).filter(Boolean)
    const hits = words.filter((w) => w.length > 3 && haystack.includes(w)).length
    return { ...a, hits }
  })
  scored.sort((a, b) => b.hits - a.hits || a.riskLevel.localeCompare(b.riskLevel))

  return scored.slice(0, 3).map((a, i) => ({
    code: a.code,
    label: a.label,
    riskLevel: a.riskLevel,
    confidence: i === 0 ? "high" : "medium",
    reason: i === 0
      ? `Best keyword match for "${sicTitle}" based on your description.`
      : `Possible secondary match for your type of business.`,
  }))
}

export async function POST(req: Request) {
  const {
    sicCode,
    sicTitle,
    summary,
    revenueStreams,
  }: {
    sicCode: string
    sicTitle: string
    summary: string
    revenueStreams: string[]
  } = await req.json()

  const activityCodes = getActivityCodesForSic(sicCode)

  if (activityCodes.length === 0) {
    return NextResponse.json({ suggestions: [] })
  }

  const activityList = activityCodes
    .map((a) => `- ${a.code}: ${a.label} (${a.riskLevel} risk)`)
    .join("\n")

  const revenueContext =
    revenueStreams.length > 0
      ? `\nThey also indicated these additional revenue streams: ${revenueStreams.join(", ")}.`
      : ""

  try {
    const { output } = await generateText({
      model: "google/gemini-2.0-flash",
      output: Output.object({
        schema: z.object({
          suggestions: z.array(
            z.object({
              code: z.string().describe("The 6-digit activity code"),
              confidence: z
                .enum(["high", "medium", "low"])
                .describe("How confident we are this matches the business"),
              reason: z
                .string()
                .describe("One short sentence explaining why this matches"),
            })
          ),
        }),
      }),
      prompt: `You are a UK banking compliance assistant helping classify a business for risk assessment.

The business is registered under SIC code ${sicCode} (${sicTitle}).

Their description of what they do:
"${summary}"${revenueContext}

Available activity codes for SIC ${sicCode}:
${activityList}

Based on the business description, select the activity codes that BEST match what this business actually does.

Rules:
1. Select 1-3 activity codes maximum — only the most relevant ones
2. The PRIMARY activity should be marked "high" confidence
3. Secondary activities (if clearly mentioned) can be "medium" confidence
4. Only include "low" confidence if there's a hint but it is uncertain
5. If the description clearly only matches ONE activity, only return one
6. Be conservative — do not guess if there is no evidence in the description

Return the suggestions ordered by confidence (highest first).`,
    })

    const enriched = (output?.suggestions ?? [])
      .filter((s) => activityCodes.some((a) => a.code === s.code))
      .map((s) => {
        const full = activityCodes.find((a) => a.code === s.code)!
        return { ...s, label: full.label, riskLevel: full.riskLevel }
      })

    // If AI returned nothing useful, fall back to keyword matching
    if (enriched.length === 0) {
      return NextResponse.json({ suggestions: keywordFallback(activityCodes, summary, sicTitle) })
    }

    return NextResponse.json({ suggestions: enriched })
  } catch {
    // AI unavailable (rate limit, network, etc.) — use deterministic fallback
    // so the journey never shows an error to the user.
    return NextResponse.json({ suggestions: keywordFallback(activityCodes, summary, sicTitle) })
  }
}
