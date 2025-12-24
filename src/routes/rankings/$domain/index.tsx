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

const searchSchema = z.object({
  country: z.string().length(3).optional().default("IND"),
})

export const Route = createFileRoute("/rankings/$domain/")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ country: search.country }),
  loader: async ({ params, deps }) => {
    const data = await getDomainWithIndices({
      data: { domainId: params.domain, countryCode: deps.country },
    })
    return data
  },
  component: DomainDetailPage,
})

function DomainDetailPage() {
  const data = Route.useLoaderData()
  const { domain, stats, rankings } = data

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <a
              href="/rankings"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <IconChevronLeft className="size-4" />
              <span className="text-sm">All Domains</span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{domain.icon}</span>
            <div>
              <h1 className="text-2xl font-bold">{domain.name}</h1>
              <p className="text-muted-foreground text-sm">
                {domain.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Indices"
          value={stats.totalIndices.toString()}
          description={`${stats.rankedIndices} with rankings`}
        />
        <StatCard
          title="Avg. Percentile"
          value={`${stats.avgPercentile.toFixed(0)}%`}
          description="Higher is better"
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
              ? "Improving"
              : stats.avgRankChange < -0.5
                ? "Declining"
                : "Stable"
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
          title="Data Year"
          value={data.latestYear.toString()}
          description={`vs ${data.previousYear}`}
        />
      </div>

      {/* Rankings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            All Indices in {domain.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rankings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 font-medium">Index</th>
                    <th className="pb-3 text-right font-medium">Rank</th>
                    <th className="pb-3 text-right font-medium">Percentile</th>
                    <th className="pb-3 text-right font-medium">Score</th>
                    <th className="pb-3 text-right font-medium">Change</th>
                    <th className="pb-3 text-right font-medium">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((ranking) => (
                    <tr
                      key={ranking.indexId}
                      className="border-b border-border last:border-0 hover:bg-muted/50"
                    >
                      <td className="py-3">
                        <a
                          href={`/rankings/${domain.id}/${ranking.indexId}`}
                          className="font-medium hover:text-primary hover:underline"
                        >
                          {ranking.indexName}
                        </a>
                        <p className="text-muted-foreground text-xs">
                          {ranking.shortName}
                        </p>
                      </td>
                      <td className="py-3 text-right">
                        <span className="font-medium">{ranking.rank}</span>
                        <span className="text-muted-foreground">
                          /{ranking.totalCountries}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <PercentileBadge percentile={ranking.percentile} />
                      </td>
                      <td className="py-3 text-right">
                        {ranking.score !== null ? (
                          <span>{ranking.score.toFixed(1)}</span>
                        ) : ranking.normalizedScore !== null ? (
                          <span className="text-muted-foreground">
                            {ranking.normalizedScore.toFixed(0)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <RankChangeIndicator
                          change={ranking.rankChange}
                          previousRank={ranking.previousRank}
                        />
                      </td>
                      <td className="py-3 text-right">
                        <a
                          href={ranking.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                        >
                          {ranking.source}
                          <IconExternalLink className="size-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              No ranking data available for this domain
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
