"use client"

import { useState } from "react"
import { ArrowRight, MessageSquareText, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { CompanyProfile } from "@/lib/types"
import type { SicCode } from "@/lib/sic-codes"

export function PrimaryStep({
  profile,
  onSelect,
  onBack,
}: {
  profile: CompanyProfile
  onSelect: (primary: SicCode) => void
  onBack: () => void
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const company = profile.company_name

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/60 p-4">
        <div
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
        >
          <MessageSquareText className="h-4 w-4" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            SIC Agent
          </p>
          <p className="text-sm leading-relaxed text-foreground text-pretty">
            Nice to meet you. I can see <strong>{company}</strong> is registered
            with <strong>{profile.sic_codes.length} SIC codes</strong> at
            Companies House. To make sure we set up the right account, which one
            best describes your <em>primary source of income</em> today?
          </p>
        </div>
      </div>

      <Card className="border-border">
        <CardContent className="space-y-3 p-4">
          <ul className="space-y-2" role="radiogroup" aria-label="Primary SIC code">
            {profile.sic_codes.map((sic) => {
              const isSelected = selected === sic.code
              return (
                <li key={sic.code}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelected(sic.code)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-md border p-3 text-left transition-colors",
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border bg-background hover:border-primary/40 hover:bg-secondary/40",
                    )}
                  >
                    <div
                      aria-hidden="true"
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                        isSelected ? "border-primary" : "border-border",
                      )}
                    >
                      {isSelected && (
                        <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-primary">
                          {sic.code}
                        </span>
                        <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                          {sic.section}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground text-pretty">
                        {sic.title}
                      </p>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-between">
            <Button variant="ghost" onClick={onBack}>
              Back
            </Button>
            <Button
              disabled={!selected}
              onClick={() => {
                const chosen = profile.sic_codes.find((c) => c.code === selected)
                if (chosen) onSelect(chosen)
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Generate description
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
