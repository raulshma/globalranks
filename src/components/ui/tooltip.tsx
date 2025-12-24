"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  side?: "top" | "bottom" | "left" | "right"
  align?: "start" | "center" | "end"
  delayDuration?: number
  className?: string
}

/**
 * Simple tooltip component for displaying additional information on hover/focus
 * Accessible and keyboard-friendly
 */
export function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  delayDuration = 300,
  className,
}: TooltipProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [position, setPosition] = React.useState({ top: 0, left: 0 })
  const triggerRef = React.useRef<HTMLDivElement>(null)
  const tooltipRef = React.useRef<HTMLDivElement>(null)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const showTooltip = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setIsOpen(true)
    }, delayDuration)
  }, [delayDuration])

  const hideTooltip = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsOpen(false)
  }, [])

  // Calculate position when tooltip opens
  React.useEffect(() => {
    if (isOpen && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      
      let top = 0
      let left = 0

      // Calculate vertical position
      switch (side) {
        case "top":
          top = triggerRect.top - tooltipRect.height - 8
          break
        case "bottom":
          top = triggerRect.bottom + 8
          break
        case "left":
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
          break
        case "right":
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
          break
      }

      // Calculate horizontal position
      switch (side) {
        case "top":
        case "bottom":
          switch (align) {
            case "start":
              left = triggerRect.left
              break
            case "center":
              left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
              break
            case "end":
              left = triggerRect.right - tooltipRect.width
              break
          }
          break
        case "left":
          left = triggerRect.left - tooltipRect.width - 8
          break
        case "right":
          left = triggerRect.right + 8
          break
      }

      // Keep tooltip within viewport
      const padding = 8
      left = Math.max(padding, Math.min(left, window.innerWidth - tooltipRect.width - padding))
      top = Math.max(padding, Math.min(top, window.innerHeight - tooltipRect.height - padding))

      setPosition({ top, left })
    }
  }, [isOpen, side, align])

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const tooltipId = React.useId()

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        aria-describedby={isOpen ? tooltipId : undefined}
        className="inline-flex"
      >
        {children}
      </div>
      {isOpen && (
        <div
          ref={tooltipRef}
          id={tooltipId}
          role="tooltip"
          className={cn(
            "fixed z-50 px-3 py-1.5 text-xs bg-popover text-popover-foreground border border-border shadow-md",
            "animate-in fade-in-0 zoom-in-95 duration-100",
            className
          )}
          style={{
            top: position.top,
            left: position.left,
          }}
        >
          {content}
        </div>
      )}
    </>
  )
}

/**
 * Simple inline tooltip trigger with question mark icon
 */
interface HelpTooltipProps {
  content: React.ReactNode
  className?: string
}

export function HelpTooltip({ content, className }: HelpTooltipProps) {
  return (
    <Tooltip content={content}>
      <button
        type="button"
        className={cn(
          "inline-flex items-center justify-center size-4 rounded-full",
          "bg-muted text-muted-foreground hover:bg-muted/80",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "text-[10px] font-medium",
          className
        )}
        aria-label="Help"
      >
        ?
      </button>
    </Tooltip>
  )
}
