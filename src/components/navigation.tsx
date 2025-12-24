"use client"

import { Link, useLocation } from "@tanstack/react-router"
import {
  IconChartBar,
  IconChartLine,
  IconGitCompare,
  IconHome,
  IconStack2,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

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

export function Navigation() {
  const location = useLocation()

  return (
    <nav className="flex items-center gap-1">
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
              "hover:bg-muted hover:text-foreground",
              isActive
                ? "bg-muted text-foreground"
                : "text-muted-foreground"
            )}
          >
            {item.icon}
            <span className="hidden sm:inline">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

interface DomainNavProps {
  domains: Array<{ id: string; name: string; icon: string }>
}

export function DomainNav({ domains }: DomainNavProps) {
  const location = useLocation()

  return (
    <nav className="flex flex-wrap items-center gap-1">
      {domains.map((domain) => {
        const href = `/rankings/${domain.id}`
        const isActive = location.pathname === href

        return (
          <Link
            key={domain.id}
            to={href}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 text-xs transition-colors",
              "hover:bg-muted hover:text-foreground",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            )}
          >
            <span>{domain.icon}</span>
            <span>{domain.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
