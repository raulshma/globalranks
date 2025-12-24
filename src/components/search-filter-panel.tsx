/**
 * SearchFilterPanel component
 * Search and filter controls for the country all indices view
 * Requirements: 6.1, 6.3, 4.3, 7.4
 */

import * as React from "react"
import {
  IconLayoutGrid,
  IconLayoutList,
  IconSearch,
  IconX,
} from "@tabler/icons-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export type PerformanceTier = "all" | "top25" | "mid-upper" | "mid-lower" | "bottom25"
export type ViewMode = "grouped" | "flat"

export interface SearchFilterPanelProps {
  /** Current search query */
  searchQuery: string
  /** Current performance tier filter */
  performanceTier: PerformanceTier
  /** Current view mode (grouped or flat) */
  viewMode: ViewMode
  /** Total count of indices with data */
  totalCount: number
  /** Count of indices after filtering */
  filteredCount: number
  /** Callback when search query changes */
  onSearchChange: (query: string) => void
  /** Callback when performance tier changes */
  onTierChange: (tier: PerformanceTier) => void
  /** Callback when view mode changes */
  onViewModeChange: (mode: ViewMode) => void
  /** Optional callback for announcing filter changes to screen readers */
  onFilterAnnounce?: (message: string) => void
}

/**
 * Performance tier labels for display
 */
const TIER_LABELS: Record<PerformanceTier, string> = {
  all: "All Tiers",
  top25: "Top 25%",
  "mid-upper": "25-50%",
  "mid-lower": "50-75%",
  bottom25: "Bottom 25%",
}

/**
 * SearchFilterPanel - Search and filter controls for indices
 * 
 * Features:
 * - Search input for filtering by index name - Requirement 6.1
 * - Performance tier dropdown (All, Top 25%, etc.) - Requirement 6.3
 * - View mode toggle (Grouped/Flat) - Requirement 4.3
 * - Display filtered count vs total count - Requirement 6.4
 * - Touch-friendly filter controls - Requirement 7.4
 * - Responsive layout for mobile/desktop - Requirement 7.4
 * - Updates URL search params on filter change (handled by parent)
 */
export function SearchFilterPanel({
  searchQuery,
  performanceTier,
  viewMode,
  totalCount,
  filteredCount,
  onSearchChange,
  onTierChange,
  onViewModeChange,
  onFilterAnnounce,
}: SearchFilterPanelProps) {
  // Track if filters are active
  const hasActiveFilters = searchQuery.length > 0 || performanceTier !== "all"
  const showFilteredCount = hasActiveFilters && filteredCount !== totalCount

  // Announce filter changes to screen readers
  const announceFilterChange = React.useCallback((message: string) => {
    if (onFilterAnnounce) {
      onFilterAnnounce(message)
    }
  }, [onFilterAnnounce])

  // Handle search change with announcement
  const handleSearchChange = React.useCallback((value: string) => {
    onSearchChange(value)
    // Debounced announcement handled by parent or effect
  }, [onSearchChange])

  // Handle tier change with announcement
  const handleTierChange = React.useCallback((tier: PerformanceTier) => {
    onTierChange(tier)
    announceFilterChange(`Filtered to ${TIER_LABELS[tier]}`)
  }, [onTierChange, announceFilterChange])

  // Handle view mode change with announcement
  const handleViewModeChange = React.useCallback((mode: ViewMode) => {
    onViewModeChange(mode)
    announceFilterChange(`Switched to ${mode === "grouped" ? "grouped" : "list"} view`)
  }, [onViewModeChange, announceFilterChange])

  // Clear search handler
  const handleClearSearch = React.useCallback(() => {
    onSearchChange("")
    announceFilterChange("Search cleared")
  }, [onSearchChange, announceFilterChange])

  return (
    <Card>
      <CardContent className="py-3 sm:py-4">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Search Input Row - Full width on mobile - Requirement 6.1, 7.4 */}
          <div className="relative w-full">
            <IconSearch 
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" 
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Search indices..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 pr-9 h-10 sm:h-9 touch-manipulation"
              aria-label="Search indices by name"
              aria-describedby={showFilteredCount ? "filter-count" : undefined}
            />
            {/* Clear button - touch-friendly */}
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 touch-manipulation"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <IconX className="size-4" aria-hidden="true" />
              </Button>
            )}
          </div>

          {/* Filter Controls Row - Responsive layout */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Performance Tier Filter - Requirement 6.3, 7.4 */}
            <Select 
              value={performanceTier} 
              onValueChange={(value) => value && handleTierChange(value as PerformanceTier)}
            >
              <SelectTrigger 
                className="w-full sm:w-[140px] h-10 sm:h-9 touch-manipulation"
                aria-label="Filter by performance tier"
              >
                <SelectValue placeholder="Performance">
                  {TIER_LABELS[performanceTier]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="top25">Top 25%</SelectItem>
                <SelectItem value="mid-upper">25-50%</SelectItem>
                <SelectItem value="mid-lower">50-75%</SelectItem>
                <SelectItem value="bottom25">Bottom 25%</SelectItem>
              </SelectContent>
            </Select>

            {/* Spacer to push view toggle and count to the right */}
            <div className="flex-1 min-w-0" />

            {/* Filtered Count Display - Requirement 6.4 */}
            {showFilteredCount && (
              <span 
                id="filter-count"
                className="text-xs text-muted-foreground whitespace-nowrap" 
                aria-live="polite"
                aria-atomic="true"
              >
                {filteredCount} of {totalCount}
              </span>
            )}

            {/* View Mode Toggle - Requirement 4.3, 7.4 */}
            <div 
              className="flex items-center border border-border rounded-md shrink-0"
              role="group"
              aria-label="View mode"
            >
              <Button
                variant={viewMode === "grouped" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleViewModeChange("grouped")}
                className={cn(
                  "rounded-r-none h-9 w-9 sm:h-8 sm:w-8 p-0 touch-manipulation",
                  viewMode === "grouped" && "pointer-events-none"
                )}
                aria-label="Grouped view"
                aria-pressed={viewMode === "grouped"}
              >
                <IconLayoutGrid className="size-4" aria-hidden="true" />
              </Button>
              <Button
                variant={viewMode === "flat" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleViewModeChange("flat")}
                className={cn(
                  "rounded-l-none h-9 w-9 sm:h-8 sm:w-8 p-0 touch-manipulation",
                  viewMode === "flat" && "pointer-events-none"
                )}
                aria-label="List view"
                aria-pressed={viewMode === "flat"}
              >
                <IconLayoutList className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
