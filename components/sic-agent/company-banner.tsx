import { Building2, BadgeCheck, Database } from "lucide-react"
import type { CompanyProfile } from "@/lib/types"

export function CompanyBanner({ profile }: { profile: CompanyProfile }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"
        >
          <Building2 className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="font-serif text-base font-semibold text-foreground truncate">
            {profile.company_name}
          </p>
          <p className="text-xs text-muted-foreground">
            <span className="font-mono">{profile.company_number}</span> ·{" "}
            <span className="capitalize">{profile.company_status}</span> ·{" "}
            Incorporated {profile.date_of_creation}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {profile.source === "companies-house" ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-2 py-1 text-primary">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Verified · Companies House
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2 py-1 text-accent">
            <Database className="h-3.5 w-3.5" aria-hidden="true" />
            Demo data
          </span>
        )}
      </div>
    </div>
  )
}
