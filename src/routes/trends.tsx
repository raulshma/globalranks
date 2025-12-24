import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { z } from "zod"
import {
  IconAlertTriangle,
  IconFlag,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react"
import * as React from "react"

import { getAllDomainsWithStats } from "@/lib/server-functions/domains"
import { getTimeSeriesWithMetrics } from "@/lib/server-functions/time-series"
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
import { TrendChart } from "@/components/charts/trend-chart"
import { cn } from "@/lib/utils"
import { CACHE_CONFIG } from "@/router"

const searchSchema = z.object({
  country: z.string().length(3).optional().default("IND"),
  indices: z.string().optional(), // Comma-separated index IDs
  domain: z.string().optional(),
})

export const Route = createFileRoute("/trends")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({
    country: search.country,
    indices: search.indices,
    domain: search.domain,
  }),
  // Time series data is stable (historical data)
  staleTime: CACHE_CONFIG.STABLE.staleTime,
  gcTime: CACHE_CONFIG.STABLE.gcTime,
  loader: async ({ deps }) => {
    const { country, indices, domain } = deps

    // Get all domains with their indices
    const domainsData = await getAllDomainsWithStats({
      data: { countryCode: country },
    })

    // Parse selected indices from search params
    const selectedIndexIds = indices
      ? indices.split(",").filter((id) => id.length > 0)
      : []

    // Get time series data for selected indices
    const timeSeriesData = await Promise.all(
      selectedIndexIds.map((indexId) =>
        getTimeSeriesWithMetrics({
          data: {
            indexId,
            countryCode: country,
          },
        })
      )
    )

    return {
      countryCode: country,
      domains: domainsData.domains,
      latestYear: domainsData.latestYear,
      selectedIndexIds,
      selectedDomain: domain,
      timeSeriesData,
    }
  },
  head: ({ loaderData }) => {
    const selectedIndices = loaderData?.timeSeriesData ?? []
    const indexNames = selectedIndices
      .filter((ts) => ts.index)
      .map((ts) => ts.index?.name)
      .slice(0, 3)

    const description =
      indexNames.length > 0
        ? `Track historical trends for ${indexNames.join(", ")}${selectedIndices.length > 3 ? ` and ${selectedIndices.length - 3} more` : ""}. Analyze rank changes, anomalies, and milestones over time.`
        : "Analyze historical ranking trends over time. Track improvements, declines, and significant movements across global indices."

    return {
      meta: [
        {
          title: "Trends Analysis — India Ranks",
        },
        {
          name: "description",
          content: description,
        },
        {
          property: "og:title",
          content: "Trends Analysis — India Ranks",
        },
        {
          property: "og:description",
          content: description,
        },
      ],
    }
  },
  component: TrendsPage,
})


function TrendsPage() {
  const data = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = useNavigate()

  const [indexSearch, setIndexSearch] = React.useState("")

  // Get all available indices
  const allIndices = React.useMemo(() => {
    const indices: Array<{
      id: string
      name: string
      shortName: string
      domainId: string
      domainName: string
    }> = []

    for (const domain of data.domains) {
      for (const index of domain.indices) {
        indices.push({
          id: index.id,
          name: index.name,
          shortName: index.shortName,
          domainId: domain.id,
          domainName: domain.name,
        })
      }
    }

    return indices
  }, [data.domains])

  // Filter indices by domain and search
  const filteredIndices = React.useMemo(() => {
    let filtered = allIndices

    // Filter by domain if selected
    if (data.selectedDomain) {
      filtered = filtered.filter((i) => i.domainId === data.selectedDomain)
    }

    // Filter by search
    if (indexSearch) {
      const lower = indexSearch.toLowerCase()
      filtered = filtered.filter(
        (i) =>
          i.name.toLowerCase().includes(lower) ||
          i.shortName.toLowerCase().includes(lower)
      )
    }

    // Exclude already selected indices
    filtered = filtered.filter((i) => !data.selectedIndexIds.includes(i.id))

    return filtered.slice(0, 20)
  }, [allIndices, data.selectedDomain, indexSearch, data.selectedIndexIds])

  // Handle adding an index
  const handleAddIndex = (indexId: string | null) => {
    if (!indexId) return
    if (data.selectedIndexIds.includes(indexId)) return

    const newIds = [...data.selectedIndexIds, indexId]
    navigate({
      to: "/trends",
      search: {
        ...search,
        indices: newIds.join(","),
      },
    })
    setIndexSearch("")
  }

  // Handle removing an index
  const handleRemoveIndex = (indexId: string) => {
    const newIds = data.selectedIndexIds.filter((id: string) => id !== indexId)
    navigate({
      to: "/trends",
      search: {
        ...search,
        indices: newIds.length > 0 ? newIds.join(",") : undefined,
      },
    })
  }

  // Handle domain filter
  const handleDomainSelect = (domainId: string | null) => {
    navigate({
      to: "/trends",
      search: {
        ...search,
        domain: domainId || undefined,
      },
    })
  }

  // Get index name by ID
  const getIndexName = (indexId: string) => {
    return allIndices.find((i) => i.id === indexId)?.name ?? indexId
  }

  // Collect all anomalies across time series
  const allAnomalies = React.useMemo(() => {
    const anomalies: Array<{
      indexId: string
      indexName: string
      year: number
      rankChange: number
      direction: "improvement" | "decline"
    }> = []

    for (const ts of data.timeSeriesData) {
      if (!ts.index) continue
      for (const anomaly of ts.anomalies) {
        anomalies.push({
          indexId: ts.indexId,
          indexName: ts.index.name,
          year: anomaly.year,
          rankChange: anomaly.rankChange,
          direction: anomaly.direction,
        })
      }
    }

    return anomalies.sort((a, b) => b.year - a.year)
  }, [data.timeSeriesData])

  // Collect all milestones across time series
  const allMilestones = React.useMemo(() => {
    const milestones: Array<{
      indexId: string
      indexName: string
      year: number
      event: string
      impact: "positive" | "negative" | "neutral"
    }> = []

    for (const ts of data.timeSeriesData) {
      if (!ts.index) continue
      for (const milestone of ts.milestones) {
        milestones.push({
          indexId: ts.indexId,
          indexName: ts.index.name,
          year: milestone.year,
          event: milestone.event,
          impact: milestone.impact,
        })
      }
    }

    return milestones.sort((a, b) => b.year - a.year)
  }, [data.timeSeriesData])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Trends Analysis</h1>
        <p className="text-muted-foreground text-sm">
          Track ranking changes over time and identify significant movements
        </p>
      </div>

      {/* Selection Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Select Indices to Analyze</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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

          {/* Index Selector */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Add Indices
            </label>
            <Combobox
              value=""
              onValueChange={handleAddIndex}
              inputValue={indexSearch}
              onInputValueChange={setIndexSearch}
            >
              <ComboboxInput
                placeholder="Search indices to add..."
                className="max-w-md"
                showClear={false}
              />
              <ComboboxContent className="max-h-64">
                <ComboboxList>
                  {filteredIndices.map((index) => (
                    <ComboboxItem key={index.id} value={index.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{index.name}</span>
                        <span className="text-muted-foreground text-xs">
                          {index.domainName}
                        </span>
                      </div>
                    </ComboboxItem>
                  ))}
                </ComboboxList>
                <ComboboxEmpty>No indices found</ComboboxEmpty>
              </ComboboxContent>
            </Combobox>
          </div>

          {/* Selected Indices */}
          {data.selectedIndexIds.length > 0 && (
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Selected Indices ({data.selectedIndexIds.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {data.selectedIndexIds.map((indexId: string) => (
                  <Badge key={indexId} variant="secondary" className="gap-1">
                    {getIndexName(indexId)}
                    <button
                      onClick={() => handleRemoveIndex(indexId)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Time Series Charts */}
      {data.timeSeriesData.length > 0 ? (
        <div className="space-y-6">
          {data.timeSeriesData.map((ts) => (
            <TrendChart
              key={ts.indexId}
              data={{
                entries: ts.entries,
                metrics: ts.metrics,
                anomalies: ts.anomalies,
                milestones: ts.milestones,
              }}
              indexName={ts.index?.name}
              showMilestones={true}
              showMetrics={true}
              height={300}
            />
          ))}

          {/* Anomalies Summary */}
          {allAnomalies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconAlertTriangle className="size-4 text-amber-500" />
                  Significant Rank Movements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allAnomalies.slice(0, 10).map((anomaly, idx) => (
                    <div
                      key={`${anomaly.indexId}-${anomaly.year}-${idx}`}
                      className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium text-sm">{anomaly.indexName}</p>
                        <p className="text-muted-foreground text-xs">
                          {anomaly.year}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-1",
                          anomaly.direction === "improvement"
                            ? "text-green-600"
                            : "text-red-600"
                        )}
                      >
                        {anomaly.direction === "improvement" ? (
                          <IconTrendingUp className="size-4" />
                        ) : (
                          <IconTrendingDown className="size-4" />
                        )}
                        <span className="font-medium">
                          {anomaly.rankChange > 0 ? "+" : ""}
                          {anomaly.rankChange} positions
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Milestones Timeline */}
          {allMilestones.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <IconFlag className="size-4" />
                  Milestone Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allMilestones.slice(0, 10).map((milestone, idx) => (
                    <div
                      key={`${milestone.indexId}-${milestone.year}-${idx}`}
                      className="flex items-start gap-3"
                    >
                      <Badge
                        variant={
                          milestone.impact === "positive"
                            ? "default"
                            : milestone.impact === "negative"
                              ? "destructive"
                              : "secondary"
                        }
                        className="shrink-0"
                      >
                        {milestone.year}
                      </Badge>
                      <div>
                        <p className="font-medium text-sm">{milestone.indexName}</p>
                        <p className="text-muted-foreground text-sm">
                          {milestone.event}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Select indices above to view their historical trends
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
