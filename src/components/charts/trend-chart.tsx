/**
 * TrendChart Component - Line chart showing rank over time
 * Requirements: 4.1, 4.3
 * - Line chart showing rank over time using Recharts
 * - Milestone markers on significant events
 * - Velocity and volatility indicators
 */

import {
  IconFlag,
  IconMinus,
  IconTrendingDown,
  IconTrendingUp,
} from '@tabler/icons-react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { Anomaly, TimeSeriesMetrics } from '@/lib/server-functions/time-series'
import type { Milestone, TimeSeriesEntry, TrendIndicator } from '@/lib/types'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HelpTooltip } from '@/components/ui/tooltip'

export interface TrendChartProps {
  data: {
    entries: Array<TimeSeriesEntry>
    metrics: TimeSeriesMetrics
    anomalies: Array<Anomaly>
    milestones: Array<Milestone>
  }
  indexName?: string
  countryName?: string
  showMilestones?: boolean
  showMetrics?: boolean
  height?: number
}

interface ChartDataPoint {
  year: number
  rank: number
  percentile: number
  score: number | null
  hasMilestone: boolean
  milestoneEvent?: string
  milestoneImpact?: 'positive' | 'negative' | 'neutral'
  isAnomaly: boolean
  anomalyDirection?: 'improvement' | 'decline'
}

function getTrendIcon(trend: TrendIndicator) {
  switch (trend) {
    case 'improving':
      return <IconTrendingUp className="h-4 w-4 text-green-600" />
    case 'declining':
      return <IconTrendingDown className="h-4 w-4 text-red-600" />
    default:
      return <IconMinus className="h-4 w-4 text-muted-foreground" />
  }
}

function getTrendColor(trend: TrendIndicator) {
  switch (trend) {
    case 'improving':
      return 'text-green-600'
    case 'declining':
      return 'text-red-600'
    default:
      return 'text-muted-foreground'
  }
}

function formatVelocity(velocity: number): string {
  if (Math.abs(velocity) < 0.1) return 'Stable'
  const direction = velocity < 0 ? 'improving' : 'declining'
  return `${Math.abs(velocity).toFixed(1)} positions/year (${direction})`
}

function formatVolatility(volatility: number): string {
  if (volatility < 2) return 'Low'
  if (volatility < 5) return 'Moderate'
  return 'High'
}


interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    payload: ChartDataPoint
  }>
  label?: string
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  const data = payload[0].payload

  return (
    <div className="bg-popover border border-border p-3 shadow-md">
      <p className="font-medium text-sm">{data.year}</p>
      <div className="mt-1 space-y-1 text-xs">
        <p>Rank: <span className="font-medium">{data.rank}</span></p>
        <p>Percentile: <span className="font-medium">{data.percentile.toFixed(1)}%</span></p>
        {data.score !== null && (
          <p>Score: <span className="font-medium">{data.score.toFixed(2)}</span></p>
        )}
        {data.hasMilestone && data.milestoneEvent && (
          <div className="mt-2 pt-2 border-t border-border">
            <div className="flex items-center gap-1">
              <IconFlag className="h-3 w-3" />
              <span className="font-medium">Milestone</span>
            </div>
            <p className="mt-1 text-muted-foreground">{data.milestoneEvent}</p>
          </div>
        )}
        {data.isAnomaly && (
          <div className="mt-2 pt-2 border-t border-border">
            <Badge variant={data.anomalyDirection === 'improvement' ? 'default' : 'destructive'}>
              Significant {data.anomalyDirection}
            </Badge>
          </div>
        )}
      </div>
    </div>
  )
}

export function TrendChart({
  data,
  indexName,
  countryName,
  showMilestones = true,
  showMetrics = true,
  height = 300,
}: TrendChartProps) {
  const { entries, metrics, anomalies, milestones } = data

  // Create a map of milestones by year
  const milestonesByYear = new Map<number, Milestone>()
  milestones.forEach((m) => {
    milestonesByYear.set(m.year, m)
  })

  // Create a set of anomaly years
  const anomalyByYear = new Map<number, Anomaly>()
  anomalies.forEach((a) => {
    anomalyByYear.set(a.year, a)
  })

  // Transform data for the chart
  const chartData: Array<ChartDataPoint> = entries.map((entry) => {
    const milestone = milestonesByYear.get(entry.year)
    const anomaly = anomalyByYear.get(entry.year)

    return {
      year: entry.year,
      rank: entry.rank,
      percentile: entry.percentile,
      score: entry.score,
      hasMilestone: !!milestone,
      milestoneEvent: milestone?.event,
      milestoneImpact: milestone?.impact,
      isAnomaly: !!anomaly,
      anomalyDirection: anomaly?.direction,
    }
  })

  // Get milestone points for reference dots
  const milestonePoints = chartData.filter((d) => d.hasMilestone)

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rank Trend</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              Rank Trend
              {getTrendIcon(metrics.trend)}
            </CardTitle>
            {(indexName || countryName) && (
              <CardDescription>
                {indexName && countryName
                  ? `${indexName} - ${countryName}`
                  : indexName || countryName}
              </CardDescription>
            )}
          </div>
          {showMetrics && (
            <div className="flex items-center gap-4 text-xs">
              <div className="text-left sm:text-right">
                <p className="text-muted-foreground flex items-center gap-1">
                  Velocity
                  <HelpTooltip content="Rate of rank change over time. Negative values indicate improvement (moving up in rankings)." />
                </p>
                <p className={`font-medium ${getTrendColor(metrics.trend)}`}>
                  {formatVelocity(metrics.velocity)}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-muted-foreground flex items-center gap-1">
                  Volatility
                  <HelpTooltip content="Standard deviation of year-over-year rank changes. Low = stable, High = fluctuating." />
                </p>
                <p className="font-medium">{formatVolatility(metrics.volatility)}</p>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Touch-friendly chart container */}
        <div className="touch-pan-x touch-pan-y">
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                reversed
                domain={['dataMin - 5', 'dataMax + 5']}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={40}
                label={{
                  value: 'Rank',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fontSize: 11 },
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line
                type="monotone"
                dataKey="rank"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={(props) => {
                  const { cx, cy, payload } = props
                  // Larger touch targets for mobile
                  const radius = payload.isAnomaly ? 8 : 5
                  if (payload.isAnomaly) {
                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={radius}
                        fill={payload.anomalyDirection === 'improvement' ? '#22c55e' : '#ef4444'}
                        stroke="white"
                        strokeWidth={2}
                        className="cursor-pointer"
                      />
                    )
                  }
                  return <circle cx={cx} cy={cy} r={radius} fill="hsl(var(--primary))" className="cursor-pointer" />
                }}
                activeDot={{ r: 8 }} // Larger active dot for touch
                name="Rank"
              />
              {showMilestones &&
                milestonePoints.map((point) => (
                  <ReferenceDot
                    key={point.year}
                    x={point.year}
                    y={point.rank}
                    r={10} // Larger for touch
                    fill={
                      point.milestoneImpact === 'positive'
                        ? '#22c55e'
                        : point.milestoneImpact === 'negative'
                          ? '#ef4444'
                          : '#f59e0b'
                    }
                    stroke="white"
                    strokeWidth={2}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {showMilestones && milestones.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <p className="text-xs font-medium mb-2 flex items-center gap-1">
              <IconFlag className="h-3 w-3" />
              Milestones
            </p>
            <div className="space-y-2">
              {milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="flex items-start gap-2 text-xs"
                >
                  <Badge
                    variant={
                      milestone.impact === 'positive'
                        ? 'default'
                        : milestone.impact === 'negative'
                          ? 'destructive'
                          : 'secondary'
                    }
                    className="shrink-0"
                  >
                    {milestone.year}
                  </Badge>
                  <span className="text-muted-foreground">{milestone.event}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {showMetrics && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t pt-4 text-xs">
            <div>
              <p className="text-muted-foreground">Best Rank</p>
              <p className="font-medium">{metrics.bestRank}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Worst Rank</p>
              <p className="font-medium">{metrics.worstRank}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Avg Rank</p>
              <p className="font-medium">{metrics.averageRank.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Years Tracked</p>
              <p className="font-medium">{metrics.totalYears}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default TrendChart
