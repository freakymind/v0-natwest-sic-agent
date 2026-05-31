"use client"

import {
  CheckCircle2,
  Building2,
  Coins,
  Star,
  RotateCcw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Hash,
  BadgeCheck,
  AlertTriangle,
} from "lucide-react"
import type { SecondarySicDescription } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type {
  CompanyProfile,
  SicDescription,
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

function SecondaryItem({
  sic,
  activity,
  declared = false,
}: {
  sic: SecondarySicDescription
  activity?: SelectedActivity
  declared?: boolean
}) {
  return (
    <li
      className={cn(
        "rounded-md border p-4",
        declared
          ? "border-amber-200 bg-amber-50/50"
          : "border-border bg-muted/40"
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-secondary px-2 py-0.5 font-mono text-xs font-semibold text-secondary-foreground">
          {sic.code}
        </span>
        <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
          {sic.section}
        </span>
        <span className="text-sm font-medium text-foreground text-pretty">
          {sic.title}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-foreground/85 text-pretty">
        {sic.summary}
      </p>
      {declared && sic.sourceRevenueStream && (
        <p className="mt-1 text-[11px] text-muted-foreground">
          From your revenue stream:{" "}
          <span className="font-medium text-foreground/80">
            {sic.sourceRevenueStream}
          </span>
        </p>
      )}
      {activity && (
        <div className="mt-2 flex flex-wrap items-center gap-2 rounded bg-background px-2 py-1.5 text-xs">
          <Hash className="h-3 w-3 text-muted-foreground" />
          <span className="font-mono font-semibold text-secondary-foreground">
            {activity.activityCode}
          </span>
          <span className="text-foreground/80">{activity.activityLabel}</span>
          <RiskBadge level={activity.riskLevel} />
        </div>
      )}
    </li>
  )
}

export function ConfirmStep({
  profile,
  primary,
  description,
  activities,
  onRestart,
}: {
  profile: CompanyProfile
  primary: { code: string; title: string }
  description: SicDescription
  activities: SelectedActivity[]
  onRestart: () => void
}) {
  const primaryActivity = activities.find((a) => a.sicCode === primary.code)
  const secondaryActivities = activities.filter(
    (a) => a.sicCode !== primary.code
  )
  const registeredSecondary = description.secondary.filter((s) => s.registered)
  const declaredSecondary = description.secondary.filter((s) => !s.registered)

  // Overall client risk is driven by the highest-risk activity code selected.
  const risks = activities.map((a) => a.riskLevel)
  const overallRisk: "low" | "medium" | "high" = risks.includes("high")
    ? "high"
    : risks.includes("medium")
      ? "medium"
      : "low"
  const OverallRiskIcon =
    overallRisk === "low"
      ? ShieldCheck
      : overallRisk === "medium"
        ? Shield
        : ShieldAlert

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

        {activities.length > 0 && (
          <section className="space-y-2">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Risk assessment
            </h3>
            <div
              className={cn(
                "flex items-center justify-between gap-3 rounded-md border p-4",
                overallRisk === "low" && "border-green-200 bg-green-50",
                overallRisk === "medium" && "border-amber-200 bg-amber-50",
                overallRisk === "high" && "border-red-200 bg-red-50"
              )}
            >
              <div className="flex items-center gap-3">
                <OverallRiskIcon
                  className={cn(
                    "h-6 w-6 shrink-0",
                    overallRisk === "low" && "text-green-600",
                    overallRisk === "medium" && "text-amber-500",
                    overallRisk === "high" && "text-red-500"
                  )}
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Indicative client risk rating
                  </p>
                  <p className="text-xs text-muted-foreground text-pretty">
                    Derived from the {activities.length} activity code
                    {activities.length === 1 ? "" : "s"} you confirmed.
                  </p>
                </div>
              </div>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-sm font-semibold uppercase",
                  overallRisk === "low" && "bg-green-100 text-green-700",
                  overallRisk === "medium" && "bg-amber-100 text-amber-700",
                  overallRisk === "high" && "bg-red-100 text-red-700"
                )}
              >
                {overallRisk} risk
              </span>
            </div>
          </section>
        )}

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

        {registeredSecondary.length > 0 && (
          <section className="space-y-2">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Coins className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              Other registered income streams
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold normal-case text-green-700">
                <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                Companies House
              </span>
            </h3>
            <ul className="space-y-2">
              {registeredSecondary.map((s) => (
                <SecondaryItem
                  key={s.code}
                  sic={s}
                  activity={secondaryActivities.find(
                    (a) => a.sicCode === s.code
                  )}
                />
              ))}
            </ul>
          </section>
        )}

        {declaredSecondary.length > 0 && (
          <section className="space-y-2">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Coins className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
              Declared activities
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold normal-case text-amber-700">
                <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                Not yet registered
              </span>
            </h3>
            <p className="-mt-1 text-xs text-muted-foreground text-pretty">
              Surfaced from the extra revenue streams you mentioned. These are
              not filed at Companies House but are recorded against your profile
              for risk assessment.
            </p>
            <ul className="space-y-2">
              {declaredSecondary.map((s) => (
                <SecondaryItem
                  key={s.code}
                  sic={s}
                  activity={secondaryActivities.find(
                    (a) => a.sicCode === s.code
                  )}
                  declared
                />
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
