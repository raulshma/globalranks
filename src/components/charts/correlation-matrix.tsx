/**
 * CorrelationMatrix Component - Index correlation visualization
 * Requirements: 7.4
 * - Show correlations between different indices
 * - Interactive drill-down to scatter plots
 */

import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts'

import type { RankingEntry, RankingIndex } from '@/lib/types'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface CorrelationMatrixProps {
  indices: Array<RankingIndex>
  entriesByIndex: Map<string, Array<RankingEntry>>
  title?: string
  description?: string
}

interface CorrelationValue {
  indexA: string
  indexB: string
  correlation: number
  sampleSize: number
}

interface ScatterDataPoint {
  countryCode: string
  countryName: string
  xValue: number
  yValue: number
  xRank: number
  yRank: number
}

/**
 * Calculate Pearson correlation coefficient between two arrays
 */
function calculateCorrelation(x: Array<number>, y: Array<number>): number {
  if (x.length !== y.length || x.length < 2) return 0

  const n = x.length
  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = y.reduce((a, b) => a + b, 0)
  const sumXY = x.reduce((total, xi, i) => total + xi * y[i], 0)
  const sumX2 = x.reduce((total, xi) => total + xi * xi, 0)
  const sumY2 = y.reduce((total, yi) => total + yi * yi, 0)

  const numerator = n * sumXY - sumX * sumY
  const denominator = Math.sqrt(
    (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
  )

  if (denominator === 0) return 0
  return numerator / denominator
}

/**
 * Get color for correlation value
 */
function getCorrelationColor(correlation: number): string {
  const absCorr = Math.abs(correlation)
  if (absCorr >= 0.8) return correlation > 0 ? 'bg-green-600' : 'bg-red-600'
  if (absCorr >= 0.6) return correlation > 0 ? 'bg-green-500' : 'bg-red-500'
  if (absCorr >= 0.4) return correlation > 0 ? 'bg-green-400' : 'bg-red-400'
  if (absCorr >= 0.2) return correlation > 0 ? 'bg-green-300' : 'bg-red-300'
  return 'bg-gray-200'
}

function getCorrelationTextColor(correlation: number): string {
  const absCorr = Math.abs(correlation)
  if (absCorr >= 0.4) return 'text-white'
  return 'text-gray-900'
}

function getCorrelationLabel(correlation: number): string {
  const absCorr = Math.abs(correlation)
  if (absCorr >= 0.8) return 'Very Strong'
  if (absCorr >= 0.6) return 'Strong'
  if (absCorr >= 0.4) return 'Moderate'
  if (absCorr >= 0.2) return 'Weak'
  return 'Very Weak'
}


interface MatrixCellProps {
  correlation: number
  sampleSize: number
  isSelected: boolean
  onClick: () => void
}

function MatrixCell({ correlation, sampleSize, isSelected, onClick }: MatrixCellProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full h-12 flex flex-col items-center justify-center text-xs transition-all',
        getCorrelationColor(correlation),
        getCorrelationTextColor(correlation),
        isSelected && 'ring-2 ring-primary ring-offset-2',
        'cursor-pointer hover:opacity-80'
      )}
      title={`Correlation: ${correlation.toFixed(2)}, Sample: ${sampleSize} countries`}
    >
      <span className="font-medium">{correlation.toFixed(2)}</span>
      <span className="text-[10px] opacity-80">n={sampleSize}</span>
    </button>
  )
}

interface ScatterPlotProps {
  data: Array<ScatterDataPoint>
  xIndex: RankingIndex
  yIndex: RankingIndex
  correlation: number
  onClose: () => void
}

function ScatterPlot({ data, xIndex, yIndex, correlation, onClose }: ScatterPlotProps) {
  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium">
            {xIndex.shortName} vs {yIndex.shortName}
          </p>
          <p className="text-xs text-muted-foreground">
            Correlation: {correlation.toFixed(3)} ({getCorrelationLabel(correlation)})
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid className="stroke-muted" />
          <XAxis
            type="number"
            dataKey="xValue"
            name={xIndex.shortName}
            tick={{ fontSize: 10 }}
            label={{
              value: xIndex.shortName,
              position: 'bottom',
              style: { fontSize: 11 },
            }}
          />
          <YAxis
            type="number"
            dataKey="yValue"
            name={yIndex.shortName}
            tick={{ fontSize: 10 }}
            label={{
              value: yIndex.shortName,
              angle: -90,
              position: 'insideLeft',
              style: { fontSize: 11 },
            }}
          />
          <ZAxis range={[50, 50]} />
          <Tooltip />
          <Scatter
            data={data}
            fill="hsl(var(--primary))"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

export function CorrelationMatrix({
  indices,
  entriesByIndex,
  title = 'Index Correlation Matrix',
  description,
}: CorrelationMatrixProps) {
  const [selectedPair, setSelectedPair] = useState<{
    indexA: string
    indexB: string
  } | null>(null)

  // Calculate correlations between all pairs of indices
  const correlations = useMemo(() => {
    const results: Array<CorrelationValue> = []

    for (let i = 0; i < indices.length; i++) {
      for (let j = i + 1; j < indices.length; j++) {
        const indexA = indices[i]
        const indexB = indices[j]

        const entriesA = entriesByIndex.get(indexA.id) ?? []
        const entriesB = entriesByIndex.get(indexB.id) ?? []

        // Find common countries
        const countriesA = new Map(entriesA.map((e) => [e.countryCode, e]))
        const commonCountries: Array<{ a: RankingEntry; b: RankingEntry }> = []

        entriesB.forEach((entryB) => {
          const entryA = countriesA.get(entryB.countryCode)
          if (entryA) {
            commonCountries.push({ a: entryA, b: entryB })
          }
        })

        if (commonCountries.length >= 5) {
          // Use percentile for correlation (higher = better for all)
          const xValues = commonCountries.map((c) => c.a.percentile)
          const yValues = commonCountries.map((c) => c.b.percentile)

          const correlation = calculateCorrelation(xValues, yValues)

          results.push({
            indexA: indexA.id,
            indexB: indexB.id,
            correlation,
            sampleSize: commonCountries.length,
          })
        }
      }
    }

    return results
  }, [indices, entriesByIndex])

  // Create correlation lookup map
  const correlationMap = useMemo(() => {
    const map = new Map<string, CorrelationValue>()
    correlations.forEach((c) => {
      map.set(`${c.indexA}-${c.indexB}`, c)
      map.set(`${c.indexB}-${c.indexA}`, c)
    })
    return map
  }, [correlations])

  // Get scatter plot data for selected pair
  const scatterData = useMemo(() => {
    if (!selectedPair) return null

    const entriesA = entriesByIndex.get(selectedPair.indexA) ?? []
    const entriesB = entriesByIndex.get(selectedPair.indexB) ?? []

    const countriesA = new Map(entriesA.map((e) => [e.countryCode, e]))
    const data: Array<ScatterDataPoint> = []

    entriesB.forEach((entryB) => {
      const entryA = countriesA.get(entryB.countryCode)
      if (entryA) {
        data.push({
          countryCode: entryB.countryCode,
          countryName: entryB.country?.name ?? entryB.countryCode,
          xValue: entryA.percentile,
          yValue: entryB.percentile,
          xRank: entryA.rank,
          yRank: entryB.rank,
        })
      }
    })

    return data
  }, [selectedPair, entriesByIndex])

  if (indices.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Need at least 2 indices to show correlations</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const selectedIndexA = selectedPair
    ? indices.find((i) => i.id === selectedPair.indexA)
    : null
  const selectedIndexB = selectedPair
    ? indices.find((i) => i.id === selectedPair.indexB)
    : null
  const selectedCorrelation = selectedPair
    ? correlationMap.get(`${selectedPair.indexA}-${selectedPair.indexB}`)
    : null

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
                <th className="text-left text-xs font-medium text-muted-foreground p-2 min-w-[80px]">
                  Index
                </th>
                {indices.map((index) => (
                  <th
                    key={index.id}
                    className="text-center text-xs font-medium text-muted-foreground p-2 min-w-[60px]"
                    title={index.name}
                  >
                    {index.shortName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {indices.map((rowIndex, rowIdx) => (
                <tr key={rowIndex.id}>
                  <td
                    className="text-xs font-medium p-2 border-r border-border"
                    title={rowIndex.name}
                  >
                    {rowIndex.shortName}
                  </td>
                  {indices.map((colIndex, colIdx) => {
                    if (rowIdx === colIdx) {
                      // Diagonal - self correlation is always 1
                      return (
                        <td key={colIndex.id} className="p-0.5">
                          <div className="w-full h-12 bg-gray-100 flex items-center justify-center text-xs text-muted-foreground">
                            1.00
                          </div>
                        </td>
                      )
                    }

                    const correlation = correlationMap.get(
                      `${rowIndex.id}-${colIndex.id}`
                    )

                    if (!correlation) {
                      return (
                        <td key={colIndex.id} className="p-0.5">
                          <div className="w-full h-12 bg-muted flex items-center justify-center text-xs text-muted-foreground">
                            N/A
                          </div>
                        </td>
                      )
                    }

                    const isSelected =
                      selectedPair?.indexA === rowIndex.id &&
                      selectedPair.indexB === colIndex.id

                    return (
                      <td key={colIndex.id} className="p-0.5">
                        <MatrixCell
                          correlation={correlation.correlation}
                          sampleSize={correlation.sampleSize}
                          isSelected={isSelected}
                          onClick={() =>
                            setSelectedPair({
                              indexA: rowIndex.id,
                              indexB: colIndex.id,
                            })
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

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs">
          <span className="text-muted-foreground">Correlation:</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-600" />
            <span>Strong +</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-400" />
            <span>Moderate +</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-200" />
            <span>Weak</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-red-400" />
            <span>Moderate -</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-red-600" />
            <span>Strong -</span>
          </div>
        </div>

        {/* Scatter plot drill-down */}
        {selectedPair && scatterData && selectedIndexA && selectedIndexB && selectedCorrelation && (
          <ScatterPlot
            data={scatterData}
            xIndex={selectedIndexA}
            yIndex={selectedIndexB}
            correlation={selectedCorrelation.correlation}
            onClose={() => setSelectedPair(null)}
          />
        )}

        {/* Top correlations summary */}
        <div className="mt-4 border-t pt-4">
          <p className="text-xs font-medium mb-2">Strongest Correlations</p>
          <div className="flex flex-wrap gap-2">
            {correlations
              .sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation))
              .slice(0, 5)
              .map((c) => {
                const indexA = indices.find((i) => i.id === c.indexA)
                const indexB = indices.find((i) => i.id === c.indexB)
                return (
                  <Badge
                    key={`${c.indexA}-${c.indexB}`}
                    variant={c.correlation > 0 ? 'default' : 'destructive'}
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedPair({ indexA: c.indexA, indexB: c.indexB })
                    }
                  >
                    {indexA?.shortName} ↔ {indexB?.shortName}: {c.correlation.toFixed(2)}
                  </Badge>
                )
              })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CorrelationMatrix
