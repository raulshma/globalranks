"use client"

import * as React from "react"

interface SRAnnouncerContextValue {
  announce: (message: string, priority?: "polite" | "assertive") => void
}

const SRAnnouncerContext = React.createContext<SRAnnouncerContextValue | null>(null)

/**
 * Hook to announce messages to screen readers
 * Use for dynamic content updates that need to be communicated to assistive technology
 */
export function useAnnounce() {
  const context = React.useContext(SRAnnouncerContext)
  if (!context) {
    throw new Error("useAnnounce must be used within SRAnnouncerProvider")
  }
  return context.announce
}

interface SRAnnouncerProviderProps {
  children: React.ReactNode
}

/**
 * Provider component that enables screen reader announcements
 * Wrap your app with this to enable the useAnnounce hook
 */
export function SRAnnouncerProvider({ children }: SRAnnouncerProviderProps) {
  const [politeMessage, setPoliteMessage] = React.useState("")
  const [assertiveMessage, setAssertiveMessage] = React.useState("")

  const announce = React.useCallback((message: string, priority: "polite" | "assertive" = "polite") => {
    if (priority === "assertive") {
      setAssertiveMessage("")
      // Small delay to ensure the change is detected
      setTimeout(() => setAssertiveMessage(message), 50)
    } else {
      setPoliteMessage("")
      setTimeout(() => setPoliteMessage(message), 50)
    }
  }, [])

  const value = React.useMemo(() => ({ announce }), [announce])

  return (
    <SRAnnouncerContext.Provider value={value}>
      {children}
      {/* Polite announcements - read when user is idle */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {politeMessage}
      </div>
      {/* Assertive announcements - interrupt current speech */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {assertiveMessage}
      </div>
    </SRAnnouncerContext.Provider>
  )
}

/**
 * Standalone component for simple announcements without context
 * Use when you need a one-off announcement in a specific component
 */
interface SROnlyProps {
  children: React.ReactNode
  role?: "status" | "alert" | "log"
  "aria-live"?: "polite" | "assertive" | "off"
}

export function SROnly({ 
  children, 
  role = "status", 
  "aria-live": ariaLive = "polite" 
}: SROnlyProps) {
  return (
    <span 
      role={role} 
      aria-live={ariaLive} 
      aria-atomic="true" 
      className="sr-only"
    >
      {children}
    </span>
  )
}
