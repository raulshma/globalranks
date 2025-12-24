"use client"

import * as React from "react"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { IconFilter, IconX } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Domain {
  id: string
  name: string
  description: string
  icon: string
}

interface FilterOptions {
  domains: Array<Domain>
  sources: Array<string>
  years: Array<number>
}

interface FilterPanelProps {
  filterOptions: FilterOptions
  className?: string
}

interface FilterState {
  domain?: string
  yearStart?: number
  yearEnd?: number
  source?: string
}

/**
 * FilterPanel component for filtering rankings by domain, year range, and source
 * Uses TanStack Router search params for filter state
 * Requirements: 2.3, 2.5
 */
export function FilterPanel({ filterOptions, className }: FilterPanelProps) {
  const navigate = useNavigate()
  const search: FilterState & Record<string, unknown> = useSearch({ strict: false })

  // Extract current filter values from URL search params
  const currentDomain = search.domain
  const currentYearStart = search.yearStart
  const currentYearEnd = search.yearEnd
  const currentSource = search.source

  // Count active filters
  const activeFilterCount = [
    currentDomain,
    currentYearStart,
    currentYearEnd,
    currentSource,
  ].filter((v) => v !== undefined).length

  // Update URL search params when filter changes
  const updateFilter = React.useCallback(
    (key: keyof FilterState, value: string | number | undefined) => {
      void navigate({
        to: ".",
        search: (prev: Record<string, unknown>) => {
          const newSearch = { ...prev }
          if (value === undefined || value === "") {
            delete newSearch[key]
          } else {
            newSearch[key] = value
          }
          return newSearch
        },
      })
    },
    [navigate]
  )

  // Clear all filters
  const clearAllFilters = React.useCallback(() => {
    void navigate({
      to: ".",
      search: (prev: Record<string, unknown>) => {
        const newSearch = { ...prev }
        delete newSearch.domain
        delete newSearch.yearStart
        delete newSearch.yearEnd
        delete newSearch.source
        return newSearch
      },
    })
  }, [navigate])

  // Get domain name for display
  const getDomainName = (domainId: string) => {
    const domain = filterOptions.domains.find((d) => d.id === domainId)
    return domain?.name ?? domainId
  }

  // Get selected domain label
  const getSelectedDomainLabel = () => {
    if (!currentDomain) return undefined
    return getDomainName(currentDomain)
  }

  // Get selected year label
  const getSelectedYearStartLabel = () => {
    if (!currentYearStart) return undefined
    return currentYearStart.toString()
  }

  const getSelectedYearEndLabel = () => {
    if (!currentYearEnd) return undefined
    return currentYearEnd.toString()
  }

  // Get selected source label
  const getSelectedSourceLabel = () => {
    if (!currentSource) return undefined
    return currentSource
  }

  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3">
        {/* Filter icon and label */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <IconFilter className="size-4" aria-hidden="true" />
          <span className="text-xs font-medium">Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5">
              {activeFilterCount}
            </Badge>
          )}
        </div>

        {/* Filter controls - stack on mobile, row on larger screens */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full sm:w-auto">
          {/* Domain filter */}
          <Select
            value={currentDomain ?? ""}
            onValueChange={(value) => updateFilter("domain", value || undefined)}
          >
            <SelectTrigger className="w-full sm:w-40" aria-label="Filter by domain">
              <SelectValue placeholder="All domains">
                {getSelectedDomainLabel() ?? "All domains"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All domains</SelectItem>
              {filterOptions.domains.map((domain) => (
                <SelectItem key={domain.id} value={domain.id}>
                  {domain.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Year range filters - side by side on mobile */}
          <div className="flex gap-2">
            {/* Year start filter */}
            <Select
              value={currentYearStart?.toString() ?? ""}
              onValueChange={(value) =>
                updateFilter("yearStart", value ? parseInt(value, 10) : undefined)
              }
            >
              <SelectTrigger className="w-full sm:w-28" aria-label="Filter from year">
                <SelectValue placeholder="From year">
                  {getSelectedYearStartLabel() ?? "From year"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">From year</SelectItem>
                {filterOptions.years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Year end filter */}
            <Select
              value={currentYearEnd?.toString() ?? ""}
              onValueChange={(value) =>
                updateFilter("yearEnd", value ? parseInt(value, 10) : undefined)
              }
            >
              <SelectTrigger className="w-full sm:w-28" aria-label="Filter to year">
                <SelectValue placeholder="To year">
                  {getSelectedYearEndLabel() ?? "To year"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">To year</SelectItem>
                {filterOptions.years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Source filter */}
          <Select
            value={currentSource ?? ""}
            onValueChange={(value) => updateFilter("source", value || undefined)}
          >
            <SelectTrigger className="w-full sm:w-48" aria-label="Filter by source">
              <SelectValue placeholder="All sources">
                {getSelectedSourceLabel() ?? "All sources"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All sources</SelectItem>
              {filterOptions.sources.map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear all button */}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Clear all filters"
          >
            <IconX className="size-3" aria-hidden="true" />
            Clear all
          </Button>
        )}
      </div>

      {/* Active filter badges */}
      {activeFilterCount > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Active:</span>
          
          {currentDomain && (
            <Badge variant="outline" className="gap-1">
              Domain: {getDomainName(currentDomain)}
              <button
                onClick={() => updateFilter("domain", undefined)}
                className="ml-1 hover:text-destructive"
              >
                <IconX className="size-3" />
              </button>
            </Badge>
          )}
          
          {currentYearStart && (
            <Badge variant="outline" className="gap-1">
              From: {currentYearStart}
              <button
                onClick={() => updateFilter("yearStart", undefined)}
                className="ml-1 hover:text-destructive"
              >
                <IconX className="size-3" />
              </button>
            </Badge>
          )}
          
          {currentYearEnd && (
            <Badge variant="outline" className="gap-1">
              To: {currentYearEnd}
              <button
                onClick={() => updateFilter("yearEnd", undefined)}
                className="ml-1 hover:text-destructive"
              >
                <IconX className="size-3" />
              </button>
            </Badge>
          )}
          
          {currentSource && (
            <Badge variant="outline" className="gap-1">
              Source: {currentSource}
              <button
                onClick={() => updateFilter("source", undefined)}
                className="ml-1 hover:text-destructive"
              >
                <IconX className="size-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
