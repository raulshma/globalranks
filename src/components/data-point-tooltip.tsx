"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface DataPointTooltipProps {
  title?: string
  items: Array<{
    label: string
    value: string | number
    color?: string
    highlight?: boolean
  }>
  footer?: React.ReactNode
  className?: string
}

/**
 * Tooltip component for displaying data point information in charts
 * Designed to be used with Recharts custom tooltip
 */
export function DataPointTooltip({
  title,
  items,
  footer,
  className,
}: DataPointTooltipProps) {
  return (
    <div
      className={cn(
        "bg-popover border border-border p-3 shadow-md text-popover-foreground",
        className
      )}
      role="tooltip"
    >
      {title && <p className="font-medium text-sm mb-2">{title}</p>}
      <div className="space-y-1">
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center justify-between gap-4 text-xs",
              item.highlight && "font-medium"
            )}
          >
            <span className="flex items-center gap-2">
              {item.color && (
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                />
              )}
              <span className="text-muted-foreground">{item.label}</span>
            </span>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
      {footer && <div className="mt-2 pt-2 border-t border-border">{footer}</div>}
    </div>
  )
}

/**
 * Helper function to format rank with ordinal suffix
 */
export function formatRank(rank: number): string {
  const suffixes = ["th", "st", "nd", "rd"]
  const v = rank % 100
  return rank + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0])
}

/**
 * Helper function to format percentile
 */
export function formatPercentile(percentile: number): string {
  return `${percentile.toFixed(1)}%`
}

/**
 * Helper function to format score
 */
export function formatScore(score: number | null, decimals: number = 2): string {
  if (score === null) return "N/A"
  return score.toFixed(decimals)
}

/**
 * Helper function to get color based on percentile
 */
export function getPercentileColor(percentile: number): string {
  if (percentile >= 75) return "#22c55e" // green
  if (percentile >= 50) return "#eab308" // yellow
  if (percentile >= 25) return "#f97316" // orange
  return "#ef4444" // red
}

/**
 * Helper function to get trend color
 */
export function getTrendColor(change: number): string {
  if (change > 0) return "#22c55e" // green (improvement in rank = negative change)
  if (change < 0) return "#ef4444" // red
  return "#6b7280" // gray
}
