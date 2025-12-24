import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import {
  IconArrowDown,
  IconArrowUp,
  IconChartBar,
  IconMinus,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react"
import { getDashboardData } from "@/lib/server-functions/dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const searchSchema = z.object({
  country: z.string().length(3).optional().default("IND"),
})

export const Route = createFileRoute("/")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ country: search.country }),
  loader: async ({ deps }) => {
    const data = await getDashboardData({ data: { countryCode: deps.country } })
    return data
  },
  component: HomePage,
})

function HomePage() {
  const data = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Overview of global rankings for {data.latestYear}
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Indices"
          value={data.summary.totalIndices}
          icon={<IconChartBar className="size-4" />}
        />
        <StatCard
          title="Avg. Percentile"
          value={`${data.summary.avgPercentile.toFixed(1)}%`}
          description="Higher is better"
        />
        <StatCard
          title="Improving"
          value={data.summary.improvingCount}
          icon={<IconTrendingUp className="size-4 text-green-600" />}
          valueClassName="text-green-600"
        />
        <StatCard
          title="Declining"
          value={data.summary.decliningCount}
          icon={<IconTrendingDown className="size-4 text-red-600" />}
          valueClassName="text-red-600"
        />
      </div>

      {/* Top Improving and Declining */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <IconTrendingUp className="size-4 text-green-600" />
              Top Improving Indices
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.topImproving.length > 0 ? (
              <div className="space-y-3">
                {data.topImproving.map((item) => (
                  <RankingChangeItem
                    key={item.indexId}
                    indexName={item.indexName}
                    domainName={item.domainName}
                    rank={item.rank}
                    previousRank={item.previousRank}
                    rankChange={item.rankChange}
                    percentile={item.percentile}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No improving indices found
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <IconTrendingDown className="size-4 text-red-600" />
              Top Declining Indices
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.topDeclining.length > 0 ? (
              <div className="space-y-3">
                {data.topDeclining.map((item) => (
                  <RankingChangeItem
                    key={item.indexId}
                    indexName={item.indexName}
                    domainName={item.domainName}
                    rank={item.rank}
                    previousRank={item.previousRank}
                    rankChange={item.rankChange}
                    percentile={item.percentile}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No declining indices found
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Domain Summaries */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Performance by Domain</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.domainSummaries
            .filter((d) => d.totalIndices > 0)
            .map((summary) => (
              <DomainCard key={summary.domain.id} summary={summary} />
            ))}
        </div>
      </div>
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

function StatCard({
  title,
  value,
  description,
  icon,
  valueClassName,
}: StatCardProps) {
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

interface RankingChangeItemProps {
  indexName: string
  domainName: string
  rank: number
  previousRank: number | null
  rankChange: number
  percentile: number
}

function RankingChangeItem({
  indexName,
  domainName,
  rank,
  previousRank,
  rankChange,
  percentile,
}: RankingChangeItemProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{indexName}</p>
        <p className="text-muted-foreground text-xs">{domainName}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium">Rank {rank}</p>
          <p className="text-muted-foreground text-xs">
            {percentile.toFixed(0)}th percentile
          </p>
        </div>
        <RankChangeIndicator change={rankChange} previousRank={previousRank} />
      </div>
    </div>
  )
}

interface RankChangeIndicatorProps {
  change: number
  previousRank: number | null
}

function RankChangeIndicator({ change, previousRank }: RankChangeIndicatorProps) {
  if (previousRank === null) {
    return (
      <div className="flex items-center gap-1 text-muted-foreground">
        <IconMinus className="size-4" />
        <span className="text-xs">New</span>
      </div>
    )
  }

  if (change > 0) {
    return (
      <div className="flex items-center gap-1 text-green-600">
        <IconArrowUp className="size-4" />
        <span className="text-xs font-medium">+{change}</span>
      </div>
    )
  }

  if (change < 0) {
    return (
      <div className="flex items-center gap-1 text-red-600">
        <IconArrowDown className="size-4" />
        <span className="text-xs font-medium">{change}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1 text-muted-foreground">
      <IconMinus className="size-4" />
      <span className="text-xs">0</span>
    </div>
  )
}

interface DomainSummary {
  domain: {
    id: string
    name: string
    description: string
    icon: string
  }
  totalIndices: number
  avgPercentile: number
  avgRankChange: number
  bestIndex: {
    id: string
    name: string
    rank: number
    percentile: number
  } | null
  worstIndex: {
    id: string
    name: string
    rank: number
    percentile: number
  } | null
}

interface DomainCardProps {
  summary: DomainSummary
}

function DomainCard({ summary }: DomainCardProps) {
  const { domain, totalIndices, avgPercentile, avgRankChange, bestIndex } =
    summary

  return (
    <a
      href={`/rankings/${domain.id}`}
      className="block"
    >
      <Card className="transition-colors hover:bg-muted/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <span>{domain.icon}</span>
            <span>{domain.name}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">Indices</span>
              <span className="text-sm font-medium">{totalIndices}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">
                Avg. Percentile
              </span>
              <span className="text-sm font-medium">
                {avgPercentile.toFixed(0)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">Trend</span>
              <span
                className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  avgRankChange > 0.5
                    ? "text-green-600"
                    : avgRankChange < -0.5
                      ? "text-red-600"
                      : "text-muted-foreground"
                )}
              >
                {avgRankChange > 0.5 ? (
                  <IconArrowUp className="size-3" />
                ) : avgRankChange < -0.5 ? (
                  <IconArrowDown className="size-3" />
                ) : (
                  <IconMinus className="size-3" />
                )}
                {avgRankChange > 0 ? "+" : ""}
                {avgRankChange.toFixed(1)}
              </span>
            </div>
            {bestIndex && (
              <div className="border-t border-border pt-2">
                <p className="text-muted-foreground text-xs">Best performing</p>
                <p className="truncate text-xs font-medium">{bestIndex.name}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
