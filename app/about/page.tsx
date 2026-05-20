import Link from "next/link"
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  FileSearch,
  ListChecks,
  MessageSquareText,
  Shield,
  Sparkles,
  Wand2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BrandHeader } from "@/components/sic-agent/brand-header"

export const metadata = {
  title: "How the SIC Agent works · NatWest Business Onboarding",
  description:
    "Why SIC codes break onboarding, and how the NatWest SIC Agent uses Companies House data and AI to fix it in minutes.",
}

const problems = [
  {
    icon: AlertTriangle,
    title: "SIC codes are opaque",
    body: "There are over 600 UK SIC codes written in dense regulatory language. Most business owners can't tell which one truly fits.",
  },
  {
    icon: AlertTriangle,
    title: "Wrong codes block onboarding",
    body: "An incorrect SIC triggers manual review, KYC delays, and re-papering. It's the single biggest stall in business account opening.",
  },
  {
    icon: AlertTriangle,
    title: "Multiple income streams aren't captured",
    body: "Companies often earn from several activities, but onboarding forms force one tickbox and lose the real picture of the business.",
  },
]

const steps = [
  {
    icon: FileSearch,
    title: "Pull from Companies House",
    body: "Enter a company number. We fetch the verified profile and registered SIC codes directly from the UK Companies House public register.",
  },
  {
    icon: MessageSquareText,
    title: "Identify the primary income",
    body: "If the company has multiple SICs, the agent asks a single conversational question to pin down the main source of income.",
  },
  {
    icon: Wand2,
    title: "Describe the business in plain English",
    body: "AI turns the SIC into a clear, editable description of what the business actually does, plus typical adjacent revenue streams to confirm or skip.",
  },
  {
    icon: Shield,
    title: "Select specific activity codes",
    body: "Each SIC maps to multiple 6-digit activity codes for risk/compliance. The AI pre-selects the best match based on your description — just confirm or pick another.",
  },
  {
    icon: Sparkles,
    title: "Refine with smart matches",
    body: "The agent reads the user's edited description and suggests additional SIC codes from a curated catalog that match what they actually wrote.",
  },
  {
    icon: ListChecks,
    title: "Confirm a complete picture",
    body: "All registered SICs, activity codes with risk levels, agent-suggested additions, and revenue streams are summarised in one place for the customer to confirm.",
  },
]

const benefits = [
  {
    title: "Faster account opening",
    body: "What used to be a back-office query becomes a 60-second self-serve flow.",
  },
  {
    title: "Cleaner KYC data",
    body: "Verified Companies House data plus structured user confirmation reduces remediation cases downstream.",
  },
  {
    title: "Better customer experience",
    body: "Plain-English descriptions instead of regulatory jargon, with the customer in control of edits.",
  },
  {
    title: "Lower onboarding cost",
    body: "Fewer manual reviews, fewer re-keyed forms, fewer customers dropping off.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-svh bg-background">
      <BrandHeader
        rightSlot={
          <Link
            href="/"
            className="text-primary-foreground/90 hover:text-primary-foreground hover:underline"
          >
            Back to agent
          </Link>
        }
      />

      <main className="mx-auto max-w-5xl px-6 py-10 sm:py-16">
        <section className="flex flex-col gap-6">
          <div className="flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-secondary px-3 py-1 text-xs font-medium text-primary">
            <Shield className="h-3.5 w-3.5" aria-hidden="true" />
            Onboarding intelligence
          </div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground text-balance sm:text-5xl">
            Solving the SIC code problem in business onboarding.
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            SIC codes decide how a business is classified, risk-scored and
            onboarded — yet they&apos;re the single most misunderstood field on
            any application form. The NatWest SIC Agent fixes that by combining
            verified Companies House data with an AI assistant that talks to the
            customer in plain English.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="lg">
              <Link href="/">
                Try the agent
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#how-it-works">See how it works</a>
            </Button>
          </div>
        </section>

        <section className="mt-16 sm:mt-24">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              The problem
            </p>
            <h2 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              Why SIC codes break onboarding
            </h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {problems.map(({ icon: Icon, title, body }) => (
              <Card key={title} className="border-border">
                <CardHeader className="gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-base">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="mt-16 sm:mt-24">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              How it works
            </p>
            <h2 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              Six steps from company number to confirmed activity
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              The agent guides the customer through a short conversation. Each
              step does one thing well, and every output is editable.
            </p>
          </div>

          <ol className="mt-8 flex flex-col gap-3">
            {steps.map(({ icon: Icon, title, body }, idx) => (
              <li
                key={title}
                className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 sm:flex-row sm:items-start sm:gap-5"
              >
                <div className="flex items-center gap-3 sm:flex-col sm:items-start">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground sm:mt-1">
                    Step {idx + 1}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-serif text-lg font-semibold tracking-tight">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16 sm:mt-24">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              What&apos;s different
            </p>
            <h2 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              Why this works where forms fail
            </h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {benefits.map(({ title, body }) => (
              <Card key={title} className="border-border">
                <CardHeader className="flex-row items-start gap-3 space-y-0">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 text-accent"
                    aria-hidden="true"
                  />
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-base">{title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {body}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-16 sm:mt-24">
          <Card className="border-primary/20 bg-secondary">
            <CardHeader className="gap-3">
              <div className="flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-background px-3 py-1 text-xs font-medium text-primary">
                <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                Under the hood
              </div>
              <CardTitle className="font-serif text-xl">
                Verified data, plain-English understanding
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">
                  UK Companies House Public Data API
                </span>{" "}
                provides the registered company name, status, address and SIC
                codes. This is the regulatory source of truth — no guessing.
              </p>
              <p>
                <span className="font-medium text-foreground">
                  SIC to Activity Code mapping
                </span>{" "}
                bridges the ~600 public SIC codes to ~1,200 internal 6-digit
                activity codes used for risk and compliance classification. The
                AI suggests the most likely activity based on what the customer
                wrote, turning a scroll-heavy dropdown into a one-click confirm.
              </p>
              <p>
                <span className="font-medium text-foreground">
                  AI SDK with structured output
                </span>{" "}
                turns each SIC into a friendly description, suggests adjacent
                revenue streams that similar businesses earn from, and matches
                the customer&apos;s edited description against a curated SIC
                catalog to surface codes they may have missed.
              </p>
              <p>
                The customer always has the final say. Every description,
                revenue stream, activity code and SIC suggestion is editable,
                removable or replaceable with a custom entry before confirmation.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mt-16 flex flex-col items-start gap-4 sm:mt-24">
          <h2 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
            Ready to see it?
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Try the agent with a real UK company number, or pick one of the
            demo companies on the start screen.
          </p>
          <Button asChild size="lg">
            <Link href="/">
              Start the SIC agent
              <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </section>
      </main>

      <footer className="mt-16 border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            NatWest Business Onboarding · SIC Agent demo
          </span>
          <span>
            Data from{" "}
            <a
              href="https://developer.company-information.service.gov.uk/"
              target="_blank"
              rel="noreferrer"
              className="underline-offset-2 hover:underline"
            >
              UK Companies House
            </a>
          </span>
        </div>
      </footer>
    </div>
  )
}
