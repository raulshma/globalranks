"use client"

import * as React from "react"
import { useNavigate } from "@tanstack/react-router"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
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

const STORAGE_KEY = "india-ranks-selected-country"
const DEFAULT_COUNTRY = "IND"

export function getStoredCountry(): string {
  if (typeof window === "undefined") return DEFAULT_COUNTRY
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_COUNTRY
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
          search: { country: value },
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

  return (
    <Combobox
      value={selectedCountry}
      onValueChange={handleCountryChange}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
    >
      <ComboboxInput
        placeholder="Select country..."
        className="w-48"
        showClear={false}
      />
      <ComboboxContent>
        <ComboboxList>
          {filteredCountries.map((country) => (
            <ComboboxItem key={country.code} value={country.code}>
              <span className="font-medium">{country.name}</span>
              <span className="text-muted-foreground ml-auto text-xs">
                {country.code}
              </span>
            </ComboboxItem>
          ))}
        </ComboboxList>
        <ComboboxEmpty>No countries found</ComboboxEmpty>
      </ComboboxContent>
    </Combobox>
  )
}
