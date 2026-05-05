import Link from "next/link"
import { Building2 } from "lucide-react"

export function BrandHeader({
  rightSlot,
}: {
  rightSlot?: React.ReactNode
}) {
  return (
    <header className="border-b border-border bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
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
        </Link>
        <nav className="flex items-center gap-5 text-xs">
          {rightSlot ?? (
            <Link
              href="/about"
              className="text-primary-foreground/90 hover:text-primary-foreground hover:underline"
            >
              How it works
            </Link>
          )}
          <span className="hidden items-center gap-2 text-primary-foreground/80 sm:flex">
            <Building2 className="h-4 w-4" aria-hidden="true" />
            SIC Verification
          </span>
        </nav>
      </div>
    </header>
  )
}
