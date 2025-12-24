/**
 * Country All Indices View Route
 * Displays all ranking indices for a selected country
 * Requirements: 1.1, 1.2, 7.1, 7.2, 7.3, 7.4, 2.4
 */

import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { z } from "zod"
import * as React from "react"
import { IconAlertCircle, IconChartBar, IconRefresh } from "@tabler/icons-react"

import type { PerformanceTier, ViewMode } from "@/components/search-filter-panel"
import { getAllLatestRankingsForCountry } from "@/lib/server-functions/country-rankings"
import { applyFilters, filterDomainGroups } from "@/lib/country-rankings-filter"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CACHE_CONFIG } from "@/lib/cache-config"
import { GroupedIndicesView } from "@/components/grouped-indices-view"
import { FlatIndicesView } from "@/components/flat-indices-view"
import { SearchFilterPanel } from "@/components/search-filter-panel"
import { SROnly } from "@/components/ui/sr-announcer"

// Search params schema for URL state
const searchSchema = z.object({
  country: z.string().length(3).optional().default("IND"),
  view: z.enum(["grouped", "flat"]).optional().default("grouped"),
  search: z.string().optional(),
  tier: z
    .enum(["all", "top25", "mid-upper", "mid-lower", "bottom25"])
    .optional()
    .default("all"),
})

export const Route = createFileRoute("/country")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ country: search.country }),
  // Rankings data is semi-stable
  staleTime: CACHE_CONFIG.SEMI_STABLE.staleTime,
  gcTime: CACHE_CONFIG.SEMI_STABLE.gcTime,
  loader: async ({ deps }) => {
    return getAllLatestRankingsForCountry({ data: { countryCode: deps.country } })
  },
  head: ({ loaderData }) => {
    const countryName = loaderData?.countryName ?? "Country"
    const totalIndices = loaderData?.totalIndices ?? 0
    const indicesWithData = loaderData?.indicesWithData ?? 0

    const description = `View all ${indicesWithData} global ranking indices for ${countryName}. See latest rankings across ${totalIndices} indices including economic, governance, social, and environmental metrics.`

    return {
      meta: [
        {
          title: `All Rankings — ${countryName} — Global Indicies`,
        },
        {
          name: "description",
          content: description,
        },
        {
          property: "og:title",
          content: `All Rankings — ${countryName}`,
        },
        {
          property: "og:description",
          content: description,
        },
      ],
    }
  },
  component: CountryRankingsPage,
  pendingComponent: CountryRankingsLoading,
  errorComponent: CountryRankingsError,
})


/**
 * Main page component for displaying all indices for a country
 * Requirements: 1.2, 4.5, 7.4
 */
function CountryRankingsPage() {
  const data = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = useNavigate()

  // State for screen reader announcements
  const [announcement, setAnnouncement] = React.useState("")

  // Filter rankings based on search and tier - Requirements 6.2, 6.3, 6.4
  const filteredRankings = React.useMemo(() => {
    return applyFilters(data.rankings, {
      searchQuery: search.search ?? "",
      performanceTier: search.tier,
    })
  }, [data.rankings, search.search, search.tier])

  // Filter grouped data based on filtered rankings
  const filteredGroups = React.useMemo(() => {
    return filterDomainGroups(data.groupedByDomain, filteredRankings)
  }, [data.groupedByDomain, filteredRankings])

  // Announce filter results to screen readers (debounced)
  React.useEffect(() => {
    const hasFilters = (search.search && search.search.length > 0) || search.tier !== "all"
    if (hasFilters) {
      const timer = setTimeout(() => {
        setAnnouncement(`Showing ${filteredRankings.length} of ${data.indicesWithData} indices`)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [filteredRankings.length, data.indicesWithData, search.search, search.tier])

  // Handlers for filter changes
  const handleSearchChange = (value: string) => {
    navigate({
      to: "/country",
      search: {
        ...search,
        search: value || undefined,
      },
    })
  }

  const handleTierChange = (value: PerformanceTier) => {
    navigate({
      to: "/country",
      search: {
        ...search,
        tier: value,
      },
    })
  }

  const handleViewModeChange = (mode: ViewMode) => {
    navigate({
      to: "/country",
      search: {
        ...search,
        view: mode,
      },
    })
  }

  // Handler for filter announcements
  const handleFilterAnnounce = React.useCallback((message: string) => {
    setAnnouncement(message)
  }, [])

  return (
    <div className="space-y-8 container mx-auto px-4 relative z-10">
      {/* Screen reader announcements for filter changes */}
      <SROnly aria-live="polite">{announcement}</SROnly>



      {/* Summary Stats - Responsive grid */}
      <div 
        className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-3"
        role="region"
        aria-label="Summary statistics"
      >
        <StatCard
          title="Total Indices"
          value={data.totalIndices}
          icon={<IconChartBar className="size-4" aria-hidden="true" />}
        />
        <StatCard
          title="With Data"
          value={data.indicesWithData}
          description={`${((data.indicesWithData / data.totalIndices) * 100).toFixed(0)}% coverage`}
        />
        <StatCard
          title="Filtered"
          value={filteredRankings.length}
          description={
            filteredRankings.length !== data.indicesWithData
              ? `of ${data.indicesWithData} indices`
              : "showing all"
          }
          className="col-span-2 md:col-span-1"
        />
      </div>

      {/* Search and Filter Panel */}
      <SearchFilterPanel
        searchQuery={search.search ?? ""}
        performanceTier={search.tier}
        viewMode={search.view}
        totalCount={data.indicesWithData}
        filteredCount={filteredRankings.length}
        onSearchChange={handleSearchChange}
        onTierChange={handleTierChange}
        onViewModeChange={handleViewModeChange}
        onFilterAnnounce={handleFilterAnnounce}
      />

      {/* Rankings Display */}
      <main role="main" aria-label="Rankings list">
        {search.view === "flat" ? (
          <FlatIndicesView rankings={filteredRankings} />
        ) : (
          <GroupedIndicesView groups={filteredGroups} />
        )}

        {/* Empty State */}
        {filteredRankings.length === 0 && (
          <Card>
            <CardContent className="py-8 sm:py-12 text-center">
              <p className="text-muted-foreground">
                No indices match your current filters
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}


/**
 * Stat card component for summary statistics
 * Responsive sizing for mobile/desktop
 */
interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  className?: string
}

function StatCard({ title, value, description, icon, className }: StatCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
        <CardTitle className="text-muted-foreground text-[10px] sm:text-xs font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-lg sm:text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-muted-foreground text-[10px] sm:text-xs">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}


/**
 * Loading skeleton component for country rankings page
 * Requirement 7.3: Display loading indicators
 * Requirement 7.4: Responsive layout
 */
function CountryRankingsLoading() {
  return (
    <div className="space-y-4 sm:space-y-6 animate-pulse" aria-busy="true" aria-label="Loading rankings">
      {/* Page Header Skeleton */}
      <div>
        <div className="h-6 sm:h-8 w-36 sm:w-48 bg-muted rounded" />
        <div className="h-3 sm:h-4 w-48 sm:w-64 bg-muted rounded mt-2" />
      </div>

      {/* Summary Stats Skeleton */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className={i === 3 ? "col-span-2 md:col-span-1" : ""}>
            <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
              <div className="h-2 sm:h-3 w-16 sm:w-20 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-5 sm:h-8 w-12 sm:w-16 bg-muted rounded" />
              <div className="h-2 sm:h-3 w-20 sm:w-24 bg-muted rounded mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Panel Skeleton */}
      <Card>
        <CardContent className="py-3 sm:py-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="h-10 sm:h-9 w-full bg-muted rounded" />
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <div className="h-10 sm:h-9 w-full sm:w-[140px] bg-muted rounded" />
              <div className="flex-1" />
              <div className="h-9 sm:h-8 w-[72px] bg-muted rounded" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rankings Grid Skeleton */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 w-24 sm:w-32 bg-muted rounded" />
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-6 sm:h-8 w-16 sm:w-20 bg-muted rounded" />
                <div className="h-5 sm:h-6 w-10 sm:w-12 bg-muted rounded" />
              </div>
              <div className="h-3 sm:h-4 w-full bg-muted rounded" />
              <div className="h-3 sm:h-4 w-20 sm:w-24 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

/**
 * Error component for country rankings page
 * Requirement 7.3: Implement error boundary for server errors
 */
function CountryRankingsError({ error, reset }: { error: Error; reset?: () => void }) {
  const isNotFound = error.message.includes("Country not found")

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">All Rankings</h1>
      </div>

      <Card>
        <CardContent className="py-8 sm:py-12">
          <div className="flex flex-col items-center text-center px-4">
            <IconAlertCircle className="size-10 sm:size-12 text-destructive mb-4" aria-hidden="true" />
            <h2 className="text-base sm:text-lg font-semibold mb-2">
              {isNotFound ? "Country Not Found" : "Error Loading Rankings"}
            </h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-md">
              {isNotFound
                ? "The selected country could not be found. Please select a valid country from the dropdown."
                : "There was a problem loading the rankings data. Please try again."}
            </p>
            {reset && (
              <Button onClick={reset} variant="outline" className="touch-manipulation">
                <IconRefresh className="size-4 mr-2" aria-hidden="true" />
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
