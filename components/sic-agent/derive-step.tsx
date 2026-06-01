"use client"

import { useEffect, useState } from "react"
import {
  ArrowRight,
  CheckCircle2,
  FileSearch,
  Info,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import type {
  DerivedSicSuggestion,
  SecondarySicDescription,
  SicDescription,
} from "@/lib/types"

export function DeriveStep({
  description,
  registeredCodes,
  companyName,
  onBack,
  onConfirm,
}: {
  description: SicDescription
  /** All SIC codes already registered at Companies House (primary + secondary). */
  registeredCodes: string[]
  companyName: string
  onBack: () => void
  onConfirm: (result: SicDescription) => void
}) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<DerivedSicSuggestion[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch("/api/derive-sics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        summary: description.summary,
        revenueStreams: description.relatedRevenueStreams,
        registeredCodes,
        primaryTitle: description.title,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        if (data.error) {
          setError(data.error)
          return
        }
        const next: DerivedSicSuggestion[] = data.suggestions ?? []
        setSuggestions(next)
        // Pre-select high/medium confidence matches so the journey stays light.
        setSelected(
          new Set(
            next
              .filter((s) => s.confidence !== "low")
              .map((s) => s.code)
          )
        )
      })
      .catch(() => !cancelled && setError("Couldn't map your revenue streams."))
      .finally(() => !cancelled && setLoading(false))

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggle = (code: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(code)) next.delete(code)
      else next.add(code)
      return next
    })
  }

  const handleContinue = () => {
    const declared: SecondarySicDescription[] = suggestions
      .filter((s) => selected.has(s.code))
      .map((s) => ({
        code: s.code,
        title: s.title,
        section: s.section,
        summary: s.summary,
        registered: false,
        sourceRevenueStream: s.sourceRevenueStream,
      }))

    onConfirm({
      ...description,
      // Rebuild from registered secondaries only, then append the freshly
      // confirmed declared ones. This keeps things idempotent if the user
      // navigates back into this step.
      secondary: [
        ...description.secondary.filter((s) => s.registered),
        ...declared,
      ],
    })
  }

  return (
    <div className="space-y-5">
      <Card className="border-border">
        <CardContent className="space-y-4 p-5">
          <div className="flex items-start gap-3">
            <FileSearch
              className="mt-0.5 h-5 w-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div>
              <h2 className="font-serif text-lg font-semibold text-foreground">
                Additional activities to record
              </h2>
              <p className="text-sm text-muted-foreground text-pretty">
                The extra revenue streams you mentioned map to real SIC codes
                that{" "}<strong>{companyName}</strong>{" "}hasn&apos;t registered at
                Companies House yet.
                These still affect your risk profile, so confirm the ones we
                should record as declared activities.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center gap-3 rounded-md border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
              <Spinner className="text-primary" />
              <span>Mapping your revenue streams to SIC codes…</span>
            </div>
          ) : error ? (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </div>
          ) : suggestions.length === 0 ? (
            <div className="flex items-start gap-2.5 rounded-md border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                We couldn&apos;t confidently map your additional revenue streams
                to a separate SIC code. They&apos;ll stay recorded against your
                primary activity — no extra codes needed.
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>
                  These will be added as your{" "}
                  <span className="font-semibold">secondary</span>
                  {" "}activities and flagged as &ldquo;not yet registered&rdquo;
                  {" "}— your primary SIC code stays unchanged.
                </span>
              </div>

              <ul className="space-y-2">
                {suggestions.map((s) => {
                  const isSelected = selected.has(s.code)
                  return (
                    <li key={s.code}>
                      <button
                        type="button"
                        onClick={() => toggle(s.code)}
                        aria-pressed={isSelected}
                        className={cn(
                          "flex w-full items-start gap-3 rounded-md border p-3 text-left transition-colors",
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 hover:bg-muted/30"
                        )}
                      >
                        <div
                          className={cn(
                            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2",
                            isSelected
                              ? "border-primary bg-primary"
                              : "border-muted-foreground/30"
                          )}
                        >
                          {isSelected && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-primary-foreground" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-md bg-secondary px-2 py-0.5 font-mono text-xs font-semibold text-secondary-foreground">
                              {s.code}
                            </span>
                            <span className="text-sm font-medium text-foreground text-pretty">
                              {s.title}
                            </span>
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase",
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
                          <p className="text-xs text-muted-foreground text-pretty">
                            {s.summary}
                          </p>
                          <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Sparkles
                              className="h-3 w-3 text-accent"
                              aria-hidden="true"
                            />
                            From your revenue stream:{" "}
                            <span className="font-medium text-foreground/80">
                              {s.sourceRevenueStream}
                            </span>
                          </p>
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
        <Button variant="ghost" onClick={onBack} disabled={loading}>
          Back
        </Button>
        <Button
          disabled={loading}
          onClick={handleContinue}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {suggestions.length > 0 && selected.size > 0
            ? `Add ${selected.size} & find activity codes`
            : "Continue to activity codes"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
