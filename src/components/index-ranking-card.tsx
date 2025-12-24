/**
 * IndexRankingCard component
 * Displays a single index's ranking information for a country
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 5.1, 5.3, 7.4
 */

import {
  IconArrowDown,
  IconArrowUp,
  IconMinus,
} from "@tabler/icons-react"

import type { LatestIndexRanking } from "@/lib/server-functions/country-rankings"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface IndexRankingCardProps {
  ranking: LatestIndexRanking
  showDomain?: boolean
}

/**
 * Determines performance indicator color based on percentile
 * - Top 25% (>=75): Green
 * - Upper-mid (50-74): Blue
 * - Lower-mid (25-49): Yellow
 * - Bottom 25% (<25): Red
 */
function getPerformanceColor(percentile: number): string {
  if (percentile >= 75) return "text-green-600 bg-green-100 dark:bg-green-900/30"
  if (percentile >= 50) return "text-blue-600 bg-blue-100 dark:bg-blue-900/30"
  if (percentile >= 25) return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30"
  return "text-red-600 bg-red-100 dark:bg-red-900/30"
}

/**
 * Gets accessible label for performance tier
 */
function getPerformanceLabel(percentile: number): string {
  if (percentile >= 75) return "Top 25%"
  if (percentile >= 50) return "Upper middle 50%"
  if (percentile >= 25) return "Lower middle 50%"
  return "Bottom 25%"
}

/**
 * Rank change indicator component
 * Shows improvement (green up arrow), decline (red down arrow), or no change
 */
interface RankChangeIndicatorProps {
  change: number | null
  previousYear: number | null
}

function RankChangeIndicator({ change, previousYear }: RankChangeIndicatorProps) {
  if (previousYear === null || change === null) {
    return (
      <span className="flex items-center gap-1 text-muted-foreground">
        <IconMinus className="size-3" aria-hidden="true" />
        <span className="text-xs">No prior data</span>
      </span>
    )
  }

  if (change > 0) {
    return (
      <span className="flex items-center gap-1 text-green-600" role="status">
        <IconArrowUp className="size-3" aria-hidden="true" />
        <span className="text-xs font-medium">+{change}</span>
        <span className="sr-only">positions improved from {previousYear}</span>
      </span>
    )
  }

  if (change < 0) {
    return (
      <span className="flex items-center gap-1 text-red-600" role="status">
        <IconArrowDown className="size-3" aria-hidden="true" />
        <span className="text-xs font-medium">{change}</span>
        <span className="sr-only">positions declined from {previousYear}</span>
      </span>
    )
  }

  return (
    <span className="flex items-center gap-1 text-muted-foreground">
      <IconMinus className="size-3" aria-hidden="true" />
      <span className="text-xs">No change</span>
      <span className="sr-only">from {previousYear}</span>
    </span>
  )
}

/**
 * Index ranking card component
 * Displays comprehensive ranking information for a single index
 * 
 * Features:
 * - Index name with optional domain badge
 * - Rank position with total countries
 * - Percentile with color-coded performance indicator
 * - Score (if available)
 * - Year and rank change from previous year
 * - Source link
 * - Links to detailed index page
 * - "No data available" state for indices without rankings (Requirement 2.4)
 * - Touch-friendly tap targets (Requirement 7.4)
 * - Responsive layout (Requirement 7.4)
 */
export function IndexRankingCard({ ranking, showDomain = false }: IndexRankingCardProps) {
  // Handle indices without data - Requirement 2.4
  if (!ranking.hasData) {
    return (
      <Card className="h-full opacity-60">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-sm font-medium leading-tight line-clamp-2">
              {ranking.indexName}
            </CardTitle>
            {showDomain && (
              <Badge variant="outline" className="shrink-0 text-xs">
                <span aria-hidden="true">{ranking.domainIcon}</span>
                <span className="ml-1 hidden sm:inline">{ranking.domainName}</span>
                <span className="sr-only">{ranking.domainName}</span>
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-center py-4">
            <span className="text-muted-foreground text-sm">No data available</span>
          </div>
          {/* Source Link - Requirement 5.3 */}
          <div className="pt-2 border-t border-border">
            <a
              href={ranking.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary truncate block touch-manipulation"
              aria-label={`Source: ${ranking.source} (opens in new tab)`}
            >
              {ranking.source}
            </a>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <a 
      href={`/rankings/${ranking.domainId}/${ranking.indexId}`} 
      className="block touch-manipulation"
      aria-label={`${ranking.indexName}: Rank ${ranking.rank} of ${ranking.totalCountries}, ${getPerformanceLabel(ranking.percentile!)}`}
    >
      <Card className="h-full transition-colors hover:bg-muted/50 active:bg-muted/70">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-sm font-medium leading-tight line-clamp-2">
              {ranking.indexName}
            </CardTitle>
            {showDomain && (
              <Badge variant="outline" className="shrink-0 text-xs">
                <span aria-hidden="true">{ranking.domainIcon}</span>
                <span className="ml-1 hidden sm:inline">{ranking.domainName}</span>
                <span className="sr-only">{ranking.domainName}</span>
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-2 sm:space-y-3">
          {/* Rank and Percentile - Requirements 3.1, 3.5 */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl sm:text-2xl font-bold">#{ranking.rank}</span>
              <span className="text-muted-foreground text-xs sm:text-sm ml-1">
                / {ranking.totalCountries}
              </span>
            </div>
            <Badge 
              className={cn("font-medium text-xs", getPerformanceColor(ranking.percentile!))}
              aria-label={`Percentile: ${ranking.percentile!.toFixed(0)}%, ${getPerformanceLabel(ranking.percentile!)}`}
            >
              {ranking.percentile!.toFixed(0)}%
            </Badge>
          </div>

          {/* Score if available - Requirement 3.4 */}
          {ranking.score !== null && (
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Score</span>
              <span className="font-medium">{ranking.score.toFixed(1)}</span>
            </div>
          )}

          {/* Year and Rank Change - Requirements 3.1, 3.2 */}
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground">{ranking.year}</span>
            <RankChangeIndicator
              change={ranking.rankChange}
              previousYear={ranking.previousYear}
            />
          </div>

          {/* Source Link - Requirement 5.3 */}
          <div className="pt-2 border-t border-border">
            <span
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                window.open(ranking.sourceUrl, '_blank', 'noopener,noreferrer')
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  e.stopPropagation()
                  window.open(ranking.sourceUrl, '_blank', 'noopener,noreferrer')
                }
              }}
              role="link"
              tabIndex={0}
              className="text-xs text-muted-foreground hover:text-primary truncate block cursor-pointer touch-manipulation"
              aria-label={`Source: ${ranking.source} (opens in new tab)`}
            >
              {ranking.source}
            </span>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}
