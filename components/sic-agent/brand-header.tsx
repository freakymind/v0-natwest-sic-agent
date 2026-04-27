import { Building2 } from "lucide-react"

export function BrandHeader() {
  return (
    <header className="border-b border-border bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-foreground text-primary"
            aria-hidden="true"
          >
            <span className="font-serif text-lg font-bold leading-none">N</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-serif text-base font-semibold tracking-tight">
              NatWest
            </span>
            <span className="text-xs text-primary-foreground/80">
              Business Onboarding
            </span>
          </div>
        </div>
        <div className="hidden items-center gap-2 text-xs text-primary-foreground/80 sm:flex">
          <Building2 className="h-4 w-4" aria-hidden="true" />
          SIC Verification
        </div>
      </div>
    </header>
  )
}
