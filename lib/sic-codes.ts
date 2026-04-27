// Subset of UK SIC 2007 codes used in the onboarding flow.
// Reference: https://resources.companieshouse.gov.uk/sic/

export type SicCode = {
  code: string
  title: string
  section: string
}

export const SIC_LOOKUP: Record<string, SicCode> = {
  "47110": {
    code: "47110",
    title: "Retail sale in non-specialised stores with food, beverages or tobacco predominating",
    section: "Wholesale and retail trade",
  },
  "47190": {
    code: "47190",
    title: "Other retail sale in non-specialised stores",
    section: "Wholesale and retail trade",
  },
  "47210": {
    code: "47210",
    title: "Retail sale of fruit and vegetables in specialised stores",
    section: "Wholesale and retail trade",
  },
  "47220": {
    code: "47220",
    title: "Retail sale of meat and meat products in specialised stores",
    section: "Wholesale and retail trade",
  },
  "47710": {
    code: "47710",
    title: "Retail sale of clothing in specialised stores",
    section: "Wholesale and retail trade",
  },
  "47910": {
    code: "47910",
    title: "Retail sale via mail order houses or via Internet",
    section: "Wholesale and retail trade",
  },
  "47990": {
    code: "47990",
    title: "Other retail sale not in stores, stalls or markets",
    section: "Wholesale and retail trade",
  },
  "10710": {
    code: "10710",
    title: "Manufacture of bread; manufacture of fresh pastry goods and cakes",
    section: "Manufacturing",
  },
  "56101": {
    code: "56101",
    title: "Licenced restaurants",
    section: "Accommodation and food service activities",
  },
  "56102": {
    code: "56102",
    title: "Unlicenced restaurants and cafes",
    section: "Accommodation and food service activities",
  },
  "56103": {
    code: "56103",
    title: "Take-away food shops and mobile food stands",
    section: "Accommodation and food service activities",
  },
  "61200": {
    code: "61200",
    title: "Wireless telecommunications activities",
    section: "Information and communication",
  },
  "61300": {
    code: "61300",
    title: "Satellite telecommunications activities",
    section: "Information and communication",
  },
  "61900": {
    code: "61900",
    title: "Other telecommunications activities",
    section: "Information and communication",
  },
  "06100": {
    code: "06100",
    title: "Extraction of crude petroleum",
    section: "Mining and quarrying",
  },
  "06200": {
    code: "06200",
    title: "Extraction of natural gas",
    section: "Mining and quarrying",
  },
  "19200": {
    code: "19200",
    title: "Manufacture of refined petroleum products",
    section: "Manufacturing",
  },
  "46711": {
    code: "46711",
    title: "Wholesale of petroleum and petroleum products",
    section: "Wholesale and retail trade",
  },
  "70100": {
    code: "70100",
    title: "Activities of head offices",
    section: "Professional, scientific and technical activities",
  },
  "70221": {
    code: "70221",
    title: "Financial management",
    section: "Professional, scientific and technical activities",
  },
  "70229": {
    code: "70229",
    title: "Management consultancy activities other than financial management",
    section: "Professional, scientific and technical activities",
  },
  "62012": {
    code: "62012",
    title: "Business and domestic software development",
    section: "Information and communication",
  },
  "62020": {
    code: "62020",
    title: "Information technology consultancy activities",
    section: "Information and communication",
  },
  "62090": {
    code: "62090",
    title: "Other information technology service activities",
    section: "Information and communication",
  },
  "64191": {
    code: "64191",
    title: "Banks",
    section: "Financial and insurance activities",
  },
  "64205": {
    code: "64205",
    title: "Activities of financial services holding companies",
    section: "Financial and insurance activities",
  },
  "82990": {
    code: "82990",
    title: "Other business support service activities n.e.c.",
    section: "Administrative and support service activities",
  },
}

export function getSicByCode(code: string): SicCode {
  return (
    SIC_LOOKUP[code] ?? {
      code,
      title: `SIC code ${code}`,
      section: "Other",
    }
  )
}
