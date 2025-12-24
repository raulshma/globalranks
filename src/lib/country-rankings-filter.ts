/**
 * Client-side filtering logic for country rankings
 * Requirements: 6.2, 6.3, 6.4
 */

import type { DomainRankingGroup, LatestIndexRanking } from "@/lib/server-functions/country-rankings"
import type { PerformanceTier } from "@/components/search-filter-panel"

/**
 * Filter state for country rankings
 */
export interface FilterState {
  searchQuery: string
  performanceTier: PerformanceTier
}

/**
 * Filter rankings by search query (case-insensitive name match)
 * Requirement 6.2: Real-time filtering by index name
 * 
 * @param rankings - Array of rankings to filter
 * @param query - Search query string
 * @returns Filtered rankings where index name contains the query
 */
export function filterBySearchQuery(
  rankings: Array<LatestIndexRanking>,
  query: string
): Array<LatestIndexRanking> {
  if (!query || query.trim() === "") {
    return rankings
  }
  
  const normalizedQuery = query.toLowerCase().trim()
  return rankings.filter((ranking) =>
    ranking.indexName.toLowerCase().includes(normalizedQuery)
  )
}

/**
 * Filter rankings by performance tier (percentile ranges)
 * Requirement 6.3: Filter by performance tier
 * 
 * Tier definitions:
 * - top25: percentile >= 75 (top 25% performers)
 * - mid-upper: 50 <= percentile < 75 (25-50% range)
 * - mid-lower: 25 <= percentile < 50 (50-75% range)
 * - bottom25: percentile < 25 (bottom 25% performers)
 * - all: no filtering
 * 
 * Note: Rankings without data (hasData: false) are excluded when a tier filter is applied
 * 
 * @param rankings - Array of rankings to filter
 * @param tier - Performance tier to filter by
 * @returns Filtered rankings matching the tier criteria
 */
export function filterByPerformanceTier(
  rankings: Array<LatestIndexRanking>,
  tier: PerformanceTier
): Array<LatestIndexRanking> {
  if (tier === "all") {
    return rankings
  }

  return rankings.filter((ranking) => {
    // Exclude rankings without data when filtering by tier
    if (!ranking.hasData || ranking.percentile === null) {
      return false
    }

    switch (tier) {
      case "top25":
        return ranking.percentile >= 75
      case "mid-upper":
        return ranking.percentile >= 50 && ranking.percentile < 75
      case "mid-lower":
        return ranking.percentile >= 25 && ranking.percentile < 50
      case "bottom25":
        return ranking.percentile < 25
      default:
        return true
    }
  })
}

/**
 * Apply all filters to rankings
 * Requirement 6.2, 6.3: Combined filtering
 * 
 * @param rankings - Array of rankings to filter
 * @param filterState - Current filter state
 * @returns Filtered rankings
 */
export function applyFilters(
  rankings: Array<LatestIndexRanking>,
  filterState: FilterState
): Array<LatestIndexRanking> {
  let result = rankings

  // Apply search filter first
  result = filterBySearchQuery(result, filterState.searchQuery)

  // Then apply tier filter
  result = filterByPerformanceTier(result, filterState.performanceTier)

  return result
}

/**
 * Filter domain groups based on filtered rankings
 * Preserves domain structure while filtering out empty groups
 * 
 * @param groups - Array of domain groups
 * @param filteredRankings - Already filtered rankings
 * @returns Domain groups with only matching rankings
 */
export function filterDomainGroups(
  groups: Array<DomainRankingGroup>,
  filteredRankings: Array<LatestIndexRanking>
): Array<DomainRankingGroup> {
  const filteredIds = new Set(filteredRankings.map((r) => r.indexId))

  return groups
    .map((group) => ({
      ...group,
      rankings: group.rankings.filter((r) => filteredIds.has(r.indexId)),
    }))
    .filter((group) => group.rankings.length > 0)
}

/**
 * Calculate filter result counts
 * Requirement 6.4: Update counts after filtering
 * 
 * @param totalRankings - Total number of rankings with data
 * @param filteredRankings - Number of rankings after filtering
 * @returns Object with count information
 */
export function getFilterCounts(
  totalRankings: number,
  filteredRankings: number
): { total: number; filtered: number; hasActiveFilter: boolean } {
  return {
    total: totalRankings,
    filtered: filteredRankings,
    hasActiveFilter: filteredRankings !== totalRankings,
  }
}
