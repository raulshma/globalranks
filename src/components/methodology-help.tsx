"use client"

import * as React from "react"
import { IconHelp, IconX } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MethodologyHelpProps {
  title: string
  description?: string
  methodology?: string
  scoreRange?: { min: number; max: number }
  higherIsBetter?: boolean
  updateFrequency?: string
  source?: string
  sourceUrl?: string
  className?: string
}

/**
 * Methodology help panel that can be toggled to show detailed information
 * about how a ranking index is calculated
 */
export function MethodologyHelp({
  title,
  description,
  methodology,
  scoreRange,
  higherIsBetter,
  updateFrequency,
  source,
  sourceUrl,
  className,
}: MethodologyHelpProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="text-muted-foreground hover:text-foreground gap-1"
        aria-expanded={isOpen}
        aria-controls="methodology-panel"
      >
        <IconHelp className="size-4" aria-hidden="true" />
        <span className="text-xs">How is this calculated?</span>
      </Button>

      {isOpen && (
        <Card
          id="methodology-panel"
          className="absolute top-full left-0 mt-2 z-50 w-80 sm:w-96 shadow-lg"
          role="region"
          aria-label="Methodology information"
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-sm">{title}</CardTitle>
                {description && (
                  <CardDescription className="text-xs mt-1">
                    {description}
                  </CardDescription>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setIsOpen(false)}
                aria-label="Close methodology panel"
              >
                <IconX className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {methodology && (
              <div>
                <p className="font-medium text-muted-foreground mb-1">Methodology</p>
                <p>{methodology}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {scoreRange && (
                <div>
                  <p className="font-medium text-muted-foreground mb-1">Score Range</p>
                  <p>
                    {scoreRange.min} - {scoreRange.max}
                  </p>
                </div>
              )}

              {higherIsBetter !== undefined && (
                <div>
                  <p className="font-medium text-muted-foreground mb-1">Interpretation</p>
                  <p>{higherIsBetter ? "Higher is better" : "Lower is better"}</p>
                </div>
              )}

              {updateFrequency && (
                <div>
                  <p className="font-medium text-muted-foreground mb-1">Update Frequency</p>
                  <p className="capitalize">{updateFrequency}</p>
                </div>
              )}

              {source && (
                <div>
                  <p className="font-medium text-muted-foreground mb-1">Source</p>
                  {sourceUrl ? (
                    <a
                      href={sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {source}
                    </a>
                  ) : (
                    <p>{source}</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

/**
 * Compact help icon that shows methodology on hover
 */
interface MethodologyIconProps {
  methodology: string
  className?: string
}

export function MethodologyIcon({ methodology, className }: MethodologyIconProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const tooltipId = React.useId()

  return (
    <div className={cn("relative inline-flex", className)}>
      <button
        type="button"
        className="text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        aria-describedby={isVisible ? tooltipId : undefined}
        aria-label="View methodology"
      >
        <IconHelp className="size-4" aria-hidden="true" />
      </button>

      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64 p-3 text-xs bg-popover text-popover-foreground border border-border shadow-md"
        >
          <p className="font-medium mb-1">Methodology</p>
          <p className="text-muted-foreground">{methodology}</p>
        </div>
      )}
    </div>
  )
}
