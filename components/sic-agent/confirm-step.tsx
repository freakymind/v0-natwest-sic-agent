"use client"

import {
  CheckCircle2,
  Building2,
  Star,
  RotateCcw,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { CompanyProfile, SicDescription, SicMatch } from "@/lib/types"

export function ConfirmStep({
  profile,
  primary,
  description,
  addedSics,
  onRestart,
}: {
  profile: CompanyProfile
  primary: { code: string; title: string }
  description: SicDescription
  addedSics: SicMatch[]
  onRestart: () => void
}) {
  const otherCodes = profile.sic_codes.filter((c) => c.code !== primary.code)

  return (
    <Card className="border-border">
      <CardContent className="space-y-6 p-5">
        <div className="flex items-start gap-3 rounded-md border border-primary/20 bg-primary/5 p-4">
          <CheckCircle2
            className="mt-0.5 h-5 w-5 shrink-0 text-primary"
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-semibold text-primary">
              Ready to confirm
            </p>
            <p className="text-sm text-foreground/80">
              Please review the summary below. We&apos;ll attach this to your
              business profile.
            </p>
          </div>
        </div>

        <section className="space-y-2">
          <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
            Business
          </h3>
          <div className="rounded-md border border-border bg-card p-4">
            <p className="font-serif text-lg font-semibold text-foreground">
              {profile.company_name}
            </p>
            <dl className="mt-2 grid gap-x-6 gap-y-1 text-sm text-muted-foreground sm:grid-cols-2">
              <div className="flex gap-1">
                <dt className="text-foreground/70">Number:</dt>
                <dd className="font-mono">{profile.company_number}</dd>
              </div>
              <div className="flex gap-1">
                <dt className="text-foreground/70">Status:</dt>
                <dd className="capitalize">{profile.company_status}</dd>
              </div>
              <div className="flex gap-1">
                <dt className="text-foreground/70">Type:</dt>
                <dd className="uppercase">{profile.type}</dd>
              </div>
              <div className="flex gap-1">
                <dt className="text-foreground/70">Incorporated:</dt>
                <dd>{profile.date_of_creation}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Star className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            Primary SIC code
          </h3>
          <div className="rounded-md border border-primary/30 bg-primary/5 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-primary px-2 py-0.5 font-mono text-xs font-semibold text-primary-foreground">
                {primary.code}
              </span>
              <span className="text-sm font-medium text-foreground text-pretty">
                {primary.title}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90 text-pretty">
              {description.summary}
            </p>
            {description.relatedRevenueStreams.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Other revenue streams
                </p>
                <ul className="mt-1.5 flex flex-wrap gap-1.5">
                  {description.relatedRevenueStreams.map((a) => (
                    <li
                      key={a}
                      className="rounded-full border border-primary/20 bg-background px-2.5 py-1 text-xs text-foreground"
                    >
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {addedSics.length > 0 && (
          <section className="space-y-2">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              Added based on your description
            </h3>
            <ul className="space-y-2">
              {addedSics.map((c) => (
                <li
                  key={c.code}
                  className="rounded-md border border-accent/30 bg-accent/5 p-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-accent/15 px-2 py-0.5 font-mono text-xs font-semibold text-accent">
                      {c.code}
                    </span>
                    <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                      {c.section}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-foreground text-pretty">
                    {c.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground text-pretty">
                    {c.reason}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {otherCodes.length > 0 && (
          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Other registered SIC codes
            </h3>
            <ul className="space-y-1.5">
              {otherCodes.map((c) => (
                <li
                  key={c.code}
                  className="flex items-start gap-2 rounded-md border border-border bg-muted/40 p-3 text-sm"
                >
                  <span className="font-mono text-xs font-semibold text-muted-foreground">
                    {c.code}
                  </span>
                  <span className="text-foreground/80 text-pretty">
                    {c.title}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          <Button variant="ghost" onClick={onRestart}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Start over
          </Button>
          <Button
            onClick={onRestart}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Confirm and continue
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
