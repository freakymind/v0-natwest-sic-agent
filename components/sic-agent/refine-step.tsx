"use client"

import { useEffect, useState } from "react"
import {
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Loader2,
  Plus,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import type { SicMatch } from "@/lib/types"

export function RefineStep({
  summary,
  primaryCode,
  primaryTitle,
  revenueStreams,
  registeredCodes,
  onBack,
  onContinue,
}: {
  summary: string
  primaryCode: string
  primaryTitle: string
  revenueStreams: string[]
  /** SIC codes already on the Companies House profile — exclude from suggestions. */
  registeredCodes: string[]
  onBack: () => void
  onContinue: (added: SicMatch[]) => void
}) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [matches, setMatches] = useState<SicMatch[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetch("/api/match-sic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        summary,
        primaryCode,
        primaryTitle,
        revenueStreams,
        exclude: registeredCodes,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        if (data.error) {
          setError(data.error)
          setMatches([])
        } else {
          setMatches(data.matches ?? [])
        }
      })
      .catch(() => {
        if (cancelled) return
        setError("Couldn't find related SIC codes.")
      })
      .finally(() => !cancelled && setLoading(false))

    return () => {
      cancelled = true
    }
  }, [summary, primaryCode, primaryTitle, revenueStreams, registeredCodes])

  const toggle = (code: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(code)) next.delete(code)
      else next.add(code)
      return next
    })
  }

  const selectedMatches = matches.filter((m) => selected.has(m.code))

  return (
    <Card className="border-border">
      <CardContent className="space-y-5 p-5">
        <div className="flex items-start gap-3 rounded-md border border-accent/30 bg-accent/5 p-4">
          <Lightbulb
            className="mt-0.5 h-5 w-5 shrink-0 text-accent"
            aria-hidden="true"
          />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              Anything else that fits?
            </p>
            <p className="text-sm text-foreground/80 text-pretty">
              Based on your description, we&apos;ve found other UK SIC codes
              that may match work your business does. Add any that apply — your
              primary SIC stays the same.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 rounded-md border border-dashed border-border bg-muted/30 p-6 text-sm text-muted-foreground">
            <Spinner className="text-primary" />
            <span>Searching the SIC catalog for matches…</span>
          </div>
        ) : error ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {error}
          </div>
        ) : matches.length === 0 ? (
          <div className="flex items-start gap-3 rounded-md border border-dashed border-border bg-muted/30 p-4 text-sm text-foreground/80">
            <Sparkles
              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <p>
              No additional SIC codes found that match your description. Your
              primary SIC code already covers the main activity.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {matches.length} suggested {matches.length === 1 ? "match" : "matches"}
            </p>
            <ul className="space-y-2">
              {matches.map((m) => {
                const isSelected = selected.has(m.code)
                return (
                  <li key={m.code}>
                    <button
                      type="button"
                      onClick={() => toggle(m.code)}
                      aria-pressed={isSelected}
                      className={cn(
                        "group flex w-full items-start gap-3 rounded-md border p-3 text-left transition-colors",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border bg-background hover:border-primary hover:bg-secondary",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-transparent",
                        )}
                        aria-hidden="true"
                      >
                        {isSelected ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Plus className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs font-semibold text-primary">
                            {m.code}
                          </span>
                          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                            {m.section}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-foreground text-pretty">
                          {m.title}
                        </p>
                        <p className="text-xs text-muted-foreground text-pretty">
                          {m.reason}
                        </p>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-between">
          <Button variant="ghost" onClick={onBack} disabled={loading}>
            Back
          </Button>
          <Button
            onClick={() => onContinue(selectedMatches)}
            disabled={loading}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Loading
              </>
            ) : (
              <>
                {selectedMatches.length > 0
                  ? `Add ${selectedMatches.length} & continue`
                  : "Skip & continue"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
