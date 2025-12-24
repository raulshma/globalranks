"use client"

import * as React from "react"
import { useNavigate } from "@tanstack/react-router"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from "@/components/ui/combobox"

interface Country {
  id: string
  code: string
  name: string
  region: string
  incomeLevel: string
}

interface CountrySelectorProps {
  countries: Array<Country>
  selectedCountry: string
}

const STORAGE_KEY = "global-indicies-selected-country"
const DEFAULT_COUNTRY = "IND"

/**
 * Convert ISO 3166-1 alpha-3 country code to flag emoji
 * Uses regional indicator symbols (Unicode)
 */
function getCountryFlag(code: string): string {
  // Map common alpha-3 codes to alpha-2 for flag emoji
  const alpha3ToAlpha2: Record<string, string> = {
    AFG: "AF", ALB: "AL", DZA: "DZ", AND: "AD", AGO: "AO",
    ARG: "AR", ARM: "AM", AUS: "AU", AUT: "AT", AZE: "AZ",
    BGD: "BD", BLR: "BY", BEL: "BE", BEN: "BJ", BTN: "BT",
    BOL: "BO", BIH: "BA", BWA: "BW", BRA: "BR", BRN: "BN",
    BGR: "BG", BFA: "BF", BDI: "BI", KHM: "KH", CMR: "CM",
    CAN: "CA", CAF: "CF", TCD: "TD", CHL: "CL", CHN: "CN",
    COL: "CO", COD: "CD", COG: "CG", CRI: "CR", HRV: "HR",
    CUB: "CU", CYP: "CY", CZE: "CZ", DNK: "DK", DJI: "DJ",
    DOM: "DO", ECU: "EC", EGY: "EG", SLV: "SV", GNQ: "GQ",
    ERI: "ER", EST: "EE", SWZ: "SZ", ETH: "ET", FJI: "FJ",
    FIN: "FI", FRA: "FR", GAB: "GA", GMB: "GM", GEO: "GE",
    DEU: "DE", GHA: "GH", GRC: "GR", GTM: "GT", GIN: "GN",
    GNB: "GW", GUY: "GY", HTI: "HT", HND: "HN", HUN: "HU",
    ISL: "IS", IND: "IN", IDN: "ID", IRN: "IR", IRQ: "IQ",
    IRL: "IE", ISR: "IL", ITA: "IT", JAM: "JM", JPN: "JP",
    JOR: "JO", KAZ: "KZ", KEN: "KE", PRK: "KP", KOR: "KR",
    KWT: "KW", KGZ: "KG", LAO: "LA", LVA: "LV", LBN: "LB",
    LSO: "LS", LBR: "LR", LBY: "LY", LTU: "LT", LUX: "LU",
    MDG: "MG", MWI: "MW", MYS: "MY", MDV: "MV", MLI: "ML",
    MLT: "MT", MRT: "MR", MUS: "MU", MEX: "MX", MDA: "MD",
    MNG: "MN", MNE: "ME", MAR: "MA", MOZ: "MZ", MMR: "MM",
    NAM: "NA", NPL: "NP", NLD: "NL", NZL: "NZ", NIC: "NI",
    NER: "NE", NGA: "NG", MKD: "MK", NOR: "NO", OMN: "OM",
    PAK: "PK", PAN: "PA", PNG: "PG", PRY: "PY", PER: "PE",
    PHL: "PH", POL: "PL", PRT: "PT", QAT: "QA", ROU: "RO",
    RUS: "RU", RWA: "RW", SAU: "SA", SEN: "SN", SRB: "RS",
    SLE: "SL", SGP: "SG", SVK: "SK", SVN: "SI", SOM: "SO",
    ZAF: "ZA", SSD: "SS", ESP: "ES", LKA: "LK", SDN: "SD",
    SUR: "SR", SWE: "SE", CHE: "CH", SYR: "SY", TWN: "TW",
    TJK: "TJ", TZA: "TZ", THA: "TH", TLS: "TL", TGO: "TG",
    TTO: "TT", TUN: "TN", TUR: "TR", TKM: "TM", UGA: "UG",
    UKR: "UA", ARE: "AE", GBR: "GB", USA: "US", URY: "UY",
    UZB: "UZ", VEN: "VE", VNM: "VN", YEM: "YE", ZMB: "ZM",
    ZWE: "ZW", CIV: "CI", PSE: "PS", XKX: "XK",
  }
  
  const alpha2 = alpha3ToAlpha2[code.toUpperCase()]
  if (!alpha2) return "🏳️"
  
  // Convert alpha-2 code to flag emoji using regional indicator symbols
  const codePoints = alpha2
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0))
  
  return String.fromCodePoint(...codePoints)
}

/**
 * Get stored country from localStorage
 */
export function getStoredCountry(): string {
  if (typeof window === "undefined") return DEFAULT_COUNTRY
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_COUNTRY
}

/**
 * Format region name for display
 */
function formatRegion(region: string): string {
  return region
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

/**
 * Group countries by region for organized display
 */
function groupCountriesByRegion(countries: Array<Country>): Map<string, Array<Country>> {
  const grouped = new Map<string, Array<Country>>()
  
  for (const country of countries) {
    const region = country.region || "Other"
    if (!grouped.has(region)) {
      grouped.set(region, [])
    }
    grouped.get(region)!.push(country)
  }
  
  // Sort regions alphabetically
  return new Map([...grouped.entries()].sort((a, b) => a[0].localeCompare(b[0])))
}

export function CountrySelector({ countries, selectedCountry }: CountrySelectorProps) {
  const navigate = useNavigate()
  
  const selectedCountryData = countries.find((c) => c.code === selectedCountry)
  const [inputValue, setInputValue] = React.useState(selectedCountryData?.name || "")

  const handleCountryChange = React.useCallback(
    (value: string | null) => {
      if (value) {
        localStorage.setItem(STORAGE_KEY, value)
        void navigate({
          to: ".",
          search: (prev: Record<string, unknown>) => ({ ...prev, country: value }),
        })
      }
    },
    [navigate]
  )

  // Update input value when selected country changes
  React.useEffect(() => {
    const country = countries.find((c) => c.code === selectedCountry)
    if (country) {
      setInputValue(country.name)
    }
  }, [selectedCountry, countries])

  // Filter countries based on input
  const filteredCountries = React.useMemo(() => {
    if (!inputValue) return countries
    const lower = inputValue.toLowerCase()
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.code.toLowerCase().includes(lower) ||
        c.region.toLowerCase().includes(lower)
    )
  }, [countries, inputValue])

  // Group filtered countries by region
  const groupedCountries = React.useMemo(
    () => groupCountriesByRegion(filteredCountries),
    [filteredCountries]
  )

  // Determine if we should show grouped view (when not filtering)
  const showGrouped = !inputValue || inputValue === selectedCountryData?.name

  return (
    <Combobox
      value={selectedCountry}
      onValueChange={handleCountryChange}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
    >
      <ComboboxInput
        placeholder="Select country..."
        className="w-32 sm:w-56"
        showClear={false}
        aria-label="Select country"
      />
      <ComboboxContent className="max-h-80">
        <ComboboxList>
          {showGrouped ? (
            // Grouped view by region
            Array.from(groupedCountries.entries()).map(([region, regionCountries]) => (
              <ComboboxGroup key={region}>
                <ComboboxLabel>{formatRegion(region)}</ComboboxLabel>
                {regionCountries.map((country) => (
                  <ComboboxItem key={country.code} value={country.code}>
                    <span className="mr-2 text-base">{getCountryFlag(country.code)}</span>
                    <span className="font-medium">{country.name}</span>
                    <span className="text-muted-foreground ml-auto text-xs">
                      {country.code}
                    </span>
                  </ComboboxItem>
                ))}
              </ComboboxGroup>
            ))
          ) : (
            // Flat filtered view
            filteredCountries.map((country) => (
              <ComboboxItem key={country.code} value={country.code}>
                <span className="mr-2 text-base">{getCountryFlag(country.code)}</span>
                <div className="flex flex-col">
                  <span className="font-medium">{country.name}</span>
                  <span className="text-muted-foreground text-xs">
                    {formatRegion(country.region)}
                  </span>
                </div>
                <span className="text-muted-foreground ml-auto text-xs">
                  {country.code}
                </span>
              </ComboboxItem>
            ))
          )}
        </ComboboxList>
        <ComboboxEmpty>No countries found</ComboboxEmpty>
      </ComboboxContent>
    </Combobox>
  )
}
