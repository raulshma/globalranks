/**
 * GroupedIndicesView component
 * Displays indices organized by domain with collapsible sections
 * Requirements: 4.1, 4.2, 5.2, 7.4
 */

import * as React from "react"
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react"

import type { DomainRankingGroup } from "@/lib/server-functions/country-rankings"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IndexRankingCard } from "@/components/index-ranking-card"
import { cn } from "@/lib/utils"

export interface GroupedIndicesViewProps {
  groups: Array<DomainRankingGroup>
}

/**
 * Collapsible domain section component
 * On mobile, sections are collapsible for better navigation
 * Requirement 7.4: Collapsible domain sections on mobile
 */
interface DomainSectionProps {
  group: DomainRankingGroup
  defaultExpanded?: boolean
}

function DomainSection({ group, defaultExpanded = true }: DomainSectionProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)
  const contentId = `domain-content-${group.domainId}`
  const headerId = `domain-header-${group.domainId}`

  return (
    <div className="border-b border-border pb-6 last:border-b-0 last:pb-0">
      {/* Domain Header - Requirement 4.2, 5.2, 7.4 */}
      <div className="flex items-center gap-2 mb-4">
        {/* Collapse toggle - visible on mobile */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden -ml-2 p-1 h-auto touch-manipulation"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-controls={contentId}
          aria-label={`${isExpanded ? "Collapse" : "Expand"} ${group.domainName} section`}
        >
          {isExpanded ? (
            <IconChevronDown className="size-5" aria-hidden="true" />
          ) : (
            <IconChevronRight className="size-5" aria-hidden="true" />
          )}
        </Button>

        <a
          id={headerId}
          href={`/rankings/${group.domainId}`}
          className="flex items-center gap-2 hover:text-primary transition-colors flex-1 min-w-0"
        >
          <span className="text-xl shrink-0" aria-hidden="true">{group.domainIcon}</span>
          <h2 className="text-base sm:text-lg font-semibold truncate">{group.domainName}</h2>
          <Badge variant="secondary" className="shrink-0 ml-auto sm:ml-2">
            {group.rankings.length} {group.rankings.length === 1 ? "index" : "indices"}
          </Badge>
        </a>
      </div>

      {/* Index Cards Grid - Requirement 7.4: Mobile-friendly card layout */}
      <div
        id={contentId}
        role="region"
        aria-labelledby={headerId}
        className={cn(
          "grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          // Collapse animation on mobile
          "transition-all duration-200 ease-in-out",
          !isExpanded && "hidden md:grid"
        )}
      >
        {group.rankings.map((ranking) => (
          <IndexRankingCard key={ranking.indexId} ranking={ranking} />
        ))}
      </div>
    </div>
  )
}

/**
 * Grouped indices view - displays indices organized by domain
 * 
 * Features:
 * - Domain sections with header (name, icon) - Requirement 4.2
 * - IndexRankingCard for each ranking in domain
 * - Domain header links to domain detail page - Requirement 5.2
 * - Indices grouped by domain category - Requirement 4.1
 * - Collapsible sections on mobile - Requirement 7.4
 * - Responsive grid layout - Requirement 7.4
 */
export function GroupedIndicesView({ groups }: GroupedIndicesViewProps) {
  return (
    <div className="space-y-6" role="list" aria-label="Rankings grouped by domain">
      {groups.map((group, index) => (
        <div key={group.domainId} role="listitem">
          <DomainSection 
            group={group} 
            // First 3 groups expanded by default, rest collapsed on mobile
            defaultExpanded={index < 3}
          />
        </div>
      ))}
    </div>
  )
}
