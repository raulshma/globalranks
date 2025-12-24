"use client"

import * as React from "react"
import { Link, useLocation } from "@tanstack/react-router"
import {
  IconChartBar,
  IconChartLine,
  IconGitCompare,
  IconHome,
  IconMenu2,
  IconStack2,
  IconX,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

const navItems: Array<NavItem> = [
  { href: "/", label: "Dashboard", icon: <IconHome className="size-4" /> },
  { href: "/rankings", label: "Rankings", icon: <IconChartBar className="size-4" /> },
  { href: "/compare", label: "Compare", icon: <IconGitCompare className="size-4" /> },
  { href: "/trends", label: "Trends", icon: <IconChartLine className="size-4" /> },
  { href: "/custom-index", label: "Custom Index", icon: <IconStack2 className="size-4" /> },
]

interface NavigationProps {
  isMobileMenuOpen?: boolean
  onMobileMenuToggle?: () => void
}

export function Navigation({ isMobileMenuOpen, onMobileMenuToggle }: NavigationProps) {
  const location = useLocation()

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors",
                "hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMobileMenuToggle}
        aria-expanded={isMobileMenuOpen}
        aria-controls="mobile-navigation"
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMobileMenuOpen ? (
          <IconX className="size-5" />
        ) : (
          <IconMenu2 className="size-5" />
        )}
      </Button>
    </>
  )
}

interface MobileNavigationProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  const location = useLocation()

  // Close menu when route changes
  React.useEffect(() => {
    onClose()
  }, [location.pathname, onClose])

  // Prevent body scroll when menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile Navigation Panel */}
      <nav
        id="mobile-navigation"
        className="fixed inset-x-0 top-14 z-50 border-b border-border bg-background p-4 md:hidden"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors",
                  "hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  "touch-manipulation", // Optimize for touch
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}

interface DomainNavProps {
  domains: Array<{ id: string; name: string; icon: string }>
}

export function DomainNav({ domains }: DomainNavProps) {
  const location = useLocation()

  return (
    <nav 
      className="flex flex-wrap items-center gap-1 overflow-x-auto pb-2 -mb-2 scrollbar-thin"
      role="navigation"
      aria-label="Domain navigation"
    >
      {domains.map((domain) => {
        const href = `/rankings/${domain.id}`
        const isActive = location.pathname === href

        return (
          <Link
            key={domain.id}
            to={href}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1.5 text-xs transition-colors whitespace-nowrap",
              "hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "touch-manipulation min-h-[36px]", // Touch-friendly minimum height
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <span>{domain.icon}</span>
            <span>{domain.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
