import { createFileRoute, Link } from "@tanstack/react-router"
import { z } from "zod"
import {
  IconArrowDown,
  IconArrowUp,
  IconChevronRight,
  IconMinus,
} from "@tabler/icons-react"
import { getAllDomainsWithStats } from "@/lib/server-functions/domains"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DomainIcon } from "@/components/domain-icon"
import { cn } from "@/lib/utils"
import { LoadingGlowCard } from "@/components/loading-glow-card"
import { CACHE_CONFIG } from "@/lib/cache-config"
import { ReportButton } from "@/components/report-button"

const searchSchema = z.object({
  country: z.string().length(3).optional().default("IND"),
})

export const Route = createFileRoute("/rankings/")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ country: search.country }),
  // Domain list is stable, cache for longer
  staleTime: CACHE_CONFIG.STABLE.staleTime,
  gcTime: CACHE_CONFIG.STABLE.gcTime,
  loader: async ({ deps }) => {
    const data = await getAllDomainsWithStats({
      data: { countryCode: deps.country },
    })
    return data
  },
  head: ({ loaderData }) => {
    const year = loaderData?.latestYear ?? new Date().getFullYear()
    const domainCount = loaderData?.domains.length ?? 0
    return {
      meta: [
        {
          title: `Global Rankings by Domain ${year} — Global Indicies`,
        },
        {
          name: "description",
          content: `Explore international rankings across ${domainCount} domains including Economy, Education, Healthcare, Innovation, and more. Compare performance and track trends for ${year}.`,
        },
        {
          property: "og:title",
          content: `Global Rankings by Domain ${year}`,
        },
        {
          property: "og:description",
          content: `Explore international rankings across ${domainCount} domains for ${year}.`,
        },
      ],
    }
  },
  component: RankingsPage,
  pendingComponent: RankingsLoading,
})

function RankingsLoading() {
  return (
    <div className="space-y-8 container mx-auto px-4 relative z-10 animate-fade-in">
       <div className="space-y-12">
        {/* Render 3 loading sections */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[400px]">
             <LoadingGlowCard />
          </div>
        ))}
       </div>
    </div>
  )
}

function RankingsPage() {
  const data = Route.useLoaderData()

  return (
    <div className="space-y-8 container mx-auto px-4 relative z-10">


      <div className="space-y-12">
        {data.domains.map((domain) => (
          <DomainSection 
            key={domain.id} 
            domain={domain} 
            year={data.latestYear ?? new Date().getFullYear()} 
          />
        ))}
      </div>
    </div>
  )
}

interface DomainData {
  id: string
  name: string
  description: string
  icon: string
  stats: {
    totalIndices: number
    rankedIndices: number
    avgPercentile: number
    avgRankChange: number
    bestIndex: {
      id: string
      name: string
      shortName: string
      rank: number
      totalCountries: number
      percentile: number
      rankChange: number
    } | null
    worstIndex: {
      id: string
      name: string
      shortName: string
      rank: number
      totalCountries: number
      percentile: number
      rankChange: number
    } | null
  }
  rankings: Array<{
    indexId: string
    indexName: string
    shortName: string
    source: string
    rank: number
    totalCountries: number
    percentile: number
    score: number | null
    normalizedScore: number | null
    rankChange: number
    previousRank: number | null
  }>
}

interface DomainSectionProps {
  domain: DomainData
  year: number
}

function DomainSection({ domain, year }: DomainSectionProps) {
  const { stats, rankings } = domain

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4 border-b border-white/10 bg-white/5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <DomainIcon icon={domain.icon} className="size-8" />
            <div>
              <CardTitle className="text-xl font-black uppercase tracking-tight">{domain.name}</CardTitle>
              <p className="text-muted-foreground font-mono text-xs">
                // {domain.description}
              </p>
            </div>
          </div>
          <Link
            to="/rankings/$domain"
            params={{ domain: domain.id }}
            className="flex items-center gap-1 text-xs font-bold uppercase text-primary hover:underline bg-primary/10 px-2 py-1"
          >
            Explore All
            <IconChevronRight className="size-3" />
          </Link>
        </div>

        {/* Domain Stats */}
        <div className="mt-6 flex flex-wrap gap-6">
          <StatBadge label="Indices" value={stats.rankedIndices.toString()} />
          <StatBadge
            label="Avg. Percentile"
            value={`${stats.avgPercentile.toFixed(0)}%`}
          />
          <StatBadge
            label="Trend"
            value={
              stats.avgRankChange > 0
                ? `+${stats.avgRankChange.toFixed(1)}`
                : stats.avgRankChange.toFixed(1)
            }
            variant={
              stats.avgRankChange > 0.5
                ? "success"
                : stats.avgRankChange < -0.5
                  ? "destructive"
                  : "default"
            }
          />
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {rankings.length > 0 ? (
          <div className="space-y-6">
            {/* Best and Worst Highlights */}
            {stats.bestIndex && stats.worstIndex && (
              <div className="grid gap-4 sm:grid-cols-2">
                <HighlightCard
                  type="best"
                  index={stats.bestIndex}
                  domainId={domain.id}
                />
                <HighlightCard
                  type="worst"
                  index={stats.worstIndex}
                  domainId={domain.id}
                />
              </div>
            )}

            {/* Rankings Table */}
            <div className="overflow-x-auto scrollbar-none">
              <table className="w-full text-sm">
                <thead className="bg-white/5">
                  <tr className="border-b border-white/10 text-left">
                    <th className="py-3 px-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Index</th>
                    <th className="py-3 px-4 text-right font-bold text-xs uppercase tracking-wider text-muted-foreground">Rank</th>
                    <th className="py-3 px-4 text-right font-bold text-xs uppercase tracking-wider text-muted-foreground">Percentile</th>
                    <th className="py-3 px-4 text-right font-bold text-xs uppercase tracking-wider text-muted-foreground">Change</th>
                    <th className="py-3 px-4 text-right font-bold text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {rankings.map((ranking) => (
                    <tr
                      key={ranking.indexId}
                      className="group hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4">
                        <Link
                          to="/rankings/$domain/$indexId"
                          params={{ domain: domain.id, indexId: ranking.indexId }}
                          className="font-bold text-sm block group-hover:text-primary transition-colors"
                        >
                          {ranking.indexName}
                        </Link>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest leading-none">
                          {ranking.source}
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
                        <RankChangeIndicator
                          change={ranking.rankChange}
                          previousRank={ranking.previousRank}
                        />
                      </td>
                      <td className="py-4 text-right">
                        <ReportButton 
                          indexId={ranking.indexId} 
                          year={year} 
                          indexName={ranking.indexName} 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm font-mono py-8 text-center border-2 border-dashed border-border/20">
            // No ranking data available for this domain
          </p>
        )}
      </CardContent>
    </Card>
  )
}

interface StatBadgeProps {
  label: string
  value: string
  variant?: "default" | "success" | "destructive"
}

function StatBadge({ label, value, variant = "default" }: StatBadgeProps) {
  const badgeVariant =
    variant === "success"
      ? "default"
      : variant === "destructive"
        ? "destructive"
        : "secondary"

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-xs">{label}:</span>
      <Badge
        variant={badgeVariant}
        className={cn(
          "text-xs",
          variant === "success" && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
        )}
      >
        {value}
      </Badge>
    </div>
  )
}

interface HighlightCardProps {
  type: "best" | "worst"
  index: {
    id: string
    name: string
    shortName: string
    rank: number
    totalCountries: number
    percentile: number
    rankChange: number
  }
  domainId: string
}

function HighlightCard({ type, index, domainId }: HighlightCardProps) {
  return (
    <Link
      to="/rankings/$domain/$indexId"
      params={{ domain: domainId, indexId: index.id }}
      className={cn(
        "block border p-3 transition-colors hover:bg-muted/50",
        type === "best" ? "border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20" : "border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20"
      )}
    >
      <p className="text-muted-foreground text-xs">
        {type === "best" ? "Best Performing" : "Needs Improvement"}
      </p>
      <p className="font-medium">{index.name}</p>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-sm">
          Rank {index.rank}/{index.totalCountries}
        </span>
        <span className="text-muted-foreground text-xs">
          ({index.percentile.toFixed(0)}th percentile)
        </span>
      </div>
    </Link>
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
