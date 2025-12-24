import { useEffect, useMemo, useRef, useState } from "react"
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
import { CACHE_CONFIG } from "@/lib/cache-config"

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
          countryName: loaderData.fullRankingList.find(e => e.isSelected)?.countryName ?? "Selected Country",
          rank: entry.rank,
          totalCountries: entry.totalCountries,
          year,
          score: entry.score,
          percentile: entry.percentile,
        })
      : null

    const breadcrumbJsonLd = generateBreadcrumbJsonLd([
      { name: "Home", url: "https://globalranks.vercel.app" },
      { name: "Rankings", url: "https://globalranks.vercel.app/rankings" },
      { name: domainName, url: `https://globalranks.vercel.app/rankings/${params.domain}` },
      {
        name: indexShortName || indexName,
        url: `https://globalranks.vercel.app/rankings/${params.domain}/${params.indexId}`,
      },
    ])

    const rankText = entry
      ? `Rank ${entry.rank}/${entry.totalCountries} (${entry.percentile.toFixed(0)}th percentile)`
      : "No data available"

    return {
      meta: [
        {
          title: `${indexName} ${year} — Global Indicies`,
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

function RankingRow({ 
  entry, 
  isPinned = false, 
  naturalRef,
  offsetTop
}: { 
  entry: any; 
  isPinned?: boolean; 
  naturalRef?: React.RefObject<HTMLTableRowElement | null>;
  offsetTop?: number;
}) {
  const stickyTop = offsetTop ? `calc(56px + ${offsetTop}px)` : "56px";

  return (
    <tr
      ref={naturalRef}
      className={cn(
        "group transition-colors",
        !isPinned && "hover:bg-muted/30",
        entry.isSelected && "bg-primary/5 ring-1 ring-inset ring-primary/20",
        isPinned && "z-40 bg-background/80 backdrop-blur-xl shadow-soft border-b border-white/10 cursor-default"
      )}
      style={isPinned ? { position: 'sticky', top: stickyTop } : undefined}
    >
      <td className="py-3">
        <span className={cn(
          "font-black text-sm px-1",
          entry.isSelected && "bg-primary text-white"
        )}>
          {entry.rank}
        </span>
      </td>
      <td className="py-3">
        <div className="flex items-center gap-2">
          <span className="font-bold">{entry.countryName}</span>
          {entry.isSelected && (
            <span className="text-[10px] font-black uppercase tracking-tighter text-primary animate-pulse">
              [SELECTED]{isPinned && " (PINNED)"}
            </span>
          )}
        </div>
      </td>
      <td className="py-3 text-[10px] text-muted-foreground uppercase tracking-widest">
        {entry.region}
      </td>
      <td className="py-3 text-right">
        <span className="font-bold">
          {entry.score !== null
            ? entry.score.toFixed(1)
            : entry.normalizedScore !== null
              ? entry.normalizedScore.toFixed(0)
              : "—"}
        </span>
      </td>
      <td className="py-3 text-right">
        <PercentileBadge percentile={entry.percentile} />
      </td>
    </tr>
  )
}

function IndexDetailPage() {
  const data = Route.useLoaderData()
  const params = Route.useParams()
  const { index, selectedCountry, fullRankingList, milestones } = data

  const [isPinned, setIsPinned] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(41)
  const naturalRowRef = useRef<HTMLTableRowElement>(null)
  const tableHeaderRef = useRef<HTMLTableRowElement>(null)

  const selectedEntry = useMemo(() => fullRankingList.find(e => e.isSelected), [fullRankingList])

  useEffect(() => {
    const handleScroll = () => {
      if (!naturalRowRef.current || !tableHeaderRef.current) return
      
      const headerRowHeight = tableHeaderRef.current.offsetHeight
      if (headerRowHeight > 0 && headerRowHeight !== headerHeight) {
        setHeaderHeight(headerRowHeight)
      }

      const naturalRect = naturalRowRef.current.getBoundingClientRect()
      const layoutHeaderHeight = 56 // Site navigation height
      const limit = layoutHeaderHeight + headerRowHeight
      
      // If natural row's top is further down than the limit, we pin it to the top
      setIsPinned(naturalRect.top > limit)
    }

    window.addEventListener("scroll", handleScroll)
    // Small delay to ensure table layout is stable
    const timer = setTimeout(handleScroll, 100)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timer)
    }
  }, [selectedEntry])

  return (
    <div className="space-y-8 container-wide relative z-10">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <a
            href={`/rankings/${params.domain}`}
            className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary"
          >
            <IconChevronLeft className="size-3" />
            {index.domain.name}_INDICES
          </a>
        </div>
        <a
          href={index.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs font-bold uppercase text-primary hover:underline bg-primary/10 px-3 py-2"
        >
          {index.source}
          <IconExternalLink className="size-4" />
        </a>
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
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-white/10 bg-white/5">
          <CardTitle className="text-xl font-bold uppercase tracking-tight">
            Global Leaderboard_{data.selectedYear}
          </CardTitle>
          <p className="text-muted-foreground text-xs">// Complete international standing for this index</p>
        </CardHeader>
        <CardContent className="pt-0 p-0">
          <div className="scrollbar-none">
            <table className="w-full text-sm relative border-separate border-spacing-0">
              <thead className="z-40">
                <tr ref={tableHeaderRef} className="sticky top-[56px] z-50 bg-background/80 backdrop-blur-xl border-b border-white/10 text-left">
                  <th className="pb-3 pt-3 pl-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">Rank</th>
                  <th className="pb-3 pt-3 font-bold uppercase tracking-wider text-xs text-muted-foreground">Country</th>
                  <th className="pb-3 pt-3 font-bold uppercase tracking-wider text-xs text-muted-foreground">Region</th>
                  <th className="pb-3 pt-3 text-right font-bold uppercase tracking-wider text-xs text-muted-foreground">Score</th>
                  <th className="pb-3 pt-3 pr-4 text-right font-bold uppercase tracking-wider text-xs text-muted-foreground">Percentile</th>
                </tr>
                {isPinned && selectedEntry && (
                  <RankingRow entry={selectedEntry} isPinned={true} offsetTop={headerHeight} />
                )}
              </thead>
              <tbody className="divide-y divide-white/5">
                {fullRankingList.map((entry) => (
                  <RankingRow 
                    key={entry.countryCode} 
                    entry={entry} 
                    naturalRef={entry.isSelected ? naturalRowRef : undefined} 
                  />
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

function PercentileBadge({ percentile }: { percentile: number }) {
  const variant =
    percentile >= 75
      ? "default"
      : percentile >= 50
        ? "secondary"
        : percentile >= 25
          ? "outline"
          : "destructive"

  return (
    <Badge variant={variant} className="text-[10px] font-black uppercase tracking-tighter rounded-none">
      {percentile.toFixed(0)}%
    </Badge>
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
        <span className="text-xs">{Math.abs(change)}</span>
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
