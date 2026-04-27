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
  activities: string[]
}
