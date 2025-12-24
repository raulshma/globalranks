"use client"

import { IconMoon, IconSun } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button 
            variant="ghost" 
            size="icon-sm"
            aria-label={`Current theme: ${theme}. Click to change theme`}
          >
            <IconSun 
              className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" 
              aria-hidden="true"
            />
            <IconMoon 
              className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" 
              aria-hidden="true"
            />
            <span className="sr-only">Toggle theme</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" aria-label="Theme options">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          aria-current={theme === "light" ? "true" : undefined}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          aria-current={theme === "dark" ? "true" : undefined}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          aria-current={theme === "system" ? "true" : undefined}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
