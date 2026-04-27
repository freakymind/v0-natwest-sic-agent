import { NextResponse } from "next/server"
import { generateText, Output } from "ai"
import { z } from "zod"

const schema = z.object({
  summary: z
    .string()
    .describe(
      "A clear, friendly 2-3 sentence description of what a business with this SIC code typically does. Written in second person, as if describing the user's business to them.",
    ),
  activities: z
    .array(z.string())
    .min(4)
    .max(6)
    .describe(
      "4-6 short, concrete day-to-day activities a business with this SIC code commonly carries out. Each activity should be 4-10 words, sentence case, no trailing punctuation.",
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
        "You help UK business customers describe their company to their bank during onboarding. Be concise, plain-English, and specific to UK SIC 2007 classifications. Avoid jargon.",
      prompt: `Company: ${companyName ?? "(unnamed)"}\nSIC code: ${code}\nOfficial title: ${title}\n\nGenerate a friendly description and list of typical activities.`,
    })

    return NextResponse.json({
      code,
      title,
      summary: experimental_output.summary,
      activities: experimental_output.activities,
    })
  } catch (err) {
    console.log("[v0] describe error:", (err as Error).message)
    // Graceful fallback so onboarding still works without AI.
    return NextResponse.json({
      code,
      title,
      summary: `Your business is classified under "${title}". This covers the day-to-day commercial activities associated with SIC code ${code}.`,
      activities: [
        "Serve customers and process sales",
        "Manage suppliers and inventory",
        "Handle invoicing and payments",
        "Maintain regulatory compliance",
      ],
    })
  }
}
