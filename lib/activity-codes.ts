/**
 * Bank internal activity codes (6-digit) that map to SIC codes.
 * Each SIC code can have multiple activity codes for finer-grained
 * risk/compliance classification.
 *
 * Structure: SIC code (5-digit) → array of activity codes
 * Activity code format: SIC + 2-digit sub-code (e.g., 47110 → 471101, 471102)
 */

export type ActivityCode = {
  code: string // 6-digit: SIC + sub-code
  sicCode: string // parent 5-digit SIC
  label: string // short description
  riskLevel: "low" | "medium" | "high"
}

/**
 * Comprehensive activity codes catalog.
 * In production this would be ~1200 codes; here we include a representative
 * sample across common SIC codes to demonstrate the concept.
 */
export const ACTIVITY_CODES: ActivityCode[] = [
  // 47110 - Retail sale in non-specialised stores with food
  { code: "471101", sicCode: "47110", label: "Supermarket / grocery store", riskLevel: "low" },
  { code: "471102", sicCode: "47110", label: "Convenience store (24hr)", riskLevel: "low" },
  { code: "471103", sicCode: "47110", label: "Off-licence / alcohol retail", riskLevel: "medium" },
  { code: "471104", sicCode: "47110", label: "Tobacco retail", riskLevel: "high" },
  { code: "471105", sicCode: "47110", label: "Mini-market / corner shop", riskLevel: "low" },

  // 56101 - Licensed restaurants
  { code: "561011", sicCode: "56101", label: "Full-service restaurant", riskLevel: "low" },
  { code: "561012", sicCode: "56101", label: "Fast food / quick service", riskLevel: "low" },
  { code: "561013", sicCode: "56101", label: "Fine dining establishment", riskLevel: "low" },
  { code: "561014", sicCode: "56101", label: "Café / coffee shop with alcohol", riskLevel: "low" },
  { code: "561015", sicCode: "56101", label: "Late-night dining (after 11pm)", riskLevel: "medium" },

  // 56302 - Public houses and bars
  { code: "563021", sicCode: "56302", label: "Traditional pub", riskLevel: "medium" },
  { code: "563022", sicCode: "56302", label: "Wine bar", riskLevel: "medium" },
  { code: "563023", sicCode: "56302", label: "Cocktail bar", riskLevel: "medium" },
  { code: "563024", sicCode: "56302", label: "Sports bar", riskLevel: "medium" },
  { code: "563025", sicCode: "56302", label: "Nightclub / late bar", riskLevel: "high" },
  { code: "563026", sicCode: "56302", label: "Members club (licensed)", riskLevel: "medium" },

  // 62020 - Computer consultancy activities
  { code: "620201", sicCode: "62020", label: "IT consulting / advisory", riskLevel: "low" },
  { code: "620202", sicCode: "62020", label: "Software development services", riskLevel: "low" },
  { code: "620203", sicCode: "62020", label: "Systems integration", riskLevel: "low" },
  { code: "620204", sicCode: "62020", label: "Cybersecurity consulting", riskLevel: "low" },
  { code: "620205", sicCode: "62020", label: "Data analytics / BI services", riskLevel: "low" },
  { code: "620206", sicCode: "62020", label: "Cloud migration services", riskLevel: "low" },

  // 62011 - Ready-made interactive leisure and entertainment software development
  { code: "620111", sicCode: "62011", label: "Video game development", riskLevel: "low" },
  { code: "620112", sicCode: "62011", label: "Mobile game development", riskLevel: "low" },
  { code: "620113", sicCode: "62011", label: "VR/AR entertainment software", riskLevel: "low" },
  { code: "620114", sicCode: "62011", label: "Gambling / betting software", riskLevel: "high" },

  // 62012 - Business and domestic software development
  { code: "620121", sicCode: "62012", label: "Enterprise software (SaaS)", riskLevel: "low" },
  { code: "620122", sicCode: "62012", label: "Mobile app development", riskLevel: "low" },
  { code: "620123", sicCode: "62012", label: "Web application development", riskLevel: "low" },
  { code: "620124", sicCode: "62012", label: "Embedded systems software", riskLevel: "low" },
  { code: "620125", sicCode: "62012", label: "Fintech software development", riskLevel: "medium" },

  // 70229 - Management consultancy activities other than financial management
  { code: "702291", sicCode: "70229", label: "Business strategy consulting", riskLevel: "low" },
  { code: "702292", sicCode: "70229", label: "Operations / process consulting", riskLevel: "low" },
  { code: "702293", sicCode: "70229", label: "HR / organisational consulting", riskLevel: "low" },
  { code: "702294", sicCode: "70229", label: "Marketing / brand consulting", riskLevel: "low" },
  { code: "702295", sicCode: "70229", label: "Change management consulting", riskLevel: "low" },

  // 69201 - Accounting and auditing activities
  { code: "692011", sicCode: "69201", label: "Statutory audit services", riskLevel: "low" },
  { code: "692012", sicCode: "69201", label: "Bookkeeping / accounts prep", riskLevel: "low" },
  { code: "692013", sicCode: "69201", label: "Tax advisory / compliance", riskLevel: "low" },
  { code: "692014", sicCode: "69201", label: "Payroll services", riskLevel: "low" },
  { code: "692015", sicCode: "69201", label: "Forensic accounting", riskLevel: "medium" },

  // 69109 - Activities of patent and copyright agents; other legal activities n.e.c.
  { code: "691091", sicCode: "69109", label: "Patent / trademark registration", riskLevel: "low" },
  { code: "691092", sicCode: "69109", label: "IP licensing advisory", riskLevel: "low" },
  { code: "691093", sicCode: "69109", label: "Copyright administration", riskLevel: "low" },

  // 69101 - Barristers at law
  { code: "691011", sicCode: "69101", label: "Criminal defence", riskLevel: "medium" },
  { code: "691012", sicCode: "69101", label: "Civil litigation", riskLevel: "low" },
  { code: "691013", sicCode: "69101", label: "Commercial / chancery", riskLevel: "low" },
  { code: "691014", sicCode: "69101", label: "Family law", riskLevel: "low" },

  // 69102 - Solicitors
  { code: "691021", sicCode: "69102", label: "Conveyancing", riskLevel: "low" },
  { code: "691022", sicCode: "69102", label: "Corporate / commercial law", riskLevel: "low" },
  { code: "691023", sicCode: "69102", label: "Personal injury claims", riskLevel: "medium" },
  { code: "691024", sicCode: "69102", label: "Immigration law", riskLevel: "medium" },
  { code: "691025", sicCode: "69102", label: "Wills / probate / trusts", riskLevel: "low" },

  // 10710 - Manufacture of bread; fresh pastry goods and cakes
  { code: "107101", sicCode: "10710", label: "Artisan bakery", riskLevel: "low" },
  { code: "107102", sicCode: "10710", label: "Industrial bread production", riskLevel: "low" },
  { code: "107103", sicCode: "10710", label: "Cake / pastry manufacture", riskLevel: "low" },
  { code: "107104", sicCode: "10710", label: "Gluten-free / speciality bakery", riskLevel: "low" },

  // 45111 - Sale of new cars and light motor vehicles
  { code: "451111", sicCode: "45111", label: "Franchised car dealership", riskLevel: "low" },
  { code: "451112", sicCode: "45111", label: "Independent new car sales", riskLevel: "low" },
  { code: "451113", sicCode: "45111", label: "Fleet / corporate vehicle sales", riskLevel: "low" },
  { code: "451114", sicCode: "45111", label: "Prestige / luxury vehicle sales", riskLevel: "low" },

  // 45112 - Sale of used cars and light motor vehicles
  { code: "451121", sicCode: "45112", label: "Used car dealership", riskLevel: "medium" },
  { code: "451122", sicCode: "45112", label: "Online used car sales", riskLevel: "medium" },
  { code: "451123", sicCode: "45112", label: "Car supermarket", riskLevel: "medium" },
  { code: "451124", sicCode: "45112", label: "Auction / trade vehicle sales", riskLevel: "high" },

  // 64191 - Banks
  { code: "641911", sicCode: "64191", label: "Retail banking", riskLevel: "high" },
  { code: "641912", sicCode: "64191", label: "Commercial / business banking", riskLevel: "high" },
  { code: "641913", sicCode: "64191", label: "Private banking", riskLevel: "high" },
  { code: "641914", sicCode: "64191", label: "Investment banking", riskLevel: "high" },

  // 64929 - Other credit granting n.e.c.
  { code: "649291", sicCode: "64929", label: "Peer-to-peer lending platform", riskLevel: "high" },
  { code: "649292", sicCode: "64929", label: "Invoice financing / factoring", riskLevel: "medium" },
  { code: "649293", sicCode: "64929", label: "Asset finance / leasing", riskLevel: "medium" },
  { code: "649294", sicCode: "64929", label: "Payday / short-term lending", riskLevel: "high" },
  { code: "649295", sicCode: "64929", label: "Buy-now-pay-later provider", riskLevel: "high" },

  // 66220 - Activities of insurance agents and brokers
  { code: "662201", sicCode: "66220", label: "General insurance broker", riskLevel: "medium" },
  { code: "662202", sicCode: "66220", label: "Life / pensions broker", riskLevel: "medium" },
  { code: "662203", sicCode: "66220", label: "Commercial insurance broker", riskLevel: "medium" },
  { code: "662204", sicCode: "66220", label: "Insurance comparison platform", riskLevel: "medium" },

  // 41201 - Construction of commercial buildings
  { code: "412011", sicCode: "41201", label: "Office building construction", riskLevel: "low" },
  { code: "412012", sicCode: "41201", label: "Retail / leisure construction", riskLevel: "low" },
  { code: "412013", sicCode: "41201", label: "Industrial / warehouse construction", riskLevel: "low" },
  { code: "412014", sicCode: "41201", label: "Mixed-use development", riskLevel: "medium" },

  // 41202 - Construction of domestic buildings
  { code: "412021", sicCode: "41202", label: "House building (volume)", riskLevel: "low" },
  { code: "412022", sicCode: "41202", label: "Bespoke / custom home building", riskLevel: "low" },
  { code: "412023", sicCode: "41202", label: "Residential extensions", riskLevel: "low" },
  { code: "412024", sicCode: "41202", label: "Property development (residential)", riskLevel: "medium" },

  // 68100 - Buying and selling of own real estate
  { code: "681001", sicCode: "68100", label: "Residential property trading", riskLevel: "medium" },
  { code: "681002", sicCode: "68100", label: "Commercial property trading", riskLevel: "medium" },
  { code: "681003", sicCode: "68100", label: "Land banking / development land", riskLevel: "high" },
  { code: "681004", sicCode: "68100", label: "Property flipping", riskLevel: "high" },

  // 68201 - Renting and operating of Housing Association real estate
  { code: "682011", sicCode: "68201", label: "Social housing landlord", riskLevel: "low" },
  { code: "682012", sicCode: "68201", label: "Supported housing provider", riskLevel: "low" },

  // 68209 - Other letting and operating of own or leased real estate
  { code: "682091", sicCode: "68209", label: "Buy-to-let landlord", riskLevel: "medium" },
  { code: "682092", sicCode: "68209", label: "HMO operator", riskLevel: "medium" },
  { code: "682093", sicCode: "68209", label: "Serviced apartments", riskLevel: "medium" },
  { code: "682094", sicCode: "68209", label: "Short-term letting (Airbnb)", riskLevel: "medium" },
  { code: "682095", sicCode: "68209", label: "Commercial property landlord", riskLevel: "medium" },

  // 68310 - Real estate agencies
  { code: "683101", sicCode: "68310", label: "Residential estate agency", riskLevel: "medium" },
  { code: "683102", sicCode: "68310", label: "Commercial estate agency", riskLevel: "medium" },
  { code: "683103", sicCode: "68310", label: "Lettings agency", riskLevel: "medium" },
  { code: "683104", sicCode: "68310", label: "Property management", riskLevel: "medium" },
  { code: "683105", sicCode: "68310", label: "Online / hybrid estate agency", riskLevel: "medium" },

  // 46900 - Non-specialised wholesale trade
  { code: "469001", sicCode: "46900", label: "General merchandise wholesaler", riskLevel: "low" },
  { code: "469002", sicCode: "46900", label: "Import / export trading", riskLevel: "medium" },
  { code: "469003", sicCode: "46900", label: "Liquidation stock wholesaler", riskLevel: "medium" },

  // 47910 - Retail sale via mail order houses or via Internet
  { code: "479101", sicCode: "47910", label: "E-commerce retailer (general)", riskLevel: "low" },
  { code: "479102", sicCode: "47910", label: "Subscription box service", riskLevel: "low" },
  { code: "479103", sicCode: "47910", label: "Dropshipping business", riskLevel: "medium" },
  { code: "479104", sicCode: "47910", label: "Online marketplace seller", riskLevel: "medium" },
  { code: "479105", sicCode: "47910", label: "High-value goods e-commerce", riskLevel: "medium" },

  // 82990 - Other business support service activities n.e.c.
  { code: "829901", sicCode: "82990", label: "Virtual assistant services", riskLevel: "low" },
  { code: "829902", sicCode: "82990", label: "Business process outsourcing", riskLevel: "low" },
  { code: "829903", sicCode: "82990", label: "Mystery shopping services", riskLevel: "low" },
  { code: "829904", sicCode: "82990", label: "Debt collection agency", riskLevel: "high" },

  // 73110 - Advertising agencies
  { code: "731101", sicCode: "73110", label: "Full-service ad agency", riskLevel: "low" },
  { code: "731102", sicCode: "73110", label: "Digital / performance marketing", riskLevel: "low" },
  { code: "731103", sicCode: "73110", label: "Media buying agency", riskLevel: "low" },
  { code: "731104", sicCode: "73110", label: "Influencer marketing agency", riskLevel: "low" },

  // 74100 - Specialised design activities
  { code: "741001", sicCode: "74100", label: "Graphic design studio", riskLevel: "low" },
  { code: "741002", sicCode: "74100", label: "Interior design consultancy", riskLevel: "low" },
  { code: "741003", sicCode: "74100", label: "Industrial / product design", riskLevel: "low" },
  { code: "741004", sicCode: "74100", label: "UX/UI design agency", riskLevel: "low" },
  { code: "741005", sicCode: "74100", label: "Fashion / textile design", riskLevel: "low" },

  // 86210 - General medical practice activities
  { code: "862101", sicCode: "86210", label: "NHS GP practice", riskLevel: "low" },
  { code: "862102", sicCode: "86210", label: "Private GP practice", riskLevel: "low" },
  { code: "862103", sicCode: "86210", label: "Online / telehealth GP", riskLevel: "low" },
  { code: "862104", sicCode: "86210", label: "Occupational health services", riskLevel: "low" },

  // 86220 - Specialist medical practice activities
  { code: "862201", sicCode: "86220", label: "Private consultant practice", riskLevel: "low" },
  { code: "862202", sicCode: "86220", label: "Cosmetic / aesthetic medicine", riskLevel: "medium" },
  { code: "862203", sicCode: "86220", label: "Mental health / psychiatry", riskLevel: "low" },
  { code: "862204", sicCode: "86220", label: "Sports medicine", riskLevel: "low" },

  // 96020 - Hairdressing and other beauty treatment
  { code: "960201", sicCode: "96020", label: "Hair salon", riskLevel: "low" },
  { code: "960202", sicCode: "96020", label: "Barber shop", riskLevel: "low" },
  { code: "960203", sicCode: "96020", label: "Beauty salon / spa", riskLevel: "low" },
  { code: "960204", sicCode: "96020", label: "Nail salon", riskLevel: "low" },
  { code: "960205", sicCode: "96020", label: "Mobile beauty services", riskLevel: "low" },
  { code: "960206", sicCode: "96020", label: "Tattoo / piercing studio", riskLevel: "medium" },

  // 93110 - Operation of sports facilities
  { code: "931101", sicCode: "93110", label: "Gym / fitness centre", riskLevel: "low" },
  { code: "931102", sicCode: "93110", label: "Swimming pool operator", riskLevel: "low" },
  { code: "931103", sicCode: "93110", label: "Golf course / club", riskLevel: "low" },
  { code: "931104", sicCode: "93110", label: "Tennis / squash club", riskLevel: "low" },
  { code: "931105", sicCode: "93110", label: "Climbing / adventure centre", riskLevel: "low" },

  // 93130 - Fitness facilities
  { code: "931301", sicCode: "93130", label: "Budget gym chain", riskLevel: "low" },
  { code: "931302", sicCode: "93130", label: "Boutique fitness studio", riskLevel: "low" },
  { code: "931303", sicCode: "93130", label: "CrossFit / functional training", riskLevel: "low" },
  { code: "931304", sicCode: "93130", label: "Yoga / pilates studio", riskLevel: "low" },
  { code: "931305", sicCode: "93130", label: "Personal training studio", riskLevel: "low" },

  // 92000 - Gambling and betting activities
  { code: "920001", sicCode: "92000", label: "Betting shop", riskLevel: "high" },
  { code: "920002", sicCode: "92000", label: "Online gambling operator", riskLevel: "high" },
  { code: "920003", sicCode: "92000", label: "Casino operator", riskLevel: "high" },
  { code: "920004", sicCode: "92000", label: "Bingo hall", riskLevel: "high" },
  { code: "920005", sicCode: "92000", label: "Lottery operator", riskLevel: "high" },
  { code: "920006", sicCode: "92000", label: "Arcade / gaming machines", riskLevel: "high" },

  // 85600 - Educational support activities
  { code: "856001", sicCode: "85600", label: "Private tutoring services", riskLevel: "low" },
  { code: "856002", sicCode: "85600", label: "Educational consultancy", riskLevel: "low" },
  { code: "856003", sicCode: "85600", label: "Exam preparation courses", riskLevel: "low" },
  { code: "856004", sicCode: "85600", label: "Student recruitment agency", riskLevel: "medium" },

  // 55100 - Hotels and similar accommodation
  { code: "551001", sicCode: "55100", label: "Full-service hotel", riskLevel: "low" },
  { code: "551002", sicCode: "55100", label: "Budget hotel / motel", riskLevel: "low" },
  { code: "551003", sicCode: "55100", label: "Boutique / luxury hotel", riskLevel: "low" },
  { code: "551004", sicCode: "55100", label: "Aparthotel", riskLevel: "low" },
  { code: "551005", sicCode: "55100", label: "Bed and breakfast", riskLevel: "low" },

  // 56103 - Take-away food shops and mobile food stands
  { code: "561031", sicCode: "56103", label: "Fast food takeaway", riskLevel: "low" },
  { code: "561032", sicCode: "56103", label: "Bakery / pastry takeaway", riskLevel: "low" },
  { code: "561033", sicCode: "56103", label: "Coffee / sandwich shop", riskLevel: "low" },
  { code: "561034", sicCode: "56103", label: "Food truck / mobile catering", riskLevel: "low" },
  { code: "561035", sicCode: "56103", label: "Delivery-only kitchen (dark kitchen)", riskLevel: "low" },

  // 47190 - Other retail sale in non-specialised stores
  { code: "471901", sicCode: "47190", label: "Department store", riskLevel: "low" },
  { code: "471902", sicCode: "47190", label: "Variety store (non-food)", riskLevel: "low" },
  { code: "471903", sicCode: "47190", label: "General merchandise retailer", riskLevel: "low" },
  { code: "471904", sicCode: "47190", label: "Discount store", riskLevel: "low" },

  // 47710 - Retail sale of clothing in specialised stores
  { code: "477101", sicCode: "47710", label: "Fashion retailer (high street)", riskLevel: "low" },
  { code: "477102", sicCode: "47710", label: "Designer / luxury clothing", riskLevel: "low" },
  { code: "477103", sicCode: "47710", label: "Children's clothing store", riskLevel: "low" },
  { code: "477104", sicCode: "47710", label: "Workwear / uniform retailer", riskLevel: "low" },
  { code: "477105", sicCode: "47710", label: "Second-hand / vintage clothing", riskLevel: "low" },

  // 61200 - Wireless telecommunications activities
  { code: "612001", sicCode: "61200", label: "Mobile network operator", riskLevel: "medium" },
  { code: "612002", sicCode: "61200", label: "MVNO (virtual network)", riskLevel: "medium" },
  { code: "612003", sicCode: "61200", label: "Mobile broadband provider", riskLevel: "medium" },
  { code: "612004", sicCode: "61200", label: "IoT / M2M connectivity", riskLevel: "low" },

  // 61300 - Satellite telecommunications activities
  { code: "613001", sicCode: "61300", label: "Satellite TV provider", riskLevel: "medium" },
  { code: "613002", sicCode: "61300", label: "Satellite broadband provider", riskLevel: "medium" },
  { code: "613003", sicCode: "61300", label: "Satellite ground services", riskLevel: "low" },

  // 61900 - Other telecommunications activities
  { code: "619001", sicCode: "61900", label: "Fixed-line telecoms provider", riskLevel: "medium" },
  { code: "619002", sicCode: "61900", label: "VoIP / internet telephony", riskLevel: "medium" },
  { code: "619003", sicCode: "61900", label: "Unified communications provider", riskLevel: "low" },
  { code: "619004", sicCode: "61900", label: "Network infrastructure services", riskLevel: "low" },

  // 70100 - Activities of head offices
  { code: "701001", sicCode: "70100", label: "Group holding company", riskLevel: "low" },
  { code: "701002", sicCode: "70100", label: "Corporate headquarters", riskLevel: "low" },
  { code: "701003", sicCode: "70100", label: "Strategic management office", riskLevel: "low" },

  // 06100 - Extraction of crude petroleum
  { code: "061001", sicCode: "06100", label: "Onshore oil extraction", riskLevel: "high" },
  { code: "061002", sicCode: "06100", label: "Offshore oil extraction", riskLevel: "high" },
  { code: "061003", sicCode: "06100", label: "Oil field services", riskLevel: "high" },

  // 06200 - Extraction of natural gas
  { code: "062001", sicCode: "06200", label: "Natural gas extraction", riskLevel: "high" },
  { code: "062002", sicCode: "06200", label: "LNG production", riskLevel: "high" },
  { code: "062003", sicCode: "06200", label: "Gas field services", riskLevel: "high" },

  // 19200 - Manufacture of refined petroleum products
  { code: "192001", sicCode: "19200", label: "Oil refinery", riskLevel: "high" },
  { code: "192002", sicCode: "19200", label: "Petrochemical processing", riskLevel: "high" },
  { code: "192003", sicCode: "19200", label: "Fuel blending / distribution", riskLevel: "medium" },

  // 46711 - Wholesale of petroleum and petroleum products
  { code: "467111", sicCode: "46711", label: "Fuel wholesaler", riskLevel: "medium" },
  { code: "467112", sicCode: "46711", label: "Lubricants / oils wholesaler", riskLevel: "medium" },
  { code: "467113", sicCode: "46711", label: "Aviation fuel supplier", riskLevel: "medium" },
]

/**
 * Get all activity codes for a given SIC code.
 */
export function getActivityCodesForSic(sicCode: string): ActivityCode[] {
  return ACTIVITY_CODES.filter((a) => a.sicCode === sicCode)
}

/**
 * Get a single activity code by its 6-digit code.
 */
export function getActivityCode(code: string): ActivityCode | undefined {
  return ACTIVITY_CODES.find((a) => a.code === code)
}

/**
 * Get all unique SIC codes that have activity codes defined.
 */
export function getSicsWithActivityCodes(): string[] {
  return [...new Set(ACTIVITY_CODES.map((a) => a.sicCode))]
}
