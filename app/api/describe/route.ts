import { NextResponse } from "next/server"
import { generateText, Output } from "ai"
import { z } from "zod"

const primarySchema = z.object({
  summary: z
    .string()
    .describe(
      "A clear, friendly 2-3 sentence description of what a business with this SIC code typically does as its core activity. Written in second person, as if describing the user's business to them.",
    ),
  relatedRevenueStreams: z
    .array(z.string())
    .min(4)
    .max(6)
    .describe(
      "4-6 ADDITIONAL or ADJACENT revenue streams that similar UK businesses operating under this SIC code commonly have ALONGSIDE their core activity. Do NOT repeat the core activity itself. Think: cross-sells, complementary services, secondary income lines, or work done by closely related SIC codes. Each item should be 4-10 words, sentence case, no trailing punctuation.",
    ),
})

const secondarySchema = z.object({
  summary: z
    .string()
    .describe(
      "A concise 1-2 sentence description of the activity covered by this SIC code, written in second person as a secondary income stream. Start with a verb like 'You also…' or 'This covers…'. Plain English, no jargon.",
    ),
})

export async function POST(req: Request) {
  const body = (await req.json()) as {
    code: string
    title: string
    companyName?: string
    mode?: "primary" | "secondary"
    primaryTitle?: string
  }

  const { code, title, companyName, mode = "primary", primaryTitle } = body

  if (!code || !title) {
    return NextResponse.json({ error: "Missing code or title" }, { status: 400 })
  }

  if (mode === "secondary") {
    try {
      const { experimental_output } = await generateText({
        model: "openai/gpt-5-mini",
        experimental_output: Output.object({ schema: secondarySchema }),
        system:
          "You help UK business customers describe additional income streams during bank onboarding. Be concise and plain-English. The user has multiple SIC codes registered — you are explaining ONE of the non-primary ones as an additional source of income.",
        prompt: `Company: ${companyName ?? "(unnamed)"}\nPrimary activity: ${primaryTitle ?? "(unspecified)"}\n\nNow describe this OTHER registered activity as an additional income source for the same business:\nSIC code: ${code}\nOfficial title: ${title}`,
      })

      return NextResponse.json({
        code,
        title,
        summary: experimental_output.summary,
      })
    } catch (err) {
      console.log("[v0] describe secondary error:", (err as Error).message)
      return NextResponse.json({
        code,
        title,
        summary: `You also generate income from "${title}" (SIC ${code}) as an additional activity alongside your primary work.`,
      })
    }
  }

  try {
    const { experimental_output } = await generateText({
      model: "openai/gpt-5-mini",
      experimental_output: Output.object({ schema: primarySchema }),
      system:
        "You help UK business customers describe their company to their bank during onboarding. Be concise, plain-English, and specific to UK SIC 2007 classifications. When suggesting additional revenue streams, focus on realistic adjacent income sources that similar businesses commonly add — not the core activity already covered by the SIC code.",
      prompt: `Company: ${companyName ?? "(unnamed)"}\nPrimary SIC code: ${code}\nOfficial title: ${title}\n\nFirst, generate a friendly description of the CORE activity for this SIC code.\nThen, list other revenue streams that similar UK businesses (or businesses in closely related SIC codes) commonly have ALONGSIDE this core activity.`,
    })

    return NextResponse.json({
      code,
      title,
      summary: experimental_output.summary,
      relatedRevenueStreams: experimental_output.relatedRevenueStreams,
    })
  } catch (err) {
    console.log("[v0] describe error:", (err as Error).message)
    return NextResponse.json({
      code,
      title,
      summary: `Your business is classified under "${title}". This covers the day-to-day commercial activities associated with SIC code ${code}.`,
      relatedRevenueStreams: [
        "Wholesale supply to other businesses",
        "Online direct-to-consumer sales",
        "Subscription or membership services",
        "Training, consultancy or advisory work",
        "Repair, maintenance and aftercare",
      ],
    })
  }
}
