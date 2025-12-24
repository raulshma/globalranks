/**
 * RankDistribution Component - Global position visualization
 * Requirements: 2.7, 7.3
 * - Show selected country position in global distribution
 * - Display full ranking list visualization
 * - Highlight peer group positions
 */

import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { Country, PeerGroup, RankingEntry } from '@/lib/types'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface RankDistributionProps {
  entries: Array<RankingEntry & { country?: Country }>
  selectedCountryCode: string
  peerGroups?: Array<PeerGroup>
  highlightedPeerGroup?: string
  title?: string
  description?: string
  height?: number
  showTopN?: number // Show only top N countries in bar chart
}

interface DistributionDataPoint {
  rank: number
  countryCode: string
  countryName: string
  score: number | null
  percentile: number
  isSelected: boolean
  isPeerGroup: boolean
  peerGroupName?: string
}

// Color palette for different states
const COLORS = {
  selected: 'hsl(var(--primary))',
  peerGroup: '#22c55e',
  default: 'hsl(var(--muted))',
  top10: '#f59e0b',
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    payload: DistributionDataPoint
  }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  const data = payload[0].payload

  return (
    <div className="bg-popover border border-border p-3 shadow-md">
      <p className="font-medium text-sm">{data.countryName}</p>
      <div className="mt-1 space-y-1 text-xs">
        <p>Rank: <span className="font-medium">#{data.rank}</span></p>
        <p>Percentile: <span className="font-medium">{data.percentile.toFixed(1)}%</span></p>
        {data.score !== null && (
          <p>Score: <span className="font-medium">{data.score.toFixed(2)}</span></p>
        )}
        {data.isPeerGroup && data.peerGroupName && (
          <Badge variant="secondary" className="mt-1">
            {data.peerGroupName}
          </Badge>
        )}
      </div>
    </div>
  )
}


export function RankDistribution({
  entries,
  selectedCountryCode,
  peerGroups = [],
  highlightedPeerGroup,
  title = 'Rank Distribution',
  description,
  height = 300,
  showTopN = 30,
}: RankDistributionProps) {
  // Get peer group country codes
  const peerGroupCountries = useMemo(() => {
    const map = new Map<string, string>()
    const targetGroup = highlightedPeerGroup
      ? peerGroups.find((g) => g.id === highlightedPeerGroup)
      : null

    if (targetGroup) {
      targetGroup.countryCodes.forEach((code) => {
        map.set(code, targetGroup.name)
      })
    }
    return map
  }, [peerGroups, highlightedPeerGroup])

  // Sort entries by rank and transform for chart
  const chartData: Array<DistributionDataPoint> = useMemo(() => {
    const sorted = [...entries].sort((a, b) => a.rank - b.rank)
    const topEntries = sorted.slice(0, showTopN)

    return topEntries.map((entry) => ({
      rank: entry.rank,
      countryCode: entry.countryCode,
      countryName: entry.country?.name ?? entry.countryCode,
      score: entry.score,
      percentile: entry.percentile,
      isSelected: entry.countryCode === selectedCountryCode,
      isPeerGroup: peerGroupCountries.has(entry.countryCode),
      peerGroupName: peerGroupCountries.get(entry.countryCode),
    }))
  }, [entries, selectedCountryCode, peerGroupCountries, showTopN])

  // Find selected country's position
  const selectedEntry = useMemo(() => {
    return entries.find((e) => e.countryCode === selectedCountryCode)
  }, [entries, selectedCountryCode])

  // Calculate distribution statistics
  const stats = useMemo(() => {
    if (entries.length === 0) return null

    const scores = entries
      .map((e) => e.score)
      .filter((s): s is number => s !== null)
    const ranks = entries.map((e) => e.rank)

    return {
      totalCountries: entries.length,
      avgScore: scores.length > 0
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : null,
      medianRank: ranks[Math.floor(ranks.length / 2)],
      topQuartile: Math.ceil(entries.length * 0.25),
      bottomQuartile: Math.ceil(entries.length * 0.75),
    }
  }, [entries])

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {selectedEntry && (
            <div className="text-right">
              <p className="text-2xl font-bold">#{selectedEntry.rank}</p>
              <p className="text-xs text-muted-foreground">
                of {entries.length} countries
              </p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Bar Chart showing top N countries */}
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="countryName"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              width={75}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="percentile" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.isSelected
                      ? COLORS.selected
                      : entry.isPeerGroup
                        ? COLORS.peerGroup
                        : entry.rank <= 10
                          ? COLORS.top10
                          : COLORS.default
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Position indicator */}
        {selectedEntry && stats && (
          <div className="mt-4 border-t pt-4">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-full h-2 bg-muted rounded-full relative"
                title={`Position: ${selectedEntry.rank} of ${stats.totalCountries}`}
              >
                {/* Quartile markers */}
                <div
                  className="absolute top-0 h-full w-0.5 bg-border"
                  style={{ left: '25%' }}
                />
                <div
                  className="absolute top-0 h-full w-0.5 bg-border"
                  style={{ left: '50%' }}
                />
                <div
                  className="absolute top-0 h-full w-0.5 bg-border"
                  style={{ left: '75%' }}
                />
                {/* Selected country marker */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary border-2 border-white shadow"
                  style={{
                    left: `${((selectedEntry.rank - 1) / (stats.totalCountries - 1)) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Top</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>Bottom</span>
            </div>
          </div>
        )}

        {/* Legend and stats */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.selected }} />
            <span>Selected Country</span>
          </div>
          {highlightedPeerGroup && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.peerGroup }} />
              <span>Peer Group</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.top10 }} />
            <span>Top 10</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.default }} />
            <span>Others</span>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="mt-4 grid grid-cols-3 gap-4 border-t pt-4 text-xs">
            <div>
              <p className="text-muted-foreground">Total Countries</p>
              <p className="font-medium">{stats.totalCountries}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Percentile</p>
              <p className="font-medium">
                {selectedEntry ? `${selectedEntry.percentile.toFixed(1)}%` : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Quartile</p>
              <p className={cn(
                'font-medium',
                selectedEntry && selectedEntry.rank <= stats.topQuartile && 'text-green-600',
                selectedEntry && selectedEntry.rank > stats.bottomQuartile && 'text-red-600'
              )}>
                {selectedEntry
                  ? selectedEntry.rank <= stats.topQuartile
                    ? 'Top 25%'
                    : selectedEntry.rank <= stats.medianRank
                      ? 'Top 50%'
                      : selectedEntry.rank <= stats.bottomQuartile
                        ? 'Bottom 50%'
                        : 'Bottom 25%'
                  : 'N/A'}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default RankDistribution
