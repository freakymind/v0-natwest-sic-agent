"use client"

import { useState } from "react"
import { Search, AlertCircle, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { DEMO_COMPANY_LIST } from "@/lib/mock-companies"
import type { CompanyProfile } from "@/lib/types"

export function LookupStep({
  onResolved,
}: {
  onResolved: (profile: CompanyProfile) => void
}) {
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function lookup(num: string) {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyNumber: num }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.")
        return
      }
      onResolved(data as CompanyProfile)
    } catch (err) {
      setError("We couldn't reach Companies House. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="space-y-1.5">
        <h1 className="font-serif text-2xl font-semibold text-balance text-foreground">
          Let&apos;s find your business
        </h1>
        <p className="text-sm text-muted-foreground text-pretty">
          Enter your UK company registration number and we&apos;ll pull your
          details directly from Companies House.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (value.trim()) lookup(value.trim())
          }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="company-number" className="sr-only">
            Company number
          </label>
          <InputGroup className="flex-1">
            <InputGroupAddon>
              <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              id="company-number"
              inputMode="text"
              autoComplete="off"
              spellCheck={false}
              placeholder="e.g. 00445790"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={loading}
              aria-describedby={error ? "lookup-error" : undefined}
            />
          </InputGroup>
          <Button
            type="submit"
            disabled={loading || !value.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Looking up
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </Button>
        </form>

        {error && (
          <div
            id="lookup-error"
            role="alert"
            className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <div className="rounded-md border border-border bg-muted/40 p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Try a demo company
          </p>
          <ul className="flex flex-wrap gap-2">
            {DEMO_COMPANY_LIST.map((c) => (
              <li key={c.number}>
                <button
                  type="button"
                  onClick={() => {
                    setValue(c.number)
                    lookup(c.number)
                  }}
                  disabled={loading}
                  className="group flex flex-col items-start rounded-md border border-border bg-background px-3 py-2 text-left text-xs transition-colors hover:border-primary hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="font-medium text-foreground">{c.name}</span>
                  <span className="font-mono text-[11px] text-muted-foreground group-hover:text-primary">
                    {c.number} · {c.hint}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
