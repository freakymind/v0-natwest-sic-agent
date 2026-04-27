"use client"

import { useEffect, useState } from "react"
import {
  ArrowRight,
  Coins,
  Loader2,
  Pencil,
  Plus,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import type { SicCode } from "@/lib/sic-codes"
import type { SecondarySicDescription, SicDescription } from "@/lib/types"

export function DescribeStep({
  sic,
  secondarySics,
  companyName,
  onBack,
  onConfirm,
}: {
  sic: SicCode
  /** Other SIC codes the company has registered — described as additional income streams. */
  secondarySics: SicCode[]
  companyName: string
  onBack: () => void
  onConfirm: (result: SicDescription) => void
}) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [customMode, setCustomMode] = useState(false)
  const [customInput, setCustomInput] = useState("")
  const [customList, setCustomList] = useState<string[]>([])
  // code -> editable summary for each non-primary SIC
  const [secondarySummaries, setSecondarySummaries] = useState<
    Record<string, string>
  >({})

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    const primary = fetch("/api/describe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: sic.code,
        title: sic.title,
        companyName,
      }),
    }).then((r) => r.json())

    const secondaries = secondarySics.map((s) =>
      fetch("/api/describe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: s.code,
          title: s.title,
          companyName,
          mode: "secondary",
          primaryTitle: sic.title,
        }),
      }).then((r) => r.json()),
    )

    Promise.all([primary, ...secondaries])
      .then(([primaryData, ...secondaryData]) => {
        if (cancelled) return
        if (primaryData.error) {
          setError(primaryData.error)
          return
        }
        setSummary(primaryData.summary)
        const streams: string[] = primaryData.relatedRevenueStreams ?? []
        setSuggestions(streams)
        setSelected(new Set())

        const map: Record<string, string> = {}
        for (const sec of secondaryData) {
          if (sec?.code) map[sec.code] = sec.summary ?? ""
        }
        setSecondarySummaries(map)
      })
      .catch(() => !cancelled && setError("Couldn't generate a description."))
      .finally(() => !cancelled && setLoading(false))

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sic.code, sic.title, companyName, secondarySics.map((s) => s.code).join(",")])

  const toggle = (a: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(a)) next.delete(a)
      else next.add(a)
      return next
    })
  }

  const addCustom = () => {
    const v = customInput.trim()
    if (!v) return
    setCustomList((prev) => [...prev, v])
    setSelected((prev) => new Set(prev).add(v))
    setCustomInput("")
  }

  const removeCustom = (v: string) => {
    setCustomList((prev) => prev.filter((x) => x !== v))
    setSelected((prev) => {
      const next = new Set(prev)
      next.delete(v)
      return next
    })
  }

  const allOptions = [...suggestions, ...customList]
  const canConfirm =
    summary.trim().length > 0 &&
    secondarySics.every(
      (s) => (secondarySummaries[s.code] ?? "").trim().length > 0,
    )

  const handleConfirm = () => {
    const secondary: SecondarySicDescription[] = secondarySics.map((s) => ({
      code: s.code,
      title: s.title,
      section: s.section,
      summary: (secondarySummaries[s.code] ?? "").trim(),
    }))
    onConfirm({
      code: sic.code,
      title: sic.title,
      summary: summary.trim(),
      relatedRevenueStreams: Array.from(selected),
      secondary,
    })
  }

  return (
    <div className="space-y-5">
      <Card className="border-border">
        <CardContent className="space-y-5 p-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs font-semibold text-primary">
                {sic.code}
              </span>
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {sic.section}
              </span>
              <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                Primary
              </span>
            </div>
            <h2 className="font-serif text-xl font-semibold text-foreground text-balance">
              {sic.title}
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center gap-3 rounded-md border border-dashed border-border bg-muted/30 p-6 text-sm text-muted-foreground">
              <Spinner className="text-primary" />
              <span>
                Generating descriptions for your business
                {secondarySics.length > 0
                  ? ` and ${secondarySics.length} other registered ${secondarySics.length === 1 ? "activity" : "activities"}`
                  : ""}
                …
              </span>
            </div>
          ) : error ? (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </div>
          ) : (
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="summary" className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  What your business does
                  <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-normal text-muted-foreground">
                    <Pencil className="h-3 w-3" aria-hidden="true" />
                    You can edit
                  </span>
                </FieldLabel>
                <Textarea
                  id="summary"
                  rows={4}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="resize-y"
                />
              </Field>

              <Field>
                <FieldLabel className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                  Other revenue streams
                </FieldLabel>
                <p className="-mt-1 text-xs text-muted-foreground text-pretty">
                  Common additional income sources for businesses similar to
                  yours, including work done under closely related SIC codes.
                  Select any that apply, or add your own.
                </p>

                <ul className="flex flex-wrap gap-2">
                  {allOptions.map((a) => {
                    const isCustom = customList.includes(a)
                    const isSelected = selected.has(a)
                    return (
                      <li key={a}>
                        <button
                          type="button"
                          onClick={() => toggle(a)}
                          aria-pressed={isSelected}
                          className={cn(
                            "group inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background text-foreground hover:border-primary hover:bg-secondary",
                          )}
                        >
                          {a}
                          {isCustom && (
                            <span
                              role="button"
                              tabIndex={0}
                              aria-label={`Remove ${a}`}
                              onClick={(e) => {
                                e.stopPropagation()
                                removeCustom(a)
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  removeCustom(a)
                                }
                              }}
                              className={cn(
                                "rounded-full p-0.5 transition-colors",
                                isSelected
                                  ? "hover:bg-primary-foreground/20"
                                  : "hover:bg-muted",
                              )}
                            >
                              <X className="h-3 w-3" aria-hidden="true" />
                            </span>
                          )}
                        </button>
                      </li>
                    )
                  })}
                  <li>
                    <button
                      type="button"
                      onClick={() => setCustomMode((v) => !v)}
                      className="inline-flex items-center gap-1 rounded-full border border-dashed border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      <Plus className="h-3 w-3" aria-hidden="true" />
                      Other
                    </button>
                  </li>
                </ul>

                {customMode && (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <label htmlFor="custom-stream" className="sr-only">
                      Custom revenue stream
                    </label>
                    <input
                      id="custom-stream"
                      type="text"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addCustom()
                        }
                      }}
                      placeholder="Add another revenue stream"
                      className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <Button
                      type="button"
                      onClick={addCustom}
                      disabled={!customInput.trim()}
                      variant="outline"
                    >
                      Add
                    </Button>
                  </div>
                )}
              </Field>
            </FieldGroup>
          )}
        </CardContent>
      </Card>

      {!loading && !error && secondarySics.length > 0 && (
        <Card className="border-border">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-start gap-2.5">
              <Coins
                className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                aria-hidden="true"
              />
              <div className="space-y-0.5">
                <h3 className="font-serif text-base font-semibold text-foreground">
                  Your other income streams
                </h3>
                <p className="text-sm text-muted-foreground text-pretty">
                  You also told Companies House that this business operates
                  under {secondarySics.length} other SIC{" "}
                  {secondarySics.length === 1 ? "code" : "codes"}. Review the
                  description for each — you can edit anything that doesn&apos;t
                  fit.
                </p>
              </div>
            </div>

            <FieldGroup>
              {secondarySics.map((s) => (
                <Field key={s.code}>
                  <FieldLabel
                    htmlFor={`sec-${s.code}`}
                    className="flex flex-wrap items-center gap-2"
                  >
                    <span className="rounded-md bg-secondary px-2 py-0.5 font-mono text-xs font-semibold text-secondary-foreground">
                      {s.code}
                    </span>
                    <span className="text-sm font-medium text-foreground text-pretty">
                      {s.title}
                    </span>
                    <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-normal text-muted-foreground">
                      <Pencil className="h-3 w-3" aria-hidden="true" />
                      Editable
                    </span>
                  </FieldLabel>
                  <Textarea
                    id={`sec-${s.code}`}
                    rows={2}
                    value={secondarySummaries[s.code] ?? ""}
                    onChange={(e) =>
                      setSecondarySummaries((prev) => ({
                        ...prev,
                        [s.code]: e.target.value,
                      }))
                    }
                    className="resize-y"
                  />
                </Field>
              ))}
            </FieldGroup>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
        <Button variant="ghost" onClick={onBack} disabled={loading}>
          Back
        </Button>
        <Button
          disabled={!canConfirm || loading}
          onClick={handleConfirm}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Loading
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
