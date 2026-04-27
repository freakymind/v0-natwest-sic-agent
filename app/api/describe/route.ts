import { NextResponse } from "next/server"
import { generateText, Output } from "ai"
import { z } from "zod"

const schema = z.object({
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

export async function POST(req: Request) {
  const { code, title, companyName } = (await req.json()) as {
    code: string
    title: string
    companyName?: string
  }

  if (!code || !title) {
    return NextResponse.json({ error: "Missing code or title" }, { status: 400 })
  }

  try {
    const { experimental_output } = await generateText({
      model: "openai/gpt-5-mini",
      experimental_output: Output.object({ schema }),
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
    // Graceful fallback so onboarding still works without AI.
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
