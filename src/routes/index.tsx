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
import { BentoGrid, BentoItem } from "@/components/ui/bento-grid"
import { Retro3D } from "@/components/ui/retro-3d"
import { cn } from "@/lib/utils"
import { CACHE_CONFIG } from "@/lib/cache-config"

const searchSchema = z.object({
  country: z.string().length(3).optional().default("IND"),
})

export const Route = createFileRoute("/")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ country: search.country }),
  // Dashboard data is semi-dynamic, refresh every 5 minutes
  staleTime: CACHE_CONFIG.DYNAMIC.staleTime,
  gcTime: CACHE_CONFIG.DYNAMIC.gcTime,
  loader: async ({ deps }) => {
    const data = await getDashboardData({ data: { countryCode: deps.country } })
    return data
  },
  head: () => {
    return {
      meta: [
        {
          title: `Global Rankings Dashboard — Global Indicies`,
        },
        {
          name: "description",
          content: `Comprehensive dashboard showing performance across global ranking indices. Track improvements, declines, and domain performance using the latest available data.`,
        },
        {
          property: "og:title",
          content: `Global Rankings Dashboard`,
        },
        {
          property: "og:description",
          content: `Comprehensive dashboard showing performance across global ranking indices using the latest available data.`,
        },
      ],
    }
  },
  component: HomePage,
})

function HomePage() {
  const data = Route.useLoaderData()

  return (
    <div className="space-y-8 container mx-auto px-4 relative z-10">


      {/* Summary Stats - Bento Row 1 */}
      <BentoGrid className="md:auto-rows-[12rem]">
        <BentoItem
          title="Total Indices"
          description="Tracked globally"
          header={<div className="font-black text-4xl">{data.summary.totalIndices}</div>}
          className="md:col-span-1 bg-card text-card-foreground"
          icon={<IconChartBar className="size-6 mb-2 text-primary" />}
        />
        <BentoItem
          title="Avg. Percentile"
          description="Global standing (Higher is better)"
          header={<div className="font-black text-4xl">{data.summary.avgPercentile.toFixed(1)}%</div>}
          className="md:col-span-1"
        />
        <BentoItem
          title="Momentum"
          description="Indices Improving vs Declining"
          className="md:col-span-1 flex flex-row items-center justify-between"
          header={
            <div className="flex gap-4 w-full">
              <div className="flex flex-col">
                <span className="text-green-600 font-black text-3xl flex items-center gap-1">
                  <IconTrendingUp className="size-6" /> {data.summary.improvingCount}
                </span>
                <span className="text-xs text-muted-foreground uppercase">Improving</span>
              </div>
              <div className="h-full w-px bg-border mx-2" />
              <div className="flex flex-col">
                <span className="text-red-500 font-black text-3xl flex items-center gap-1">
                  <IconTrendingDown className="size-6" /> {data.summary.decliningCount}
                </span>
                <span className="text-xs text-muted-foreground uppercase">Declining</span>
              </div>
            </div>
          }
        />
      </BentoGrid>

      {/* Top Movers - Bento Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Retro3D>
            <Card className="h-full overflow-hidden">
            <CardHeader className="pb-3 border-b border-white/10 bg-white/5">
                <CardTitle className="flex items-center gap-2 text-lg font-bold uppercase tracking-wide">
                <IconTrendingUp className="size-5 text-green-600" />
                Top Improvers
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
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
                <p className="text-muted-foreground text-sm font-mono">
                    // No improving indices found
                </p>
                )}
            </CardContent>
            </Card>
        </Retro3D>

        <Retro3D>
            <Card className="h-full overflow-hidden">
            <CardHeader className="pb-3 border-b border-white/10 bg-white/5">
                <CardTitle className="flex items-center gap-2 text-lg font-bold uppercase tracking-wide">
                <IconTrendingDown className="size-5 text-red-600" />
                Top Decliners
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
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
                <p className="text-muted-foreground text-sm font-mono">
                    // No declining indices found
                </p>
                )}
            </CardContent>
            </Card>
        </Retro3D>
      </div>

      {/* Domain Summaries - Bento Grid */}
      <div>
        <h2 className="mb-4 text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
             <span className="w-4 h-4 bg-primary inline-block" /> Domain Performance
        </h2>
        <BentoGrid className="md:grid-cols-4 md:auto-rows-[16rem]">
          {data.domainSummaries
            .filter((d) => d.totalIndices > 0)
            .map((summary, i) => (
              <BentoItem
                key={summary.domain.id}
                title={summary.domain.name}
                description={`${summary.totalIndices} Indices`}
                className={i === 0 || i === 3 ? "md:col-span-2 bg-muted/10" : "md:col-span-1"}
                icon={<span className="text-2xl mb-2 block">{summary.domain.icon}</span>}
              >
                <div className="mt-auto pt-4 border-t border-white/10 w-full">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xs text-muted-foreground font-bold uppercase">
                        Avg Percentile
                      </div>
                      <div className="text-2xl font-black">
                        {summary.avgPercentile.toFixed(0)}%
                      </div>
                    </div>
                    <div
                      className={cn(
                        "text-xl font-bold flex items-center gap-1",
                        summary.avgRankChange > 0 ? "text-green-600" : "text-red-500"
                      )}
                    >
                      {summary.avgRankChange > 0 ? "↑" : "↓"}{" "}
                      {Math.abs(summary.avgRankChange).toFixed(1)}
                    </div>
                  </div>
                </div>
                <a
                  href={`/rankings/${summary.domain.id}`}
                  className="absolute inset-0 z-10"
                  aria-label={`View ${summary.domain.name} rankings`}
                />
              </BentoItem>
            ))}
        </BentoGrid>
      </div>
    </div>
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
    <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0">
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
        <span className="text-xs font-medium">{Math.abs(change)}</span>
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
