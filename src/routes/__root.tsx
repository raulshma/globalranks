import * as React from "react"
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"

import appCss from "../styles.css?url"
import { ThemeProvider } from "@/components/theme-provider"
import { Layout } from "@/components/layout"
import { getAllCountries } from "@/lib/server-functions/countries"
import { generateWebsiteJsonLd } from "@/lib/seo"

// Router context type
export interface RouterContext {
  selectedCountry: string
}

// Default country code
const DEFAULT_COUNTRY = "IND"

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "India Ranks — Global Rankings Intelligence Platform",
      },
      {
        name: "description",
        content:
          "Track and analyze India's position across global ranking indices. Compare with peer nations, explore trends, and build custom composite indices.",
      },
      {
        name: "keywords",
        content:
          "India rankings, global indices, country comparison, HDI, GDP, innovation index, world rankings, international rankings",
      },
      {
        property: "og:title",
        content: "India Ranks — Global Rankings Intelligence Platform",
      },
      {
        property: "og:description",
        content:
          "Track and analyze India's position across global ranking indices. Compare with peer nations, explore trends, and build custom composite indices.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "India Ranks — Global Rankings Intelligence Platform",
      },
      {
        name: "twitter:description",
        content:
          "Track and analyze India's position across global ranking indices. Compare with peer nations, explore trends, and build custom composite indices.",
      },
      // Theme color for mobile browsers
      {
        name: "theme-color",
        content: "#16a34a",
        media: "(prefers-color-scheme: light)",
      },
      {
        name: "theme-color",
        content: "#22c55e",
        media: "(prefers-color-scheme: dark)",
      },
      // Mobile app capable
      {
        name: "mobile-web-app-capable",
        content: "yes",
      },
      {
        name: "apple-mobile-web-app-capable",
        content: "yes",
      },
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "default",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        href: "/favicon.ico",
      },
      {
        rel: "canonical",
        href: "https://indiaranks.com",
      },
      // Preconnect to font origins for faster loading
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      // Preload critical font weights
      {
        rel: "preload",
        href: "/fonts/noto-sans-latin-wght-normal.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      // Apple touch icon for iOS
      {
        rel: "apple-touch-icon",
        href: "/logo192.png",
      },
      // Theme color for mobile browsers
      {
        rel: "manifest",
        href: "/manifest.json",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(generateWebsiteJsonLd()),
      },
    ],
  }),
  loader: async () => {
    const countries = await getAllCountries()
    return { countries }
  },
  component: RootComponent,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  const { countries } = Route.useLoaderData()
  const search: Record<string, string | undefined> = Route.useSearch()
  
  // Get selected country from URL search params or default
  const selectedCountry = search.country ?? DEFAULT_COUNTRY

  return (
    <ThemeProvider defaultTheme="system" storageKey="india-ranks-theme">
      <Layout countries={countries} selectedCountry={selectedCountry}>
        <Outlet />
      </Layout>
    </ThemeProvider>
  )
}
