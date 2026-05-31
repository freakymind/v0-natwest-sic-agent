import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export type StepKey =
  | "lookup"
  | "primary"
  | "describe"
  | "derive"
  | "activities"
  | "confirm"

const STEPS: { key: StepKey; label: string }[] = [
  { key: "lookup", label: "Company" },
  { key: "primary", label: "Primary activity" },
  { key: "describe", label: "Describe" },
  { key: "derive", label: "Other activities" },
  { key: "activities", label: "Activity codes" },
  { key: "confirm", label: "Confirm" },
]

export function ProgressSteps({
  current,
  skipPrimary,
  skipDerive,
}: {
  current: StepKey
  skipPrimary: boolean
  skipDerive: boolean
}) {
  const visible = STEPS.filter(
    (s) =>
      !(skipPrimary && s.key === "primary") &&
      !(skipDerive && s.key === "derive")
  )
  const currentIndex = visible.findIndex((s) => s.key === current)

  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex w-full items-center gap-2">
        {visible.map((step, i) => {
          const isComplete = i < currentIndex
          const isCurrent = i === currentIndex
          return (
            <li key={step.key} className="flex flex-1 items-center gap-2">
              <div className="flex flex-1 items-center gap-2">
                <div
                  aria-hidden="true"
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                    isComplete &&
                      "border-primary bg-primary text-primary-foreground",
                    isCurrent &&
                      "border-primary bg-primary/10 text-primary",
                    !isComplete && !isCurrent &&
                      "border-border bg-muted text-muted-foreground",
                  )}
                >
                  {isComplete ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <span
                  className={cn(
                    "hidden text-sm font-medium sm:block",
                    isCurrent ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>
              </div>
              {i < visible.length - 1 && (
                <div
                  aria-hidden="true"
                  className={cn(
                    "h-px flex-1",
                    isComplete ? "bg-primary" : "bg-border",
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
