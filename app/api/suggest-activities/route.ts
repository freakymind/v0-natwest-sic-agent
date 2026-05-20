import { NextResponse } from "next/server"
import { generateText, Output } from "ai"
import { z } from "zod"
import { getActivityCodesForSic, type ActivityCode } from "@/lib/activity-codes"

export async function POST(req: Request) {
  try {
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

    // Get all activity codes for this SIC
    const activityCodes = getActivityCodesForSic(sicCode)

    if (activityCodes.length === 0) {
      // No activity codes defined for this SIC — return empty
      return NextResponse.json({ suggestions: [] })
    }

    // Format activity codes for the prompt
    const activityList = activityCodes
      .map((a) => `- ${a.code}: ${a.label} (${a.riskLevel} risk)`)
      .join("\n")

    const revenueContext =
      revenueStreams.length > 0
        ? `\nThey also indicated these additional revenue streams: ${revenueStreams.join(", ")}.`
        : ""

    const { output } = await generateText({
      model: "openai/gpt-4o-mini",
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
4. Only include "low" confidence if there's a hint but it's uncertain
5. If the description clearly only matches ONE activity, only return one
6. Be conservative — don't guess if there's no evidence in the description

Return the suggestions ordered by confidence (highest first).`,
    })

    // Enrich with full activity code data
    const enriched = (output?.suggestions ?? []).map((s) => {
      const full = activityCodes.find((a) => a.code === s.code)
      return {
        ...s,
        label: full?.label ?? "Unknown",
        riskLevel: full?.riskLevel ?? "medium",
      }
    })

    return NextResponse.json({ suggestions: enriched })
  } catch (error) {
    console.error("Activity suggestion error:", error)
    return NextResponse.json(
      { error: "Failed to suggest activity codes" },
      { status: 500 }
    )
  }
}
