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
