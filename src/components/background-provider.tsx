"use client"

import * as React from "react"

type BackgroundType = "3d" | "gradient"

interface BackgroundProviderProps {
  children: React.ReactNode
  defaultBackground?: BackgroundType
  storageKey?: string
}

interface BackgroundProviderState {
  background: BackgroundType
  setBackground: (background: BackgroundType) => void
}

const BackgroundProviderContext = React.createContext<BackgroundProviderState | undefined>(
  undefined
)

export function BackgroundProvider({
  children,
  defaultBackground = "3d",
  storageKey = "global-indicies-background",
}: BackgroundProviderProps) {
  const [background, setBackground] = React.useState<BackgroundType>(() => {
    // On client, read from localStorage immediately
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey)
      if (stored !== null) {
        return stored as BackgroundType
      }
    }
    return defaultBackground
  })

  const value = React.useMemo(
    () => ({
      background,
      setBackground: (newBackground: BackgroundType) => {
        localStorage.setItem(storageKey, newBackground)
        setBackground(newBackground)
      },
    }),
    [background, storageKey]
  )

  return (
    <BackgroundProviderContext.Provider value={value}>
      {children}
    </BackgroundProviderContext.Provider>
  )
}

export function useBackground() {
  const context = React.useContext(BackgroundProviderContext)

  if (context === undefined) {
    throw new Error("useBackground must be used within a BackgroundProvider")
  }

  return context
}
