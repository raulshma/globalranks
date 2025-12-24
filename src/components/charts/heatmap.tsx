/**
 * Heatmap Component - Domain performance visualization
 * Requirements: 7.1
 * - Rows: domains, Columns: years
 * - Color intensity based on aggregate score
 */

import { useMemo } from 'react'

import type { Domain } from '@/lib/types'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface HeatmapDataPoint {
  domainId: string
  domainName: string
  year: number
  score: number // 0-100 normalized score
  rank?: number
  totalIndices?: number
}

export interface HeatmapProps {
  data: Array<HeatmapDataPoint>
  domains: Array<Domain>
  years: Array<number>
  title?: string
  description?: string
  onCellClick?: (domainId: string, year: number) => void
  selectedDomain?: string
  selectedYear?: number
}

// Color scale from red (poor) to green (good)
function getColorForScore(score: number): string {
  // Score is 0-100, where higher is better
  if (score >= 80) return 'bg-green-600'
  if (score >= 60) return 'bg-green-500'
  if (score >= 50) return 'bg-yellow-500'
  if (score >= 40) return 'bg-orange-500'
  if (score >= 20) return 'bg-red-500'
  return 'bg-red-600'
}

function getTextColorForScore(score: number): string {
  // Use white text for darker backgrounds
  if (score >= 60 || score < 40) return 'text-white'
  return 'text-gray-900'
}

interface HeatmapCellProps {
  score: number | null
  rank?: number
  isSelected?: boolean
  onClick?: () => void
}

function HeatmapCell({ score, rank, isSelected, onClick }: HeatmapCellProps) {
  if (score === null) {
    return (
      <div className="w-full h-10 sm:h-12 bg-muted flex items-center justify-center text-xs text-muted-foreground">
        N/A
      </div>
    )
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full h-10 sm:h-12 flex flex-col items-center justify-center text-xs transition-all',
        'touch-manipulation', // Optimize for touch
        getColorForScore(score),
        getTextColorForScore(score),
        isSelected && 'ring-2 ring-primary ring-offset-2',
        onClick && 'cursor-pointer hover:opacity-80 active:opacity-70'
      )}
      aria-label={`Score: ${score.toFixed(0)}${rank ? `, Rank: ${rank}` : ''}`}
    >
      <span className="font-medium">{score.toFixed(0)}</span>
      {rank && <span className="text-[10px] opacity-80">#{rank}</span>}
    </button>
  )
}


export function Heatmap({
  data,
  domains,
  years,
  title = 'Domain Performance Heatmap',
  description,
  onCellClick,
  selectedDomain,
  selectedYear,
}: HeatmapProps) {
  // Create a lookup map for quick access
  const dataMap = useMemo(() => {
    const map = new Map<string, HeatmapDataPoint>()
    data.forEach((point) => {
      map.set(`${point.domainId}-${point.year}`, point)
    })
    return map
  }, [data])

  // Sort years in ascending order
  const sortedYears = useMemo(() => [...years].sort((a, b) => a - b), [years])

  if (domains.length === 0 || years.length === 0) {
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
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-muted-foreground p-2 min-w-[120px]">
                  Domain
                </th>
                {sortedYears.map((year) => (
                  <th
                    key={year}
                    className={cn(
                      'text-center text-xs font-medium text-muted-foreground p-2 min-w-[60px]',
                      selectedYear === year && 'bg-primary/10'
                    )}
                  >
                    {year}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {domains.map((domain) => (
                <tr
                  key={domain.id}
                  className={cn(
                    selectedDomain === domain.id && 'bg-primary/5'
                  )}
                >
                  <td className="text-xs font-medium p-2 border-r border-border">
                    <div className="flex items-center gap-2">
                      <span>{domain.icon}</span>
                      <span className="truncate max-w-[100px]">{domain.name}</span>
                    </div>
                  </td>
                  {sortedYears.map((year) => {
                    const point = dataMap.get(`${domain.id}-${year}`)
                    return (
                      <td key={year} className="p-0.5">
                        <HeatmapCell
                          score={point?.score ?? null}
                          rank={point?.rank}
                          isSelected={
                            selectedDomain === domain.id && selectedYear === year
                          }
                          onClick={
                            onCellClick
                              ? () => onCellClick(domain.id, year)
                              : undefined
                          }
                        />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend - responsive layout */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs">
          <span className="text-muted-foreground w-full sm:w-auto text-center sm:text-left">Performance:</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-red-600" aria-hidden="true" />
            <span>Poor</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-orange-500" aria-hidden="true" />
            <span>Below Avg</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-yellow-500" aria-hidden="true" />
            <span>Average</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-500" aria-hidden="true" />
            <span>Good</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-600" aria-hidden="true" />
            <span>Excellent</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Heatmap
