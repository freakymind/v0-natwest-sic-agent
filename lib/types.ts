import type { SicCode } from "./sic-codes"

export type CompanyProfile = {
  company_number: string
  company_name: string
  company_status: string
  type: string
  date_of_creation: string
  registered_office_address: string
  sic_codes: SicCode[]
  source: "companies-house" | "mock"
}

export type SicDescription = {
  code: string
  title: string
  summary: string
  /**
   * Additional / adjacent revenue streams that similar businesses commonly
   * have alongside their primary SIC activity. Selected by the user.
   */
  relatedRevenueStreams: string[]
}

/**
 * A SIC code suggested by the AI matcher based on the user's description.
 * Resolved against the catalog so title/section come from a trusted source.
 */
export type SicMatch = {
  code: string
  title: string
  section: string
  reason: string
}
