"use client"

import { IconExternalLink, IconInfoCircle } from "@tabler/icons-react"
import { Tooltip } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface SourceCitationProps {
  source: string
  sourceUrl?: string
  methodology?: string
  lastUpdated?: Date | string
  className?: string
  variant?: "inline" | "block" | "icon"
}

/**
 * Source citation component for displaying data source information
 * Shows source name with optional link, methodology, and last updated date
 */
export function SourceCitation({
  source,
  sourceUrl,
  methodology,
  lastUpdated,
  className,
  variant = "inline",
}: SourceCitationProps) {
  const formattedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      })
    : null

  const tooltipContent = (
    <div className="max-w-xs space-y-2">
      <div>
        <p className="font-medium text-sm">{source}</p>
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-xs flex items-center gap-1 mt-1"
            onClick={(e) => e.stopPropagation()}
          >
            View official source
            <IconExternalLink className="size-3" aria-hidden="true" />
          </a>
        )}
      </div>
      {methodology && (
        <div>
          <p className="text-muted-foreground text-xs font-medium">Methodology</p>
          <p className="text-xs">{methodology}</p>
        </div>
      )}
      {formattedDate && (
        <p className="text-muted-foreground text-xs">Last updated: {formattedDate}</p>
      )}
    </div>
  )

  if (variant === "icon") {
    return (
      <Tooltip content={tooltipContent}>
        <button
          type="button"
          className={cn(
            "inline-flex items-center justify-center size-4",
            "text-muted-foreground hover:text-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded",
            className
          )}
          aria-label={`Source: ${source}`}
        >
          <IconInfoCircle className="size-4" aria-hidden="true" />
        </button>
      </Tooltip>
    )
  }

  if (variant === "block") {
    return (
      <div className={cn("text-xs text-muted-foreground", className)}>
        <div className="flex items-center gap-2">
          <span>Source:</span>
          {sourceUrl ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-1"
            >
              {source}
              <IconExternalLink className="size-3" aria-hidden="true" />
            </a>
          ) : (
            <span>{source}</span>
          )}
          {methodology && (
            <Tooltip content={methodology}>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground"
                aria-label="View methodology"
              >
                <IconInfoCircle className="size-3" aria-hidden="true" />
              </button>
            </Tooltip>
          )}
        </div>
        {formattedDate && <p className="mt-1">Last updated: {formattedDate}</p>}
      </div>
    )
  }

  // Inline variant (default)
  return (
    <Tooltip content={tooltipContent}>
      <span
        className={cn(
          "inline-flex items-center gap-1 text-xs text-muted-foreground",
          "cursor-help border-b border-dotted border-muted-foreground/50",
          className
        )}
      >
        {source}
        <IconInfoCircle className="size-3" aria-hidden="true" />
      </span>
    </Tooltip>
  )
}
