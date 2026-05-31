"use client"

import { useEffect, useState } from "react"
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Loader2,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { getActivityCodesForSic, type ActivityCode } from "@/lib/activity-codes"
import type {
  SicDescription,
  ActivitySuggestion,
  SelectedActivity,
} from "@/lib/types"

type SicActivityGroup = {
  sicCode: string
  sicTitle: string
  isPrimary: boolean
  summary: string
  availableCodes: ActivityCode[]
  suggestions: ActivitySuggestion[]
  selectedCode: string | null
  loading: boolean
  expanded: boolean
}

export function ActivitiesStep({
  description,
  onBack,
  onContinue,
}: {
  description: SicDescription
  onBack: () => void
  onContinue: (activities: SelectedActivity[]) => void
}) {
  // Build list of all SIC codes: primary + secondaries
  const allSics = [
    {
      code: description.code,
      title: description.title,
      isPrimary: true,
      summary: description.summary,
    },
    ...description.secondary.map((s) => ({
      code: s.code,
      title: s.title,
      isPrimary: false,
      summary: s.summary,
    })),
  ]

  const [groups, setGroups] = useState<SicActivityGroup[]>(() =>
    allSics.map((sic) => ({
      sicCode: sic.code,
      sicTitle: sic.title,
      isPrimary: sic.isPrimary,
      summary: sic.summary,
      availableCodes: getActivityCodesForSic(sic.code),
      suggestions: [],
      selectedCode: null,
      loading: true,
      expanded: sic.isPrimary, // Primary expanded by default
    }))
  )

  // Fetch AI suggestions for each SIC
  useEffect(() => {
    groups.forEach((g, idx) => {
      if (g.availableCodes.length === 0) {
        // No activity codes for this SIC — mark as done
        setGroups((prev) =>
          prev.map((p, i) => (i === idx ? { ...p, loading: false } : p))
        )
        return
      }

      fetch("/api/suggest-activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sicCode: g.sicCode,
          sicTitle: g.sicTitle,
          summary: g.summary,
          revenueStreams: g.isPrimary ? description.relatedRevenueStreams : [],
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          setGroups((prev) =>
            prev.map((p, i) => {
              if (i !== idx) return p
              const suggestions: ActivitySuggestion[] = data.suggestions ?? []
              // Auto-select the best available match so the journey stays
              // frictionless: prefer a high-confidence hit, then the top
              // suggestion, then fall back to the first available code.
              const autoSelect =
                suggestions.find((s) => s.confidence === "high")?.code ??
                suggestions[0]?.code ??
                p.availableCodes[0]?.code ??
                null
              return {
                ...p,
                suggestions,
                selectedCode: autoSelect,
                loading: false,
              }
            })
          )
        })
        .catch(() => {
          setGroups((prev) =>
            prev.map((p, i) => (i === idx ? { ...p, loading: false } : p))
          )
        })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleExpand = (idx: number) => {
    setGroups((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, expanded: !p.expanded } : p))
    )
  }

  const selectActivity = (groupIdx: number, code: string) => {
    setGroups((prev) =>
      prev.map((p, i) =>
        i === groupIdx
          ? { ...p, selectedCode: p.selectedCode === code ? null : code }
          : p
      )
    )
  }

  const anyLoading = groups.some((g) => g.loading)

  // Only require selection for SICs that have activity codes
  const canContinue =
    !anyLoading &&
    groups.every(
      (g) => g.availableCodes.length === 0 || g.selectedCode !== null
    )

  // The client's overall risk rating is driven by the highest-risk activity
  // code selected across all of their SIC codes.
  const selectedRisks = groups
    .map((g) => g.availableCodes.find((a) => a.code === g.selectedCode)?.riskLevel)
    .filter(Boolean) as ("low" | "medium" | "high")[]
  const overallRisk: "low" | "medium" | "high" = selectedRisks.includes("high")
    ? "high"
    : selectedRisks.includes("medium")
      ? "medium"
      : "low"

  const handleContinue = () => {
    const selected: SelectedActivity[] = groups
      .filter((g) => g.selectedCode)
      .map((g) => {
        const act = g.availableCodes.find((a) => a.code === g.selectedCode)!
        return {
          sicCode: g.sicCode,
          sicTitle: g.sicTitle,
          activityCode: act.code,
          activityLabel: act.label,
          riskLevel: act.riskLevel,
        }
      })
    onContinue(selected)
  }

  const RiskIcon = ({ level }: { level: "low" | "medium" | "high" }) => {
    if (level === "low")
      return <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
    if (level === "medium")
      return <Shield className="h-3.5 w-3.5 text-amber-500" />
    return <ShieldAlert className="h-3.5 w-3.5 text-red-500" />
  }

  return (
    <div className="space-y-5">
      <Card className="border-border">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-start gap-3">
            <Sparkles
              className="mt-0.5 h-5 w-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div>
              <h2 className="font-serif text-lg font-semibold text-foreground">
                Confirm your specific activity codes
              </h2>
              <p className="text-sm text-muted-foreground text-pretty">
                Now that we know what you do, we map each SIC code to a 6-digit
                activity code. These are the codes that actually drive your
                business&apos;s risk rating, so we&apos;ve pre-selected the best
                match from your description — just confirm or change it.
              </p>
            </div>
          </div>

          {anyLoading ? (
            <div className="flex items-center gap-3 rounded-md border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
              <Spinner className="text-primary" />
              <span>Matching activity codes to your description…</span>
            </div>
          ) : (
            <div
              className={cn(
                "flex items-center justify-between gap-3 rounded-md border p-3",
                overallRisk === "low" && "border-green-200 bg-green-50",
                overallRisk === "medium" && "border-amber-200 bg-amber-50",
                overallRisk === "high" && "border-red-200 bg-red-50"
              )}
            >
              <div className="flex items-center gap-2">
                <RiskIcon level={overallRisk} />
                <span className="text-sm font-medium text-foreground">
                  Indicative risk rating
                </span>
              </div>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase",
                  overallRisk === "low" && "bg-green-100 text-green-700",
                  overallRisk === "medium" && "bg-amber-100 text-amber-700",
                  overallRisk === "high" && "bg-red-100 text-red-700"
                )}
              >
                {overallRisk} risk
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {groups.map((group, idx) => (
        <Card key={group.sicCode} className="border-border">
          <CardContent className="p-0">
            <button
              type="button"
              onClick={() => toggleExpand(idx)}
              className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 font-mono text-xs font-semibold",
                    group.isPrimary
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  )}
                >
                  {group.sicCode}
                </span>
                <span className="text-sm font-medium text-foreground text-pretty">
                  {group.sicTitle}
                </span>
                {group.isPrimary && (
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                    Primary
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {group.loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : group.selectedCode ? (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                ) : group.availableCodes.length === 0 ? (
                  <span className="text-xs text-muted-foreground">
                    No sub-activities
                  </span>
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                )}
                {group.expanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </button>

            {group.expanded && (
              <div className="border-t border-border p-4">
                {group.availableCodes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    This SIC code doesn&apos;t have specific activity
                    sub-categories defined. It will be recorded as-is.
                  </p>
                ) : group.loading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Spinner size="sm" />
                    <span>Finding best matches…</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {group.suggestions.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          AI Suggestions
                        </p>
                        <ul className="space-y-2">
                          {group.suggestions.map((s) => {
                            const isSelected = group.selectedCode === s.code
                            return (
                              <li key={s.code}>
                                <button
                                  type="button"
                                  onClick={() => selectActivity(idx, s.code)}
                                  className={cn(
                                    "flex w-full items-start gap-3 rounded-md border p-3 text-left transition-colors",
                                    isSelected
                                      ? "border-primary bg-primary/5"
                                      : "border-border hover:border-primary/50 hover:bg-muted/30"
                                  )}
                                >
                                  <div
                                    className={cn(
                                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                                      isSelected
                                        ? "border-primary bg-primary"
                                        : "border-muted-foreground/30"
                                    )}
                                  >
                                    {isSelected && (
                                      <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                                    )}
                                  </div>
                                  <div className="flex-1 space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="font-mono text-xs font-semibold text-foreground">
                                        {s.code}
                                      </span>
                                      <span className="text-sm font-medium text-foreground">
                                        {s.label}
                                      </span>
                                      <span
                                        className={cn(
                                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase",
                                          s.confidence === "high" &&
                                            "bg-primary/10 text-primary",
                                          s.confidence === "medium" &&
                                            "bg-amber-100 text-amber-700",
                                          s.confidence === "low" &&
                                            "bg-muted text-muted-foreground"
                                        )}
                                      >
                                        {s.confidence} match
                                      </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {s.reason}
                                    </p>
                                    <div className="flex items-center gap-1.5 text-xs">
                                      <RiskIcon level={s.riskLevel} />
                                      <span className="capitalize text-muted-foreground">
                                        {s.riskLevel} risk
                                      </span>
                                    </div>
                                  </div>
                                </button>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    )}

                    {/* Show other available codes not in suggestions */}
                    {group.availableCodes.filter(
                      (a) => !group.suggestions.some((s) => s.code === a.code)
                    ).length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Other options
                        </p>
                        <ul className="grid gap-2 sm:grid-cols-2">
                          {group.availableCodes
                            .filter(
                              (a) =>
                                !group.suggestions.some(
                                  (s) => s.code === a.code
                                )
                            )
                            .map((a) => {
                              const isSelected = group.selectedCode === a.code
                              return (
                                <li key={a.code}>
                                  <button
                                    type="button"
                                    onClick={() => selectActivity(idx, a.code)}
                                    className={cn(
                                      "flex w-full items-center gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors",
                                      isSelected
                                        ? "border-primary bg-primary/5"
                                        : "border-border hover:border-primary/50"
                                    )}
                                  >
                                    <div
                                      className={cn(
                                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                                        isSelected
                                          ? "border-primary bg-primary"
                                          : "border-muted-foreground/30"
                                      )}
                                    >
                                      {isSelected && (
                                        <CheckCircle2 className="h-2.5 w-2.5 text-primary-foreground" />
                                      )}
                                    </div>
                                    <span className="font-mono text-xs text-muted-foreground">
                                      {a.code}
                                    </span>
                                    <span className="flex-1 truncate text-foreground">
                                      {a.label}
                                    </span>
                                    <RiskIcon level={a.riskLevel} />
                                  </button>
                                </li>
                              )
                            })}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
        <Button variant="ghost" onClick={onBack} disabled={anyLoading}>
          Back
        </Button>
        <Button
          disabled={!canContinue}
          onClick={handleContinue}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Continue
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
