import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import {
  IconArrowDown,
  IconArrowUp,
  IconChevronLeft,
  IconExternalLink,
  IconMinus,
} from "@tabler/icons-react"
import { getIndexDetail } from "@/lib/server-functions/index-detail"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { generateBreadcrumbJsonLd, generateRankingIndexJsonLd } from "@/lib/seo"
import { CACHE_CONFIG } from "@/router"

const searchSchema = z.object({
  country: z.string().length(3).optional().default("IND"),
  year: z.coerce.number().optional(),
})

export const Route = createFileRoute("/rankings/$domain/$indexId")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ country: search.country, year: search.year }),
  // Index detail pages are stable (historical data doesn't change)
  staleTime: CACHE_CONFIG.STABLE.staleTime,
  gcTime: CACHE_CONFIG.STABLE.gcTime,
  loader: async ({ params, deps }) => {
    const data = await getIndexDetail({
      data: {
        indexId: params.indexId,
        countryCode: deps.country,
        year: deps.year,
      },
    })
    return data
  },
  head: ({ loaderData, params }) => {
    const indexName = loaderData?.index.name ?? params.indexId
    const indexShortName = loaderData?.index.shortName ?? ""
    const source = loaderData?.index.source ?? ""
    const sourceUrl = loaderData?.index.sourceUrl ?? ""
    const methodology = loaderData?.index.methodology ?? ""
    const year = loaderData?.selectedYear ?? new Date().getFullYear()
    const domainName = loaderData?.index.domain.name ?? params.domain
    const entry = loaderData?.selectedCountry.entry

    // Generate JSON-LD for the ranking
    const rankingJsonLd = entry
      ? generateRankingIndexJsonLd({
          indexName,
          indexDescription: methodology,
          source,
          sourceUrl,
          countryName: "India",
          rank: entry.rank,
          totalCountries: entry.totalCountries,
          year,
          score: entry.score,
          percentile: entry.percentile,
        })
      : null

    const breadcrumbJsonLd = generateBreadcrumbJsonLd([
      { name: "Home", url: "https://indiaranks.com" },
      { name: "Rankings", url: "https://indiaranks.com/rankings" },
      { name: domainName, url: `https://indiaranks.com/rankings/${params.domain}` },
      {
        name: indexShortName || indexName,
        url: `https://indiaranks.com/rankings/${params.domain}/${params.indexId}`,
      },
    ])

    const rankText = entry
      ? `Rank ${entry.rank}/${entry.totalCountries} (${entry.percentile.toFixed(0)}th percentile)`
      : "No data available"

    return {
      meta: [
        {
          title: `${indexName} ${year} — India Ranks`,
        },
        {
          name: "description",
          content: `${indexName} ranking for ${year}: ${rankText}. Source: ${source}. ${methodology.slice(0, 100)}...`,
        },
        {
          property: "og:title",
          content: `${indexName} ${year}`,
        },
        {
          property: "og:description",
          content: `${indexName} ranking: ${rankText}`,
        },
      ],
      scripts: [
        ...(rankingJsonLd
          ? [{ type: "application/ld+json", children: JSON.stringify(rankingJsonLd) }]
          : []),
        { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd) },
      ],
    }
  },
  component: IndexDetailPage,
})

function IndexDetailPage() {
  const data = Route.useLoaderData()
  const params = Route.useParams()
  const { index, selectedCountry, fullRankingList, milestones } = data

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <a
            href={`/rankings/${params.domain}`}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <IconChevronLeft className="size-4" />
            <span className="text-sm">{index.domain.name}</span>
          </a>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{index.name}</h1>
            <p className="text-muted-foreground text-sm">{index.shortName}</p>
          </div>
          <a
            href={index.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            {index.source}
            <IconExternalLink className="size-4" />
          </a>
        </div>
      </div>

      {/* Year Selector and Selected Country Stats */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Current Position</CardTitle>
            <YearSelector
              years={data.availableYears}
              selectedYear={data.selectedYear}
              domainId={params.domain}
              indexId={params.indexId}
            />
          </CardHeader>
          <CardContent>
            {selectedCountry.entry ? (
              <div className="grid gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-muted-foreground text-xs">Rank</p>
                  <p className="text-3xl font-bold">
                    {selectedCountry.entry.rank}
                    <span className="text-muted-foreground text-lg font-normal">
                      /{selectedCountry.entry.totalCountries}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Percentile</p>
                  <p className="text-3xl font-bold">
                    {selectedCountry.entry.percentile.toFixed(0)}
                    <span className="text-muted-foreground text-lg font-normal">
                      %
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Score</p>
                  <p className="text-3xl font-bold">
                    {selectedCountry.entry.score !== null
                      ? selectedCountry.entry.score.toFixed(1)
                      : selectedCountry.entry.normalizedScore !== null
                        ? selectedCountry.entry.normalizedScore.toFixed(0)
                        : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Confidence</p>
                  <Badge
                    variant={
                      selectedCountry.entry.confidence === "high"
                        ? "default"
                        : selectedCountry.entry.confidence === "medium"
                          ? "secondary"
                          : "outline"
                    }
                    className="mt-1"
                  >
                    {selectedCountry.entry.confidence}
                  </Badge>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                No data available for the selected country in {data.selectedYear}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Methodology</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">{index.methodology}</p>
            <div className="space-y-1">
              <p>
                <span className="text-muted-foreground">Score Range:</span>{" "}
                {index.scoreMin} - {index.scoreMax}
              </p>
              <p>
                <span className="text-muted-foreground">Higher is:</span>{" "}
                {index.higherIsBetter ? "Better" : "Worse"}
              </p>
              <p>
                <span className="text-muted-foreground">Update Frequency:</span>{" "}
                {index.updateFrequency}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sub-metrics if available */}
      {selectedCountry.subMetrics && selectedCountry.subMetrics.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Sub-Metrics Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {selectedCountry.subMetrics.map((metric) => (
                <div
                  key={metric.name}
                  className="flex items-center justify-between border-b border-border pb-2 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{metric.name}</p>
                    <p className="text-muted-foreground text-xs">
                      Weight: {metric.weight}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{metric.value.toFixed(1)}</p>
                    {metric.rank && (
                      <p className="text-muted-foreground text-xs">
                        Rank {metric.rank}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historical Performance */}
      {selectedCountry.history.length > 1 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Historical Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-2 font-medium">Year</th>
                    <th className="pb-2 text-right font-medium">Rank</th>
                    <th className="pb-2 text-right font-medium">Percentile</th>
                    <th className="pb-2 text-right font-medium">Score</th>
                    <th className="pb-2 text-right font-medium">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCountry.history.map((entry, idx) => {
                    const prevEntry = selectedCountry.history[idx + 1]
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    const rankChange = prevEntry
                      ? prevEntry.rank - entry.rank
                      : 0

                    return (
                      <tr
                        key={entry.year}
                        className={cn(
                          "border-b border-border last:border-0",
                          entry.year === data.selectedYear && "bg-muted/50"
                        )}
                      >
                        <td className="py-2 font-medium">{entry.year}</td>
                        <td className="py-2 text-right">
                          {entry.rank}/{entry.totalCountries}
                        </td>
                        <td className="py-2 text-right">
                          {entry.percentile.toFixed(0)}%
                        </td>
                        <td className="py-2 text-right">
                          {entry.score !== null
                            ? entry.score.toFixed(1)
                            : entry.normalizedScore !== null
                              ? entry.normalizedScore.toFixed(0)
                              : "—"}
                        </td>
                        <td className="py-2 text-right">
                          <RankChangeIndicator
                            change={rankChange}
                            hasPrevious={!!prevEntry}
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Ranking List */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Full Ranking List ({data.selectedYear})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b border-border text-left">
                  <th className="pb-2 font-medium">Rank</th>
                  <th className="pb-2 font-medium">Country</th>
                  <th className="pb-2 font-medium">Region</th>
                  <th className="pb-2 text-right font-medium">Score</th>
                  <th className="pb-2 text-right font-medium">Percentile</th>
                </tr>
              </thead>
              <tbody>
                {fullRankingList.map((entry) => (
                  <tr
                    key={entry.countryCode}
                    className={cn(
                      "border-b border-border last:border-0",
                      entry.isSelected && "bg-primary/10 font-medium"
                    )}
                  >
                    <td className="py-2">{entry.rank}</td>
                    <td className="py-2">
                      {entry.countryName}
                      {entry.isSelected && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Selected
                        </Badge>
                      )}
                    </td>
                    <td className="py-2 text-muted-foreground">
                      {entry.region}
                    </td>
                    <td className="py-2 text-right">
                      {entry.score !== null
                        ? entry.score.toFixed(1)
                        : entry.normalizedScore !== null
                          ? entry.normalizedScore.toFixed(0)
                          : "—"}
                    </td>
                    <td className="py-2 text-right">
                      {entry.percentile.toFixed(0)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      {milestones.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Key Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {milestones.map((milestone, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <Badge
                    variant={
                      milestone.impact === "positive"
                        ? "default"
                        : milestone.impact === "negative"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {milestone.year}
                  </Badge>
                  <div>
                    <p className="text-sm">{milestone.event}</p>
                    {milestone.source && (
                      <p className="text-muted-foreground text-xs">
                        Source: {milestone.source}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

interface YearSelectorProps {
  years: Array<number>
  selectedYear: number
  domainId: string
  indexId: string
}

function YearSelector({
  years,
  selectedYear,
  domainId,
  indexId,
}: YearSelectorProps) {
  const handleYearChange = (year: string | null) => {
    if (year) {
      window.location.href = `/rankings/${domainId}/${indexId}?year=${year}`
    }
  }

  return (
    <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
      <SelectTrigger className="w-24">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

interface RankChangeIndicatorProps {
  change: number
  hasPrevious: boolean
}

function RankChangeIndicator({
  change,
  hasPrevious,
}: RankChangeIndicatorProps) {
  if (!hasPrevious) {
    return <span className="text-muted-foreground text-xs">—</span>
  }

  if (change > 0) {
    return (
      <span className="flex items-center justify-end gap-0.5 text-green-600">
        <IconArrowUp className="size-3" />
        <span className="text-xs">+{change}</span>
      </span>
    )
  }

  if (change < 0) {
    return (
      <span className="flex items-center justify-end gap-0.5 text-red-600">
        <IconArrowDown className="size-3" />
        <span className="text-xs">{change}</span>
      </span>
    )
  }

  return (
    <span className="flex items-center justify-end gap-0.5 text-muted-foreground">
      <IconMinus className="size-3" />
      <span className="text-xs">0</span>
    </span>
  )
}
