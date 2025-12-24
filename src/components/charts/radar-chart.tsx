/**
 * RadarChart Component - Multi-index comparison visualization
 * Requirements: 7.2
 * - Display multiple indices as radar dimensions
 * - Support multiple countries overlay
 */

import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartsRadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

import type { RankingEntry, RankingIndex } from '@/lib/types'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Color palette for multiple countries
const COUNTRY_COLORS = [
  'hsl(var(--primary))',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
  '#84cc16',
]

export interface RadarChartDataPoint {
  indexId: string
  indexName: string
  indexShortName: string
  [countryCode: string]: number | string // Dynamic country scores
}

export interface RadarChartProps {
  data: Array<{
    index: RankingIndex
    entries: Array<RankingEntry>
  }>
  countries: Array<{
    code: string
    name: string
  }>
  title?: string
  description?: string
  height?: number
  usePercentile?: boolean // Use percentile instead of normalized score
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    color: string
  }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="bg-popover border border-border p-3 shadow-md">
      <p className="font-medium text-sm mb-2">{label}</p>
      <div className="space-y-1 text-xs">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.name}:</span>
            <span className="font-medium">{entry.value.toFixed(1)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function RadarChart({
  data,
  countries,
  title = 'Multi-Index Comparison',
  description,
  height = 400,
  usePercentile = true,
}: RadarChartProps) {
  // Transform data for radar chart
  const chartData: Array<RadarChartDataPoint> = data.map(({ index, entries }) => {
    const point: RadarChartDataPoint = {
      indexId: index.id,
      indexName: index.name,
      indexShortName: index.shortName,
    }

    // Add score for each country
    countries.forEach((country) => {
      const entry = entries.find((e) => e.countryCode === country.code)
      if (entry) {
        // Use percentile or normalized score
        point[country.code] = usePercentile
          ? entry.percentile
          : (entry.normalizedScore ?? 0)
      } else {
        point[country.code] = 0
      }
    })

    return point
  })

  if (data.length === 0 || countries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>No data available for comparison</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {/* Touch-friendly chart container */}
        <div className="touch-pan-x touch-pan-y">
          <ResponsiveContainer width="100%" height={height}>
            <RechartsRadarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <PolarGrid className="stroke-muted" />
              <PolarAngleAxis
                dataKey="indexShortName"
                tick={{ fontSize: 10 }}
                className="text-muted-foreground"
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fontSize: 9 }}
                tickCount={5}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              {countries.map((country, index) => (
                <Radar
                  key={country.code}
                  name={country.name}
                  dataKey={country.code}
                  stroke={COUNTRY_COLORS[index % COUNTRY_COLORS.length]}
                  fill={COUNTRY_COLORS[index % COUNTRY_COLORS.length]}
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              ))}
            </RechartsRadarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 border-t pt-4">
          <p className="text-xs text-muted-foreground mb-2">
            {usePercentile
              ? 'Values shown as percentile (higher = better performance)'
              : 'Values shown as normalized scores (0-100)'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
            {data.map(({ index }) => (
              <div key={index.id} className="flex items-center gap-1">
                <span className="font-medium">{index.shortName}:</span>
                <span className="text-muted-foreground truncate">{index.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default RadarChart
