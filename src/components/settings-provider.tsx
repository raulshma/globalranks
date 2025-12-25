"use client"

import * as React from "react"
import type {
  BackgroundSettingsState,
  GradientSettings,
  MeteorSettings,
  ThreeBackgroundSettings} from "@/lib/settings-types";
import {
  defaultSettings
} from "@/lib/settings-types"

const STORAGE_KEY = "global-indicies-settings"

interface SettingsContextValue {
  settings: BackgroundSettingsState
  updateThreeBackground: (updates: Partial<ThreeBackgroundSettings>) => void
  updateThreeObjectVisibility: (key: keyof ThreeBackgroundSettings["objectVisibility"], value: boolean) => void
  updateGradient: (updates: Partial<GradientSettings>) => void
  updateMeteors: (updates: Partial<MeteorSettings>) => void
  resetToDefaults: () => void
}

const SettingsContext = React.createContext<SettingsContextValue | undefined>(undefined)

function loadSettings(): BackgroundSettingsState {
  if (typeof window === "undefined") return defaultSettings
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Deep merge with defaults to handle new settings added later
      return {
        threeBackground: { ...defaultSettings.threeBackground, ...parsed.threeBackground, objectVisibility: { ...defaultSettings.threeBackground.objectVisibility, ...parsed.threeBackground?.objectVisibility } },
        gradient: { ...defaultSettings.gradient, ...parsed.gradient },
        meteors: { ...defaultSettings.meteors, ...parsed.meteors },
      }
    }
  } catch (e) {
    console.error("Failed to load settings:", e)
  }
  return defaultSettings
}

function saveSettings(settings: BackgroundSettingsState) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (e) {
    console.error("Failed to save settings:", e)
  }
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<BackgroundSettingsState>(defaultSettings)
  const [mounted, setMounted] = React.useState(false)

  // Load settings on mount
  React.useEffect(() => {
    setSettings(loadSettings())
    setMounted(true)
  }, [])

  // Save settings when they change (after initial mount)
  React.useEffect(() => {
    if (mounted) {
      saveSettings(settings)
    }
  }, [settings, mounted])

  const updateThreeBackground = React.useCallback((updates: Partial<ThreeBackgroundSettings>) => {
    setSettings((prev) => ({
      ...prev,
      threeBackground: { ...prev.threeBackground, ...updates },
    }))
  }, [])

  const updateThreeObjectVisibility = React.useCallback(
    (key: keyof ThreeBackgroundSettings["objectVisibility"], value: boolean) => {
      setSettings((prev) => ({
        ...prev,
        threeBackground: {
          ...prev.threeBackground,
          objectVisibility: { ...prev.threeBackground.objectVisibility, [key]: value },
        },
      }))
    },
    []
  )

  const updateGradient = React.useCallback((updates: Partial<GradientSettings>) => {
    setSettings((prev) => ({
      ...prev,
      gradient: { ...prev.gradient, ...updates },
    }))
  }, [])

  const updateMeteors = React.useCallback((updates: Partial<MeteorSettings>) => {
    setSettings((prev) => ({
      ...prev,
      meteors: { ...prev.meteors, ...updates },
    }))
  }, [])

  const resetToDefaults = React.useCallback(() => {
    setSettings(defaultSettings)
  }, [])

  const value = React.useMemo(
    () => ({
      settings,
      updateThreeBackground,
      updateThreeObjectVisibility,
      updateGradient,
      updateMeteors,
      resetToDefaults,
    }),
    [settings, updateThreeBackground, updateThreeObjectVisibility, updateGradient, updateMeteors, resetToDefaults]
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const context = React.useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
