/**
 * FlatIndicesView component
 * Displays all indices in a flat alphabetical list
 * Requirements: 4.3, 4.4, 7.4
 */

import * as React from "react"

import type { LatestIndexRanking } from "@/lib/server-functions/country-rankings"
import { IndexRankingCard } from "@/components/index-ranking-card"

export interface FlatIndicesViewProps {
  rankings: Array<LatestIndexRanking>
}

/**
 * Flat indices view - displays all indices in alphabetical order
 * 
 * Features:
 * - All rankings in alphabetical order by index name - Requirement 4.4
 * - Domain badge shown on each card - Requirement 4.3
 * - Responsive grid layout - Requirement 7.4
 * - Mobile-friendly single column on small screens
 */
export function FlatIndicesView({ rankings }: FlatIndicesViewProps) {
  // Sort alphabetically by index name - Requirement 4.4
  const sortedRankings = React.useMemo(() => {
    return [...rankings].sort((a, b) => a.indexName.localeCompare(b.indexName))
  }, [rankings])

  return (
    <div 
      className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      role="list"
      aria-label="All rankings in alphabetical order"
    >
      {sortedRankings.map((ranking) => (
        <div key={ranking.indexId} role="listitem">
          <IndexRankingCard
            ranking={ranking}
            showDomain
          />
        </div>
      ))}
    </div>
  )
}
