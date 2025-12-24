import { createFileRoute } from "@tanstack/react-router"
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
import { cn } from "@/lib/utils"

const searchSchema = z.object({
  country: z.string().length(3).optional().default("IND"),
})

export const Route = createFileRoute("/rankings/")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ country: search.country }),
  loader: async ({ deps }) => {
    const data = await getAllDomainsWithStats({
      data: { countryCode: deps.country },
    })
    return data
  },
  component: RankingsPage,
})

function RankingsPage() {
  const data = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Rankings by Domain</h1>
        <p className="text-muted-foreground text-sm">
          Explore rankings across {data.domains.length} domains for{" "}
          {data.latestYear}
        </p>
      </div>

      <div className="space-y-6">
        {data.domains.map((domain) => (
          <DomainSection key={domain.id} domain={domain} />
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
}

function DomainSection({ domain }: DomainSectionProps) {
  const { stats, rankings } = domain

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{domain.icon}</span>
            <div>
              <CardTitle className="text-lg">{domain.name}</CardTitle>
              <p className="text-muted-foreground text-sm">
                {domain.description}
              </p>
            </div>
          </div>
          <a
            href={`/rankings/${domain.id}`}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            View all
            <IconChevronRight className="size-3" />
          </a>
        </div>

        {/* Domain Stats */}
        <div className="mt-4 flex flex-wrap gap-4">
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

      <CardContent>
        {rankings.length > 0 ? (
          <div className="space-y-2">
            {/* Best and Worst Highlights */}
            {stats.bestIndex && stats.worstIndex && (
              <div className="mb-4 grid gap-3 sm:grid-cols-2">
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
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-2 font-medium">Index</th>
                    <th className="pb-2 text-right font-medium">Rank</th>
                    <th className="pb-2 text-right font-medium">Percentile</th>
                    <th className="pb-2 text-right font-medium">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((ranking) => (
                    <tr
                      key={ranking.indexId}
                      className="border-b border-border last:border-0"
                    >
                      <td className="py-2">
                        <a
                          href={`/rankings/${domain.id}/${ranking.indexId}`}
                          className="hover:text-primary hover:underline"
                        >
                          {ranking.indexName}
                        </a>
                        <p className="text-muted-foreground text-xs">
                          {ranking.source}
                        </p>
                      </td>
                      <td className="py-2 text-right">
                        <span className="font-medium">{ranking.rank}</span>
                        <span className="text-muted-foreground">
                          /{ranking.totalCountries}
                        </span>
                      </td>
                      <td className="py-2 text-right">
                        <PercentileBadge percentile={ranking.percentile} />
                      </td>
                      <td className="py-2 text-right">
                        <RankChangeIndicator
                          change={ranking.rankChange}
                          previousRank={ranking.previousRank}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            No ranking data available for this domain
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
    <a
      href={`/rankings/${domainId}/${index.id}`}
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
    </a>
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
