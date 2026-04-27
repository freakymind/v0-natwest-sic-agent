import { NextResponse } from "next/server"
import { getSicByCode } from "@/lib/sic-codes"
import { MOCK_COMPANIES } from "@/lib/mock-companies"
import type { CompanyProfile } from "@/lib/types"

function formatAddress(addr: Record<string, string | undefined> | undefined) {
  if (!addr) return ""
  return [
    addr.premises,
    addr.address_line_1,
    addr.address_line_2,
    addr.locality,
    addr.region,
    addr.postal_code,
    addr.country,
  ]
    .filter(Boolean)
    .join(", ")
}

export async function POST(req: Request) {
  const { companyNumber } = (await req.json()) as { companyNumber?: string }

  if (!companyNumber || !/^[A-Z0-9]{1,10}$/i.test(companyNumber.trim())) {
    return NextResponse.json(
      { error: "Please enter a valid UK company number." },
      { status: 400 },
    )
  }

  const normalised = companyNumber.trim().toUpperCase().padStart(8, "0")
  const apiKey = process.env.COMPANIES_HOUSE_API_KEY

  // Try the real Companies House API when a key is available.
  if (apiKey) {
    try {
      const auth = Buffer.from(`${apiKey}:`).toString("base64")
      const res = await fetch(
        `https://api.company-information.service.gov.uk/company/${normalised}`,
        {
          headers: { Authorization: `Basic ${auth}` },
          // Avoid Next.js fetch caching for live data
          cache: "no-store",
        },
      )

      if (res.ok) {
        const data = await res.json()
        const profile: CompanyProfile = {
          company_number: data.company_number ?? normalised,
          company_name: data.company_name ?? "Unknown",
          company_status: data.company_status ?? "unknown",
          type: data.type ?? "ltd",
          date_of_creation: data.date_of_creation ?? "",
          registered_office_address: formatAddress(data.registered_office_address),
          sic_codes: (data.sic_codes ?? []).map((c: string) => getSicByCode(c)),
          source: "companies-house",
        }
        return NextResponse.json(profile)
      }

      if (res.status !== 404) {
        console.log("[v0] Companies House API non-OK status:", res.status)
      }
    } catch (err) {
      console.log("[v0] Companies House fetch failed:", (err as Error).message)
    }
  }

  // Fallback to demo data so the experience always works.
  const mock = MOCK_COMPANIES[normalised]
  if (mock) {
    const profile: CompanyProfile = {
      company_number: mock.company_number,
      company_name: mock.company_name,
      company_status: mock.company_status,
      type: mock.type,
      date_of_creation: mock.date_of_creation,
      registered_office_address: mock.registered_office_address,
      sic_codes: mock.sic_codes.map((c) => getSicByCode(c)),
      source: "mock",
    }
    return NextResponse.json(profile)
  }

  return NextResponse.json(
    {
      error:
        "We couldn't find that company. Try one of the demo numbers below or check the number on Companies House.",
    },
    { status: 404 },
  )
}
