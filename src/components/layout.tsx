"use client"

import * as React from "react"
import { Link } from "@tanstack/react-router"
import { IconChartBar } from "@tabler/icons-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Navigation } from "@/components/navigation"
import { CountrySelector } from "@/components/country-selector"

interface Country {
  id: string
  code: string
  name: string
  region: string
  incomeLevel: string
}

interface LayoutProps {
  children: React.ReactNode
  countries: Array<Country>
  selectedCountry: string
}

export function Layout({ children, countries, selectedCountry }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <IconChartBar className="size-5 text-primary" />
              <span className="font-semibold text-sm">India Ranks</span>
            </Link>
            <Navigation />
          </div>
          <div className="flex items-center gap-3">
            <CountrySelector
              countries={countries}
              selectedCountry={selectedCountry}
            />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">{children}</main>
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          <p>
            India Ranks — Tracking India's position across global indices
          </p>
        </div>
      </footer>
    </div>
  )
}
