import * as React from "react"
import { Link } from "@tanstack/react-router"
import { IconChartBar } from "@tabler/icons-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileNavigation, Navigation } from "@/components/navigation"
import { CountrySelector } from "@/components/country-selector"
import { SkipLink } from "@/components/ui/skip-link"
import { SRAnnouncerProvider } from "@/components/ui/sr-announcer"
import { GrainOverlay, SoftGradientMesh } from "@/components/ui/retro-effects"

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const handleMobileMenuToggle = React.useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev)
  }, [])

  const handleMobileMenuClose = React.useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  return (
    <SRAnnouncerProvider>
      <div className="min-h-screen bg-background relative font-sans selection:bg-primary selection:text-white">
        <GrainOverlay />
        <SoftGradientMesh />
        <SkipLink href="#main-content" />
        <header 
          className="sticky top-0 z-50 border-b border-white/10 bg-background/70 backdrop-blur-xl supports-backdrop-filter:bg-background/60 shadow-soft-sm"
          role="banner"
        >
          <div className="container mx-auto flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-4 md:gap-6">
              <Link to="/" className="flex items-center gap-2" aria-label="Global Indicies Home">
                <IconChartBar className="size-5 text-primary" aria-hidden="true" />
                <span className="font-bold text-sm tracking-tighter uppercase">Global Indicies</span>
              </Link>
              <Navigation 
                isMobileMenuOpen={isMobileMenuOpen}
                onMobileMenuToggle={handleMobileMenuToggle}
              />
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <CountrySelector
                countries={countries}
                selectedCountry={selectedCountry}
              />
              <ThemeToggle />
            </div>
          </div>
          <MobileNavigation 
            isOpen={isMobileMenuOpen} 
            onClose={handleMobileMenuClose} 
          />
        </header>
        <main 
          id="main-content" 
          className="w-full h-full relative z-10 py-4 sm:py-6"
          role="main"
          tabIndex={-1}
        >
          {children}
        </main>
        <footer 
          className="border-t border-border py-4 sm:py-6"
          role="contentinfo"
        >
          <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
            <p>
              Global Indicies — Tracking country positions across global indices
            </p>
          </div>
        </footer>
      </div>
    </SRAnnouncerProvider>
  )
}
