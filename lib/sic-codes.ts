// Subset of UK SIC 2007 codes used in the onboarding flow.
// Reference: https://resources.companieshouse.gov.uk/sic/

export type SicCode = {
  code: string
  title: string
  section: string
}

export const SIC_LOOKUP: Record<string, SicCode> = {
  // --- Wholesale and retail trade ---
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
  "47240": {
    code: "47240",
    title: "Retail sale of bread, cakes, flour confectionery and sugar confectionery in specialised stores",
    section: "Wholesale and retail trade",
  },
  "47250": {
    code: "47250",
    title: "Retail sale of beverages in specialised stores",
    section: "Wholesale and retail trade",
  },
  "47710": {
    code: "47710",
    title: "Retail sale of clothing in specialised stores",
    section: "Wholesale and retail trade",
  },
  "47721": {
    code: "47721",
    title: "Retail sale of footwear in specialised stores",
    section: "Wholesale and retail trade",
  },
  "47750": {
    code: "47750",
    title: "Retail sale of cosmetic and toilet articles in specialised stores",
    section: "Wholesale and retail trade",
  },
  "47820": {
    code: "47820",
    title: "Retail sale via stalls and markets of textiles, clothing and footwear",
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
  "46390": {
    code: "46390",
    title: "Non-specialised wholesale of food, beverages and tobacco",
    section: "Wholesale and retail trade",
  },
  "46711": {
    code: "46711",
    title: "Wholesale of petroleum and petroleum products",
    section: "Wholesale and retail trade",
  },
  "46900": {
    code: "46900",
    title: "Non-specialised wholesale trade",
    section: "Wholesale and retail trade",
  },

  // --- Manufacturing ---
  "10710": {
    code: "10710",
    title: "Manufacture of bread; manufacture of fresh pastry goods and cakes",
    section: "Manufacturing",
  },
  "10720": {
    code: "10720",
    title: "Manufacture of rusks and biscuits; manufacture of preserved pastry goods and cakes",
    section: "Manufacturing",
  },
  "10850": {
    code: "10850",
    title: "Manufacture of prepared meals and dishes",
    section: "Manufacturing",
  },
  "11050": {
    code: "11050",
    title: "Manufacture of beer",
    section: "Manufacturing",
  },
  "14130": {
    code: "14130",
    title: "Manufacture of other outerwear",
    section: "Manufacturing",
  },
  "19200": {
    code: "19200",
    title: "Manufacture of refined petroleum products",
    section: "Manufacturing",
  },
  "20420": {
    code: "20420",
    title: "Manufacture of perfumes and toilet preparations",
    section: "Manufacturing",
  },
  "26200": {
    code: "26200",
    title: "Manufacture of computers and peripheral equipment",
    section: "Manufacturing",
  },
  "27900": {
    code: "27900",
    title: "Manufacture of other electrical equipment",
    section: "Manufacturing",
  },
  "32990": {
    code: "32990",
    title: "Other manufacturing n.e.c.",
    section: "Manufacturing",
  },

  // --- Accommodation and food service ---
  "55100": {
    code: "55100",
    title: "Hotels and similar accommodation",
    section: "Accommodation and food service activities",
  },
  "55201": {
    code: "55201",
    title: "Holiday centres and villages",
    section: "Accommodation and food service activities",
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
  "56210": {
    code: "56210",
    title: "Event catering activities",
    section: "Accommodation and food service activities",
  },
  "56290": {
    code: "56290",
    title: "Other food service activities",
    section: "Accommodation and food service activities",
  },
  "56301": {
    code: "56301",
    title: "Licenced clubs",
    section: "Accommodation and food service activities",
  },
  "56302": {
    code: "56302",
    title: "Public houses and bars",
    section: "Accommodation and food service activities",
  },

  // --- Information and communication ---
  "58210": {
    code: "58210",
    title: "Publishing of computer games",
    section: "Information and communication",
  },
  "58290": {
    code: "58290",
    title: "Other software publishing",
    section: "Information and communication",
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
  "62011": {
    code: "62011",
    title: "Ready-made interactive leisure and entertainment software development",
    section: "Information and communication",
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
  "63110": {
    code: "63110",
    title: "Data processing, hosting and related activities",
    section: "Information and communication",
  },
  "63120": {
    code: "63120",
    title: "Web portals",
    section: "Information and communication",
  },
  "73110": {
    code: "73110",
    title: "Advertising agencies",
    section: "Professional, scientific and technical activities",
  },
  "73120": {
    code: "73120",
    title: "Media representation services",
    section: "Professional, scientific and technical activities",
  },

  // --- Mining ---
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

  // --- Professional, scientific and technical activities ---
  "70100": {
    code: "70100",
    title: "Activities of head offices",
    section: "Professional, scientific and technical activities",
  },
  "70210": {
    code: "70210",
    title: "Public relations and communication activities",
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
  "71111": {
    code: "71111",
    title: "Architectural activities",
    section: "Professional, scientific and technical activities",
  },
  "71121": {
    code: "71121",
    title: "Engineering design activities for industrial process and production",
    section: "Professional, scientific and technical activities",
  },
  "74100": {
    code: "74100",
    title: "Specialised design activities",
    section: "Professional, scientific and technical activities",
  },
  "74201": {
    code: "74201",
    title: "Portrait photographic activities",
    section: "Professional, scientific and technical activities",
  },
  "74909": {
    code: "74909",
    title: "Other professional, scientific and technical activities n.e.c.",
    section: "Professional, scientific and technical activities",
  },

  // --- Financial and insurance activities ---
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
  "64999": {
    code: "64999",
    title: "Financial intermediation not elsewhere classified",
    section: "Financial and insurance activities",
  },
  "66190": {
    code: "66190",
    title: "Activities auxiliary to financial intermediation n.e.c.",
    section: "Financial and insurance activities",
  },
  "66220": {
    code: "66220",
    title: "Activities of insurance agents and brokers",
    section: "Financial and insurance activities",
  },

  // --- Administrative and support service ---
  "78100": {
    code: "78100",
    title: "Activities of employment placement agencies",
    section: "Administrative and support service activities",
  },
  "82110": {
    code: "82110",
    title: "Combined office administrative service activities",
    section: "Administrative and support service activities",
  },
  "82990": {
    code: "82990",
    title: "Other business support service activities n.e.c.",
    section: "Administrative and support service activities",
  },

  // --- Construction ---
  "41100": {
    code: "41100",
    title: "Development of building projects",
    section: "Construction",
  },
  "41201": {
    code: "41201",
    title: "Construction of commercial buildings",
    section: "Construction",
  },
  "41202": {
    code: "41202",
    title: "Construction of domestic buildings",
    section: "Construction",
  },
  "43210": {
    code: "43210",
    title: "Electrical installation",
    section: "Construction",
  },
  "43220": {
    code: "43220",
    title: "Plumbing, heat and air-conditioning installation",
    section: "Construction",
  },

  // --- Transportation and storage ---
  "49410": {
    code: "49410",
    title: "Freight transport by road",
    section: "Transportation and storage",
  },
  "52290": {
    code: "52290",
    title: "Other transportation support activities",
    section: "Transportation and storage",
  },
  "53201": {
    code: "53201",
    title: "Licensed carriers",
    section: "Transportation and storage",
  },

  // --- Real estate ---
  "68100": {
    code: "68100",
    title: "Buying and selling of own real estate",
    section: "Real estate activities",
  },
  "68209": {
    code: "68209",
    title: "Other letting and operating of own or leased real estate",
    section: "Real estate activities",
  },
  "68310": {
    code: "68310",
    title: "Real estate agencies",
    section: "Real estate activities",
  },

  // --- Education ---
  "85590": {
    code: "85590",
    title: "Other education n.e.c.",
    section: "Education",
  },
  "85600": {
    code: "85600",
    title: "Educational support services",
    section: "Education",
  },

  // --- Human health and social work ---
  "86900": {
    code: "86900",
    title: "Other human health activities",
    section: "Human health and social work activities",
  },

  // --- Arts, entertainment and recreation ---
  "90030": {
    code: "90030",
    title: "Artistic creation",
    section: "Arts, entertainment and recreation",
  },
  "93110": {
    code: "93110",
    title: "Operation of sports facilities",
    section: "Arts, entertainment and recreation",
  },
  "93290": {
    code: "93290",
    title: "Other amusement and recreation activities n.e.c.",
    section: "Arts, entertainment and recreation",
  },

  // --- Other service activities ---
  "96090": {
    code: "96090",
    title: "Other service activities n.e.c.",
    section: "Other service activities",
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

/**
 * Returns a compact catalog of all known SIC codes for use in AI prompts.
 * Excludes any codes the caller wants filtered out (e.g. already-registered).
 */
export function getSicCatalog(exclude: string[] = []): SicCode[] {
  const set = new Set(exclude)
  return Object.values(SIC_LOOKUP).filter((s) => !set.has(s.code))
}
