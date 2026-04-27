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

/**
 * A short editable description for a non-primary registered SIC code.
 * Generated when the company has multiple SIC codes — the user has told us
 * they make money from each of them, so we describe them as additional
 * income streams.
 */
export type SecondarySicDescription = {
  code: string
  title: string
  section: string
  summary: string
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
  /**
   * Descriptions for the company's other registered SIC codes (when more
   * than one was filed at Companies House). The user has confirmed these
   * are real income streams for the business.
   */
  secondary: SecondarySicDescription[]
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
