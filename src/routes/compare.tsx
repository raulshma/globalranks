import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { z } from "zod"
import {
  IconArrowDown,
  IconArrowUp,
  IconMinus,
  IconTrendingDown,
  IconTrendingUp,
  IconX,
} from "@tabler/icons-react"
import * as React from "react"

import { calculateGaps, compareCountries } from "@/lib/server-functions/comparison"
import { getAllCountries, getAllPeerGroups } from "@/lib/server-functions/countries"
import { getAllDomainsWithStats } from "@/lib/server-functions/domains"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { RadarChart } from "@/components/charts/radar-chart"
import { cn } from "@/lib/utils"
import { generateComparisonJsonLd } from "@/lib/seo"
import { CACHE_CONFIG } from "@/router"

const searchSchema = z.object({
  country: z.string().length(3).optional().default("IND"),
  compare: z.string().optional(), // Comma-separated country codes
  peerGroup: z.string().optional(),
  domain: z.string().optional(),
})

export const Route = createFileRoute("/compare")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({
    country: search.country,
    compare: search.compare,
    peerGroup: search.peerGroup,
    domain: search.domain,
  }),
  // Comparison data is semi-stable
  staleTime: CACHE_CONFIG.SEMI_STABLE.staleTime,
  gcTime: CACHE_CONFIG.SEMI_STABLE.gcTime,
  loader: async ({ deps }) => {
    const { country, compare, peerGroup, domain } = deps

    // Get all countries and peer groups for selectors
    const [countries, peerGroups, domainsData] = await Promise.all([
      getAllCountries(),
      getAllPeerGroups(),
      getAllDomainsWithStats({ data: { countryCode: country } }),
    ])

    // Parse comparison countries from search params
    const compareCountryCodes = compare
      ? compare.split(",").filter((c) => c.length === 3)
      : []

    // If we have countries to compare, fetch comparison data
    let comparisonData = null
    let gapData = null

    if (compareCountryCodes.length > 0 || peerGroup) {
      const allCountryCodes = [country, ...compareCountryCodes]

      // Get indices for the selected domain or all indices
      const indexIds = domain
        ? domainsData.domains
            .find((d) => d.id === domain)
            ?.indices.map((i) => i.id)
        : undefined

      comparisonData = await compareCountries({
        data: {
          countryCodes: allCountryCodes,
          peerGroupId: peerGroup,
          indexIds,
        },
      })

      // Calculate gaps if we have comparison data
      if (comparisonData.countries.length > 1) {
        const otherCountries = comparisonData.countries
          .filter((c) => c.code !== country)
          .map((c) => c.code)

        if (otherCountries.length > 0) {
          gapData = await calculateGaps({
            data: {
              baseCountryCode: country,
              comparisonCountryCodes: otherCountries,
              indexIds,
            },
          })
        }
      }
    }

    // Get country name for SEO
    const baseCountryName = countries.find((c) => c.code === country)?.name ?? country

    return {
      baseCountry: country,
      baseCountryName,
      countries,
      peerGroups,
      domains: domainsData.domains,
      latestYear: domainsData.latestYear,
      comparisonData,
      gapData,
      selectedPeerGroup: peerGroup,
      selectedDomain: domain,
    }
  },
  head: ({ loaderData }) => {
    const baseCountryName = loaderData?.baseCountryName ?? "India"
    const baseCountry = loaderData?.baseCountry ?? "IND"
    const year = loaderData?.latestYear ?? new Date().getFullYear()
    const comparedCountries = loaderData?.comparisonData?.countries
      .filter((c) => c.code !== baseCountry)
      .map((c) => c.name) ?? []
    const indicesCount = loaderData?.comparisonData?.indices.length ?? 0

    const jsonLd =
      comparedCountries.length > 0
        ? generateComparisonJsonLd({
            baseCountry: baseCountryName,
            comparedCountries,
            indicesCount,
            year,
          })
        : null

    const description =
      comparedCountries.length > 0
        ? `Compare ${baseCountryName} with ${comparedCountries.join(", ")} across ${indicesCount} global ranking indices for ${year}.`
        : `Compare ${baseCountryName} with peer nations across global ranking indices. Select BRICS, G20, or custom country groups.`

    return {
      meta: [
        {
          title: `Country Comparison — ${baseCountryName} — India Ranks`,
        },
        {
          name: "description",
          content: description,
        },
        {
          property: "og:title",
          content: `Country Comparison — ${baseCountryName}`,
        },
        {
          property: "og:description",
          content: description,
        },
      ],
      scripts: jsonLd
        ? [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }]
        : [],
    }
  },
  component: ComparePage,
})


function ComparePage() {
  const data = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = useNavigate()

  const [countrySearch, setCountrySearch] = React.useState("")

  // Get selected comparison countries from URL
  const selectedCountryCodes = React.useMemo(() => {
    if (!search.compare) return []
    return search.compare.split(",").filter((c) => c.length === 3)
  }, [search.compare])

  // Handle adding a country to comparison
  const handleAddCountry = (countryCode: string | null) => {
    if (!countryCode || countryCode === data.baseCountry) return
    if (selectedCountryCodes.includes(countryCode)) return

    const newCodes = [...selectedCountryCodes, countryCode]
    navigate({
      to: "/compare",
      search: {
        ...search,
        compare: newCodes.join(","),
        peerGroup: undefined, // Clear peer group when manually selecting
      },
    })
    setCountrySearch("")
  }

  // Handle removing a country from comparison
  const handleRemoveCountry = (countryCode: string) => {
    const newCodes = selectedCountryCodes.filter((c: string) => c !== countryCode)
    navigate({
      to: "/compare",
      search: {
        ...search,
        compare: newCodes.length > 0 ? newCodes.join(",") : undefined,
      },
    })
  }

  // Handle peer group selection
  const handlePeerGroupSelect = (peerGroupId: string | null) => {
    navigate({
      to: "/compare",
      search: {
        ...search,
        peerGroup: peerGroupId || undefined,
        compare: undefined, // Clear manual selection when using peer group
      },
    })
  }

  // Handle domain filter
  const handleDomainSelect = (domainId: string | null) => {
    navigate({
      to: "/compare",
      search: {
        ...search,
        domain: domainId || undefined,
      },
    })
  }

  // Get countries available for selection (exclude base and already selected)
  const availableCountries = React.useMemo(() => {
    const excludedCodes = new Set([data.baseCountry, ...selectedCountryCodes])
    return data.countries.filter((c) => !excludedCodes.has(c.code))
  }, [data.countries, data.baseCountry, selectedCountryCodes])

  // Filter countries by search
  const filteredCountries = React.useMemo(() => {
    if (!countrySearch) return availableCountries.slice(0, 20)
    const lower = countrySearch.toLowerCase()
    return availableCountries
      .filter(
        (c) =>
          c.name.toLowerCase().includes(lower) ||
          c.code.toLowerCase().includes(lower)
      )
      .slice(0, 20)
  }, [availableCountries, countrySearch])

  // Get base country name
  const baseCountryName =
    data.countries.find((c) => c.code === data.baseCountry)?.name ?? data.baseCountry

  // Get selected peer group
  const selectedPeerGroup = data.peerGroups.find(
    (pg) => pg.id === data.selectedPeerGroup
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Country Comparison</h1>
        <p className="text-muted-foreground text-sm">
          Compare {baseCountryName} with peer nations across global indices
        </p>
      </div>

      {/* Selection Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Select Countries to Compare</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Peer Group Presets */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Peer Group Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {data.peerGroups.map((pg) => (
                <Button
                  key={pg.id}
                  variant={data.selectedPeerGroup === pg.id ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    handlePeerGroupSelect(
                      data.selectedPeerGroup === pg.id ? null : pg.id
                    )
                  }
                >
                  {pg.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Manual Country Selection */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Or Select Countries Manually
            </label>
            <Combobox
              value=""
              onValueChange={handleAddCountry}
              inputValue={countrySearch}
              onInputValueChange={setCountrySearch}
            >
              <ComboboxInput
                placeholder="Search countries to add..."
                className="max-w-md"
                showClear={false}
              />
              <ComboboxContent className="max-h-64">
                <ComboboxList>
                  {filteredCountries.map((country) => (
                    <ComboboxItem key={country.code} value={country.code}>
                      <div className="flex flex-col">
                        <span className="font-medium">{country.name}</span>
                        <span className="text-muted-foreground text-xs">
                          {country.region} • {country.code}
                        </span>
                      </div>
                    </ComboboxItem>
                  ))}
                </ComboboxList>
                <ComboboxEmpty>No countries found</ComboboxEmpty>
              </ComboboxContent>
            </Combobox>
          </div>

          {/* Selected Countries */}
          {(selectedCountryCodes.length > 0 || selectedPeerGroup) && (
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Comparing with
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedPeerGroup ? (
                  <Badge variant="secondary" className="gap-1">
                    {selectedPeerGroup.name} ({selectedPeerGroup.countryCodes.length} countries)
                    <button
                      onClick={() => handlePeerGroupSelect(null)}
                      className="ml-1 hover:text-destructive"
                    >
                      <IconX className="size-3" />
                    </button>
                  </Badge>
                ) : (
                  selectedCountryCodes.map((code) => {
                    const country = data.countries.find((c) => c.code === code)
                    return (
                      <Badge key={code} variant="secondary" className="gap-1">
                        {country?.name ?? code}
                        <button
                          onClick={() => handleRemoveCountry(code)}
                          className="ml-1 hover:text-destructive"
                        >
                          <IconX className="size-3" />
                        </button>
                      </Badge>
                    )
                  })
                )}
              </div>
            </div>
          )}

          {/* Domain Filter */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Filter by Domain
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!data.selectedDomain ? "default" : "outline"}
                size="sm"
                onClick={() => handleDomainSelect(null)}
              >
                All Domains
              </Button>
              {data.domains.map((domain) => (
                <Button
                  key={domain.id}
                  variant={data.selectedDomain === domain.id ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    handleDomainSelect(
                      data.selectedDomain === domain.id ? null : domain.id
                    )
                  }
                >
                  {domain.icon} {domain.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {data.comparisonData && data.comparisonData.countries.length > 1 ? (
        <ComparisonResults
          comparisonData={data.comparisonData}
          gapData={data.gapData}
          baseCountry={data.baseCountry}
          domains={data.domains}
        />
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Select countries or a peer group above to start comparing
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


interface ComparisonResultsProps {
  comparisonData: Awaited<ReturnType<typeof compareCountries>>
  gapData: Awaited<ReturnType<typeof calculateGaps>> | null
  baseCountry: string
  domains: Array<{
    id: string
    name: string
    icon: string
    indices: Array<{ id: string; name: string; shortName: string }>
  }>
}

function ComparisonResults({
  comparisonData,
  gapData,
  baseCountry,
}: ComparisonResultsProps) {
  const { countries, indices, data: comparisonPoints, year } = comparisonData

  // Group comparison data by index
  const dataByIndex = React.useMemo(() => {
    const grouped = new Map<
      string,
      {
        index: (typeof indices)[0]
        entries: Array<{
          countryCode: string
          countryName: string
          rank: number
          score: number | null
          percentile: number
        }>
      }
    >()

    for (const index of indices) {
      const indexEntries = comparisonPoints
        .filter((p) => p.indexId === index.id)
        .map((p) => {
          const country = countries.find((c) => c.code === p.countryCode)
          return {
            countryCode: p.countryCode,
            countryName: country?.name ?? p.countryCode,
            rank: p.rank,
            score: p.score,
            percentile: p.percentile,
          }
        })
        .sort((a, b) => a.rank - b.rank)

      if (indexEntries.length > 0) {
        grouped.set(index.id, { index, entries: indexEntries })
      }
    }

    return grouped
  }, [indices, comparisonPoints, countries])

  // Prepare data for radar chart
  const radarData = React.useMemo(() => {
    // Get top 8 indices for radar chart
    const topIndices = Array.from(dataByIndex.values())
      .slice(0, 8)
      .map(({ index, entries }) => ({
        index: {
          id: index.id,
          name: index.name,
          shortName: index.shortName,
          domainId: index.domainId,
          source: "",
          sourceUrl: "",
          methodology: "",
          updateFrequency: "annual" as const,
          scoreRange: { min: 0, max: 100 },
          higherIsBetter: true,
          lastUpdated: new Date(),
        },
        entries: entries.map((e) => ({
          id: "",
          indexId: index.id,
          countryCode: e.countryCode,
          year,
          rank: e.rank,
          totalCountries: 100,
          score: e.score,
          normalizedScore: e.percentile,
          percentile: e.percentile,
          confidence: "high" as const,
        })),
      }))

    return topIndices
  }, [dataByIndex, year])

  const radarCountries = countries.map((c) => ({
    code: c.code,
    name: c.name,
  }))

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      {gapData && (
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            title="Indices Compared"
            value={gapData.gaps.length}
            description={`For ${year}`}
          />
          <StatCard
            title="Ahead"
            value={gapData.summary.negativeGaps}
            description="Better rank than peers"
            valueClassName="text-green-600"
          />
          <StatCard
            title="Behind"
            value={gapData.summary.positiveGaps}
            description="Lower rank than peers"
            valueClassName="text-red-600"
          />
          <StatCard
            title="Converging"
            value={gapData.summary.convergingCount}
            description="Gap narrowing over time"
            icon={<IconTrendingUp className="size-4 text-green-600" />}
          />
        </div>
      )}

      {/* Radar Chart */}
      {radarData.length > 0 && (
        <RadarChart
          data={radarData}
          countries={radarCountries}
          title="Multi-Index Comparison"
          description={`Comparing ${countries.length} countries across ${radarData.length} indices`}
          height={400}
        />
      )}

      {/* Gap Analysis */}
      {gapData && gapData.gaps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Gap Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-2 font-medium">Index</th>
                    <th className="pb-2 text-right font-medium">
                      {countries.find((c) => c.code === baseCountry)?.name ?? baseCountry}
                    </th>
                    <th className="pb-2 text-right font-medium">Best Peer</th>
                    <th className="pb-2 text-right font-medium">Gap</th>
                    <th className="pb-2 text-right font-medium">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {gapData.gaps.slice(0, 20).map((gap) => (
                    <tr
                      key={`${gap.indexId}-${gap.comparisonCountryCode}`}
                      className="border-b border-border last:border-0"
                    >
                      <td className="py-2">{gap.indexName}</td>
                      <td className="py-2 text-right font-medium">{gap.baseRank}</td>
                      <td className="py-2 text-right">
                        <span className="font-medium">{gap.comparisonRank}</span>
                        <span className="text-muted-foreground text-xs ml-1">
                          ({countries.find((c) => c.code === gap.comparisonCountryCode)?.name})
                        </span>
                      </td>
                      <td className="py-2 text-right">
                        <GapIndicator gap={gap.gap} />
                      </td>
                      <td className="py-2 text-right">
                        <TrendBadge trend={gap.trend} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Side-by-Side Ranking Tables */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Side-by-Side Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-2 font-medium">Index</th>
                  {countries.map((country) => (
                    <th
                      key={country.code}
                      className={cn(
                        "pb-2 text-right font-medium",
                        country.code === baseCountry && "bg-muted/50"
                      )}
                    >
                      {country.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from(dataByIndex.values()).map(({ index, entries }) => (
                  <tr key={index.id} className="border-b border-border last:border-0">
                    <td className="py-2">
                      <span className="font-medium">{index.name}</span>
                    </td>
                    {countries.map((country) => {
                      const entry = entries.find((e) => e.countryCode === country.code)
                      const isBase = country.code === baseCountry
                      const isBest =
                        entry && entries[0]?.countryCode === country.code

                      return (
                        <td
                          key={country.code}
                          className={cn(
                            "py-2 text-right",
                            isBase && "bg-muted/50",
                            isBest && "text-green-600 font-medium"
                          )}
                        >
                          {entry ? (
                            <div>
                              <span className="font-medium">{entry.rank}</span>
                              <span className="text-muted-foreground text-xs ml-1">
                                ({entry.percentile.toFixed(0)}%)
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  valueClassName?: string
}

function StatCard({ title, value, description, icon, valueClassName }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-muted-foreground text-xs font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", valueClassName)}>{value}</div>
        {description && (
          <p className="text-muted-foreground text-xs">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

interface GapIndicatorProps {
  gap: number
}

function GapIndicator({ gap }: GapIndicatorProps) {
  if (gap > 0) {
    return (
      <span className="flex items-center justify-end gap-1 text-red-600">
        <IconArrowDown className="size-3" />
        <span className="text-xs font-medium">+{gap}</span>
      </span>
    )
  }

  if (gap < 0) {
    return (
      <span className="flex items-center justify-end gap-1 text-green-600">
        <IconArrowUp className="size-3" />
        <span className="text-xs font-medium">{gap}</span>
      </span>
    )
  }

  return (
    <span className="flex items-center justify-end gap-1 text-muted-foreground">
      <IconMinus className="size-3" />
      <span className="text-xs">0</span>
    </span>
  )
}

interface TrendBadgeProps {
  trend: "converging" | "diverging" | "stable"
}

function TrendBadge({ trend }: TrendBadgeProps) {
  switch (trend) {
    case "converging":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
          <IconTrendingUp className="size-3 mr-1" />
          Converging
        </Badge>
      )
    case "diverging":
      return (
        <Badge variant="destructive">
          <IconTrendingDown className="size-3 mr-1" />
          Diverging
        </Badge>
      )
    default:
      return (
        <Badge variant="secondary">
          <IconMinus className="size-3 mr-1" />
          Stable
        </Badge>
      )
  }
}
