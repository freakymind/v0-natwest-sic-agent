"use client"

import {
  CheckCircle2,
  Building2,
  Coins,
  Star,
  RotateCcw,
  Sparkles,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Hash,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type {
  CompanyProfile,
  SicDescription,
  SicMatch,
  SelectedActivity,
} from "@/lib/types"

const RiskBadge = ({ level }: { level: "low" | "medium" | "high" }) => {
  const Icon =
    level === "low" ? ShieldCheck : level === "medium" ? Shield : ShieldAlert
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
        level === "low" && "bg-green-100 text-green-700",
        level === "medium" && "bg-amber-100 text-amber-700",
        level === "high" && "bg-red-100 text-red-700"
      )}
    >
      <Icon className="h-3 w-3" />
      {level} risk
    </span>
  )
}

export function ConfirmStep({
  profile,
  primary,
  description,
  activities,
  addedSics,
  onRestart,
}: {
  profile: CompanyProfile
  primary: { code: string; title: string }
  description: SicDescription
  activities: SelectedActivity[]
  addedSics: SicMatch[]
  onRestart: () => void
}) {
  const primaryActivity = activities.find((a) => a.sicCode === primary.code)
  const secondaryActivities = activities.filter(
    (a) => a.sicCode !== primary.code
  )

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
              business profile for compliance purposes.
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

            {primaryActivity && (
              <div className="mt-3 rounded-md border border-primary/20 bg-background p-3">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Hash className="h-3 w-3" aria-hidden="true" />
                  Activity code
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-sm font-semibold text-primary">
                    {primaryActivity.activityCode}
                  </span>
                  <span className="text-sm text-foreground">
                    {primaryActivity.activityLabel}
                  </span>
                  <RiskBadge level={primaryActivity.riskLevel} />
                </div>
              </div>
            )}

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

        {description.secondary.length > 0 && (
          <section className="space-y-2">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Coins className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              Other registered income streams
            </h3>
            <ul className="space-y-2">
              {description.secondary.map((s) => {
                const act = secondaryActivities.find(
                  (a) => a.sicCode === s.code
                )
                return (
                  <li
                    key={s.code}
                    className="rounded-md border border-border bg-muted/40 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-secondary px-2 py-0.5 font-mono text-xs font-semibold text-secondary-foreground">
                        {s.code}
                      </span>
                      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                        {s.section}
                      </span>
                      <span className="text-sm font-medium text-foreground text-pretty">
                        {s.title}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/85 text-pretty">
                      {s.summary}
                    </p>
                    {act && (
                      <div className="mt-2 flex flex-wrap items-center gap-2 rounded bg-background px-2 py-1.5 text-xs">
                        <Hash className="h-3 w-3 text-muted-foreground" />
                        <span className="font-mono font-semibold text-secondary-foreground">
                          {act.activityCode}
                        </span>
                        <span className="text-foreground/80">
                          {act.activityLabel}
                        </span>
                        <RiskBadge level={act.riskLevel} />
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        )}

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
