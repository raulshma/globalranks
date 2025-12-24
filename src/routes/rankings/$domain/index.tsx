import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import {
  IconArrowDown,
  IconArrowUp,
  IconChevronLeft,
  IconExternalLink,
  IconMinus,
} from "@tabler/icons-react"
import { getDomainWithIndices } from "@/lib/server-functions/domains"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { generateBreadcrumbJsonLd, generateDomainJsonLd } from "@/lib/seo"
import { CACHE_CONFIG } from "@/lib/cache-config"

const searchSchema = z.object({
  country: z.string().length(3).optional().default("IND"),
})

export const Route = createFileRoute("/rankings/$domain/")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ country: search.country }),
  // Domain detail is semi-stable
  staleTime: CACHE_CONFIG.SEMI_STABLE.staleTime,
  gcTime: CACHE_CONFIG.SEMI_STABLE.gcTime,
  loader: async ({ params, deps }) => {
    const data = await getDomainWithIndices({
      data: { domainId: params.domain, countryCode: deps.country },
    })
    return data
  },
  head: ({ loaderData, params }) => {
    const domainName = loaderData?.domain.name ?? params.domain
    const domainDescription = loaderData?.domain.description ?? ""
    const year = loaderData?.latestYear ?? new Date().getFullYear()
    const indicesCount = loaderData?.stats.totalIndices ?? 0

    const jsonLd = loaderData?.domain
      ? generateDomainJsonLd({
          domainName,
          domainDescription,
          indicesCount,
          countryName: "Selected Country",
        })
      : null

    const breadcrumbJsonLd = generateBreadcrumbJsonLd([
      { name: "Home", url: "https://globalranks.vercel.app" },
      { name: "Rankings", url: "https://globalranks.vercel.app/rankings" },
      { name: domainName, url: `https://globalranks.vercel.app/rankings/${params.domain}` },
    ])

    return {
      meta: [
        {
          title: `${domainName} Rankings ${year} — Global Indicies`,
        },
        {
          name: "description",
          content: `Performance in ${domainName} rankings for ${year}. Explore ${indicesCount} indices including ${domainDescription.toLowerCase()}.`,
        },
        {
          property: "og:title",
          content: `${domainName} Rankings ${year}`,
        },
        {
          property: "og:description",
          content: `Performance in ${domainName} rankings for ${year}.`,
        },
      ],
      scripts: [
        ...(jsonLd
          ? [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }]
          : []),
        { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd) },
      ],
    }
  },
  component: DomainDetailPage,
})

function DomainDetailPage() {
  const data = Route.useLoaderData()
  const { domain, stats, rankings } = data

  return (
    <div className="space-y-8 container-wide relative z-10">
      <div className="mb-8">
        <a
          href="/rankings"
          className="flex items-center gap-1 text-xs font-bold uppercase text-muted-foreground hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary w-fit"
        >
          <IconChevronLeft className="size-4" />
          All Domain Indices
        </a>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Indices"
          value={stats.totalIndices.toString()}
          description={`${stats.rankedIndices} with rankings`}
        />
        <StatCard
          title="Avg. Percentile"
          value={`${stats.avgPercentile.toFixed(0)}%`}
          description="Global standing score"
        />
        <StatCard
          title="Year-over-Year"
          value={
            stats.avgRankChange > 0
              ? `+${stats.avgRankChange.toFixed(1)}`
              : stats.avgRankChange.toFixed(1)
          }
          description={
            stats.avgRankChange > 0.5
              ? "Momentum: Improving"
              : stats.avgRankChange < -0.5
                ? "Momentum: Declining"
                : "Momentum: Stable"
          }
          valueClassName={
            stats.avgRankChange > 0.5
              ? "text-green-600"
              : stats.avgRankChange < -0.5
                ? "text-red-600"
                : ""
          }
        />
        <StatCard
          title="Latest Census"
          value={data.latestYear.toString()}
          description={`Baseline: ${data.previousYear}`}
        />
      </div>

      {/* Rankings Table */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-white/10 bg-white/5">
          <CardTitle className="text-xl font-bold uppercase tracking-tight">
            Comprehensive Index List_
          </CardTitle>
          <p className="text-muted-foreground text-xs">// Performance breakdowns for {domain.name}</p>
        </CardHeader>
        <CardContent className="pt-6">
          {rankings.length > 0 ? (
            <div className="overflow-x-auto scrollbar-none">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left bg-white/5">
                    <th className="pb-3 pt-3 pl-4 font-bold uppercase tracking-wider text-xs text-muted-foreground">Index</th>
                    <th className="pb-3 pt-3 text-right font-bold uppercase tracking-wider text-xs text-muted-foreground">Rank</th>
                    <th className="pb-3 pt-3 text-right font-bold uppercase tracking-wider text-xs text-muted-foreground">Percentile</th>
                    <th className="pb-3 pt-3 text-right font-bold uppercase tracking-wider text-xs text-muted-foreground">Score</th>
                    <th className="pb-3 pt-3 text-right font-bold uppercase tracking-wider text-xs text-muted-foreground">Change</th>
                    <th className="pb-3 pt-3 pr-4 text-right font-bold uppercase tracking-wider text-xs text-muted-foreground">Source_URL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {rankings.map((ranking) => (
                    <tr
                      key={ranking.indexId}
                      className="group hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4">
                        <a
                          href={`/rankings/${domain.id}/${ranking.indexId}`}
                          className="font-bold text-sm block group-hover:text-primary transition-colors"
                        >
                          {ranking.indexName}
                        </a>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest leading-none">
                          {ranking.shortName}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <span className="font-black text-sm">{ranking.rank}</span>
                        <span className="text-muted-foreground text-[10px] ml-0.5">
                          /{ranking.totalCountries}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <PercentileBadge percentile={ranking.percentile} />
                      </td>
                      <td className="py-4 text-right">
                        {ranking.score !== null ? (
                          <span className="font-bold">{ranking.score.toFixed(1)}</span>
                        ) : ranking.normalizedScore !== null ? (
                          <span className="text-muted-foreground text-xs">
                            [{ranking.normalizedScore.toFixed(0)}]
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-4 text-right">
                        <RankChangeIndicator
                          change={ranking.rankChange}
                          previousRank={ranking.previousRank}
                        />
                      </td>
                      <td className="py-4 text-right">
                        <a
                          href={ranking.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-muted-foreground hover:text-primary bg-muted/50 px-1.5 py-0.5"
                        >
                          SRC
                          <IconExternalLink className="size-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm font-mono py-12 text-center border-2 border-dashed border-border/20">
              // NO_DATA_AVAILABLE_FOR_THIS_DOMAIN
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  description?: string
  valueClassName?: string
}

function StatCard({
  title,
  value,
  description,
  valueClassName,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-muted-foreground text-xs font-medium">
          {title}
        </CardTitle>
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

interface PercentileBadgeProps {
  percentile: number
}

function PercentileBadge({ percentile }: PercentileBadgeProps) {
  const variant =
    percentile >= 75
      ? "default"
      : percentile >= 50
        ? "secondary"
        : percentile >= 25
          ? "outline"
          : "destructive"

  return (
    <Badge variant={variant} className="text-xs">
      {percentile.toFixed(0)}%
    </Badge>
  )
}

interface RankChangeIndicatorProps {
  change: number
  previousRank: number | null
}

function RankChangeIndicator({
  change,
  previousRank,
}: RankChangeIndicatorProps) {
  if (previousRank === null) {
    return <span className="text-muted-foreground text-xs">New</span>
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
