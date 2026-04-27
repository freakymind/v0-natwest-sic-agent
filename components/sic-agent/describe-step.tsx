"use client"

import { useEffect, useState } from "react"
import {
  ArrowRight,
  Loader2,
  Pencil,
  Plus,
  Sparkles,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import type { SicCode } from "@/lib/sic-codes"
import type { SicDescription } from "@/lib/types"

export function DescribeStep({
  sic,
  companyName,
  onBack,
  onConfirm,
}: {
  sic: SicCode
  companyName: string
  onBack: () => void
  onConfirm: (result: SicDescription) => void
}) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState("")
  const [activities, setActivities] = useState<string[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [customMode, setCustomMode] = useState(false)
  const [customActivity, setCustomActivity] = useState("")
  const [customList, setCustomList] = useState<string[]>([])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetch("/api/describe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: sic.code,
        title: sic.title,
        companyName,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        if (data.error) {
          setError(data.error)
        } else {
          setSummary(data.summary)
          setActivities(data.activities ?? [])
          // Pre-select the first two suggestions to nudge the user.
          setSelected(new Set((data.activities ?? []).slice(0, 2)))
        }
      })
      .catch(() => !cancelled && setError("Couldn't generate a description."))
      .finally(() => !cancelled && setLoading(false))

    return () => {
      cancelled = true
    }
  }, [sic.code, sic.title, companyName])

  const toggle = (a: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(a)) next.delete(a)
      else next.add(a)
      return next
    })
  }

  const addCustom = () => {
    const v = customActivity.trim()
    if (!v) return
    setCustomList((prev) => [...prev, v])
    setSelected((prev) => new Set(prev).add(v))
    setCustomActivity("")
  }

  const removeCustom = (v: string) => {
    setCustomList((prev) => prev.filter((x) => x !== v))
    setSelected((prev) => {
      const next = new Set(prev)
      next.delete(v)
      return next
    })
  }

  const allActivities = [...activities, ...customList]
  const canConfirm = summary.trim().length > 0 && selected.size > 0

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
            </div>
            <h2 className="font-serif text-xl font-semibold text-foreground text-balance">
              {sic.title}
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center gap-3 rounded-md border border-dashed border-border bg-muted/30 p-6 text-sm text-muted-foreground">
              <Spinner className="text-primary" />
              <span>Generating a description for your business…</span>
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
                  AI-generated description
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
                <FieldLabel>Typical activities</FieldLabel>
                <p className="-mt-1 text-xs text-muted-foreground">
                  Select the ones that apply, or add your own.
                </p>

                <ul className="flex flex-wrap gap-2">
                  {allActivities.map((a) => {
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
                    <label htmlFor="custom-activity" className="sr-only">
                      Custom activity
                    </label>
                    <input
                      id="custom-activity"
                      type="text"
                      value={customActivity}
                      onChange={(e) => setCustomActivity(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addCustom()
                        }
                      }}
                      placeholder="Describe an activity in your own words"
                      className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <Button
                      type="button"
                      onClick={addCustom}
                      disabled={!customActivity.trim()}
                      variant="outline"
                    >
                      Add
                    </Button>
                  </div>
                )}
              </Field>
            </FieldGroup>
          )}

          <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-between">
            <Button variant="ghost" onClick={onBack} disabled={loading}>
              Back
            </Button>
            <Button
              disabled={!canConfirm || loading}
              onClick={() =>
                onConfirm({
                  code: sic.code,
                  title: sic.title,
                  summary: summary.trim(),
                  activities: Array.from(selected),
                })
              }
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
        </CardContent>
      </Card>
    </div>
  )
}
