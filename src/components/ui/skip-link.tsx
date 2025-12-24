"use client"

import { cn } from "@/lib/utils"

interface SkipLinkProps {
  href?: string
  children?: React.ReactNode
  className?: string
}

/**
 * Skip link component for keyboard navigation
 * Allows users to skip directly to main content
 * Only visible when focused (for keyboard users)
 */
export function SkipLink({ 
  href = "#main-content", 
  children = "Skip to main content",
  className 
}: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "sr-only focus:not-sr-only",
        "focus:fixed focus:top-4 focus:left-4 focus:z-100",
        "focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "text-sm font-medium",
        className
      )}
    >
      {children}
    </a>
  )
}
