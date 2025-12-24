/**
 * FullRankingTable Component - Complete country ranking list
 * Requirements: 1.6, 2.7
 * - Display complete country list for an index
 * - Sortable columns (rank, score, country name)
 * - Highlight selected country row
 * - Search/filter within the table
 */

import { useMemo, useState } from 'react'
import { IconArrowDown, IconArrowUp, IconSearch } from '@tabler/icons-react'

import type { Country, RankingEntry, RankingIndex } from '@/lib/types'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface FullRankingTableProps {
  entries: Array<RankingEntry & { country?: Country }>
  index?: RankingIndex
  selectedCountryCode?: string
  title?: string
  description?: string
  showSearch?: boolean
  pageSize?: number
}

type SortField = 'rank' | 'score' | 'countryName' | 'percentile'
type SortDirection = 'asc' | 'desc'

interface SortConfig {
  field: SortField
  direction: SortDirection
}

function SortIcon({ field, sortConfig }: { field: SortField; sortConfig: SortConfig }) {
  if (sortConfig.field !== field) {
    return <span className="w-4 h-4" />
  }
  return sortConfig.direction === 'asc' ? (
    <IconArrowUp className="w-4 h-4" />
  ) : (
    <IconArrowDown className="w-4 h-4" />
  )
}


export function FullRankingTable({
  entries,
  index,
  selectedCountryCode,
  title,
  description,
  showSearch = true,
  pageSize = 20,
}: FullRankingTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'rank',
    direction: 'asc',
  })
  const [currentPage, setCurrentPage] = useState(1)

  // Filter entries by search query
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries

    const query = searchQuery.toLowerCase()
    return entries.filter((entry) => {
      const countryName = entry.country?.name.toLowerCase() ?? ''
      const countryCode = entry.countryCode.toLowerCase()
      return countryName.includes(query) || countryCode.includes(query)
    })
  }, [entries, searchQuery])

  // Sort entries
  const sortedEntries = useMemo(() => {
    const sorted = [...filteredEntries]

    sorted.sort((a, b) => {
      let comparison = 0

      switch (sortConfig.field) {
        case 'rank':
          comparison = a.rank - b.rank
          break
        case 'score': {
          const scoreA = a.score ?? 0
          const scoreB = b.score ?? 0
          comparison = scoreA - scoreB
          break
        }
        case 'countryName': {
          const nameA = a.country?.name ?? a.countryCode
          const nameB = b.country?.name ?? b.countryCode
          comparison = nameA.localeCompare(nameB)
          break
        }
        case 'percentile':
          comparison = a.percentile - b.percentile
          break
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison
    })

    return sorted
  }, [filteredEntries, sortConfig])

  // Paginate entries
  const paginatedEntries = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedEntries.slice(startIndex, startIndex + pageSize)
  }, [sortedEntries, currentPage, pageSize])

  const totalPages = Math.ceil(sortedEntries.length / pageSize)

  // Handle sort
  const handleSort = (field: SortField) => {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
    setCurrentPage(1)
  }

  // Find selected country's position
  const selectedEntry = useMemo(() => {
    return entries.find((e) => e.countryCode === selectedCountryCode)
  }, [entries, selectedCountryCode])

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title ?? 'Full Ranking'}</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>{title ?? index?.name ?? 'Full Ranking'}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
            {index && (
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <span>Source: {index.source}</span>
                {index.sourceUrl && (
                  <a
                    href={index.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View Source
                  </a>
                )}
              </div>
            )}
          </div>
          {selectedEntry && (
            <div className="text-right shrink-0">
              <Badge variant="default" className="text-lg px-3 py-1">
                #{selectedEntry.rank}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedEntry.country?.name ?? selectedCountryCode}
              </p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        {showSearch && (
          <div className="relative mb-4">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search countries..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-9"
            />
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[400px]">
            <thead>
              <tr className="border-b">
                <th
                  className="text-left text-xs font-medium text-muted-foreground p-2 cursor-pointer hover:bg-muted/50 touch-manipulation"
                  onClick={() => handleSort('rank')}
                  role="columnheader"
                  aria-sort={sortConfig.field === 'rank' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  <div className="flex items-center gap-1">
                    Rank
                    <SortIcon field="rank" sortConfig={sortConfig} />
                  </div>
                </th>
                <th
                  className="text-left text-xs font-medium text-muted-foreground p-2 cursor-pointer hover:bg-muted/50 touch-manipulation"
                  onClick={() => handleSort('countryName')}
                  role="columnheader"
                  aria-sort={sortConfig.field === 'countryName' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  <div className="flex items-center gap-1">
                    Country
                    <SortIcon field="countryName" sortConfig={sortConfig} />
                  </div>
                </th>
                <th
                  className="text-right text-xs font-medium text-muted-foreground p-2 cursor-pointer hover:bg-muted/50 touch-manipulation hidden sm:table-cell"
                  onClick={() => handleSort('score')}
                  role="columnheader"
                  aria-sort={sortConfig.field === 'score' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  <div className="flex items-center justify-end gap-1">
                    Score
                    <SortIcon field="score" sortConfig={sortConfig} />
                  </div>
                </th>
                <th
                  className="text-right text-xs font-medium text-muted-foreground p-2 cursor-pointer hover:bg-muted/50 touch-manipulation"
                  onClick={() => handleSort('percentile')}
                  role="columnheader"
                  aria-sort={sortConfig.field === 'percentile' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span className="hidden sm:inline">Percentile</span>
                    <span className="sm:hidden">%ile</span>
                    <SortIcon field="percentile" sortConfig={sortConfig} />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedEntries.map((entry) => {
                const isSelected = entry.countryCode === selectedCountryCode
                return (
                  <tr
                    key={entry.id}
                    className={cn(
                      'border-b last:border-0 hover:bg-muted/50 transition-colors',
                      isSelected && 'bg-primary/10 hover:bg-primary/15'
                    )}
                  >
                    <td className="p-2 text-sm">
                      <span className={cn('font-medium', isSelected && 'text-primary')}>
                        #{entry.rank}
                      </span>
                    </td>
                    <td className="p-2 text-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                        <span className={cn(isSelected && 'font-medium text-primary')}>
                          {entry.country?.name ?? entry.countryCode}
                        </span>
                        <div className="flex items-center gap-1">
                          {entry.country?.region && (
                            <span className="text-xs text-muted-foreground hidden md:inline">
                              ({entry.country.region})
                            </span>
                          )}
                          {isSelected && (
                            <Badge variant="secondary" className="text-[10px]">
                              Selected
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-2 text-sm text-right hidden sm:table-cell">
                      {entry.score !== null ? entry.score.toFixed(2) : '—'}
                    </td>
                    <td className="p-2 text-sm text-right">
                      <span
                        className={cn(
                          entry.percentile >= 75 && 'text-green-600',
                          entry.percentile >= 50 && entry.percentile < 75 && 'text-yellow-600',
                          entry.percentile < 50 && 'text-red-600'
                        )}
                      >
                        {entry.percentile.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, sortedEntries.length)} of{' '}
              {sortedEntries.length} countries
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[36px]"
                aria-label="Previous page"
              >
                Previous
              </button>
              <span className="text-xs text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[36px]"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Summary stats */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t pt-4 text-xs">
          <div>
            <p className="text-muted-foreground">Total Countries</p>
            <p className="font-medium">{entries.length}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Showing</p>
            <p className="font-medium">{filteredEntries.length}</p>
          </div>
          {selectedEntry && (
            <>
              <div>
                <p className="text-muted-foreground">Selected Rank</p>
                <p className="font-medium">#{selectedEntry.rank}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Selected Percentile</p>
                <p className="font-medium">{selectedEntry.percentile.toFixed(1)}%</p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default FullRankingTable
