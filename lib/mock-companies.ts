// Demo companies pulled from UK Companies House public records.
// Used as a fallback when COMPANIES_HOUSE_API_KEY is not configured
// or when the API is unreachable, so the demo always works.

export type MockCompany = {
  company_number: string
  company_name: string
  company_status: string
  type: string
  date_of_creation: string
  registered_office_address: string
  sic_codes: string[]
}

export const MOCK_COMPANIES: Record<string, MockCompany> = {
  "00445790": {
    company_number: "00445790",
    company_name: "TESCO PLC",
    company_status: "active",
    type: "plc",
    date_of_creation: "1947-11-27",
    registered_office_address: "Tesco House, Shire Park, Kestrel Way, Welwyn Garden City, AL7 1GA",
    sic_codes: ["47110", "47190"],
  },
  "00185647": {
    company_number: "00185647",
    company_name: "J SAINSBURY PLC",
    company_status: "active",
    type: "plc",
    date_of_creation: "1922-08-04",
    registered_office_address: "33 Holborn, London, EC1N 2HT",
    sic_codes: ["47110", "70100"],
  },
  "00102498": {
    company_number: "00102498",
    company_name: "BP P.L.C.",
    company_status: "active",
    type: "plc",
    date_of_creation: "1909-04-14",
    registered_office_address: "1 St James's Square, London, SW1Y 4PD",
    sic_codes: ["06100", "06200", "19200", "46711"],
  },
  "00502851": {
    company_number: "00502851",
    company_name: "GREGGS PLC",
    company_status: "active",
    type: "plc",
    date_of_creation: "1951-09-05",
    registered_office_address: "Fernwood House, Clayton Road, Jesmond, Newcastle Upon Tyne, NE2 1TL",
    sic_codes: ["10710", "56103"],
  },
  "01833679": {
    company_number: "01833679",
    company_name: "VODAFONE GROUP PUBLIC LIMITED COMPANY",
    company_status: "active",
    type: "plc",
    date_of_creation: "1984-07-17",
    registered_office_address: "Vodafone House, The Connection, Newbury, Berkshire, RG14 2FN",
    sic_codes: ["61200", "61300", "61900"],
  },
  "00214436": {
    company_number: "00214436",
    company_name: "MARKS AND SPENCER P.L.C.",
    company_status: "active",
    type: "plc",
    date_of_creation: "1926-07-03",
    registered_office_address: "Waterside House, 35 North Wharf Road, London, W2 1NW",
    sic_codes: ["47110", "47710"],
  },
  "03584121": {
    company_number: "03584121",
    company_name: "ASOS.COM LIMITED",
    company_status: "active",
    type: "ltd",
    date_of_creation: "1998-06-02",
    registered_office_address: "Greater London House, Hampstead Road, London, NW1 7FB",
    sic_codes: ["47910"],
  },
}

export const DEMO_COMPANY_LIST = [
  { number: "00502851", name: "Greggs PLC", hint: "Single SIC area" },
  { number: "03584121", name: "ASOS.com Limited", hint: "Single SIC code" },
  { number: "00445790", name: "Tesco PLC", hint: "Multiple SIC codes" },
  { number: "00102498", name: "BP P.L.C.", hint: "Multiple SIC codes" },
  { number: "01833679", name: "Vodafone Group", hint: "Multiple SIC codes" },
]
