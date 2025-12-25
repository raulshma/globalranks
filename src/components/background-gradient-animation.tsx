"use client"

import { cn } from "@/lib/utils"
import { useTheme } from "./theme-provider"
import { useSettings } from "./settings-provider"
import { useEffect, useState } from "react"

interface BackgroundGradientAnimationProps {
  gradientBackgroundStart?: string
  gradientBackgroundEnd?: string
  firstColor?: string
  secondColor?: string
  thirdColor?: string
  fourthColor?: string
  fifthColor?: string
  pointerColor?: string
  children?: React.ReactNode
  className?: string
  containerClassName?: string
}

export function BackgroundGradientAnimation({
  gradientBackgroundStart,
  gradientBackgroundEnd,
  firstColor,
  secondColor,
  thirdColor,
  fourthColor,
  fifthColor,
  pointerColor,
  children,
  className,
  containerClassName,
}: BackgroundGradientAnimationProps) {
  const { theme } = useTheme()
  const { settings } = useSettings()
  const { size, blendingValue, interactive, colorIntensity } = settings.gradient
  const [mounted, setMounted] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })

  // Resolve system theme
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    setMounted(true)
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    
    const updateTheme = () => {
      if (theme === 'system') {
        setResolvedTheme(media.matches ? 'dark' : 'light')
      } else {
        setResolvedTheme(theme)
      }
    }

    updateTheme()
    media.addEventListener('change', updateTheme) 
    return () => media.removeEventListener('change', updateTheme)
  }, [theme])

  useEffect(() => {
    if (!interactive) return

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [interactive])

  if (!mounted) return null

  const isDark = resolvedTheme === 'dark'

  // Theme-aware color defaults
  const bgStart = gradientBackgroundStart || (isDark ? "rgb(2, 6, 23)" : "rgb(248, 250, 252)")
  const bgEnd = gradientBackgroundEnd || (isDark ? "rgb(15, 23, 42)" : "rgb(241, 245, 249)")
  
  const color1 = firstColor || (isDark ? "18, 113, 255" : "59, 130, 246")
  const color2 = secondColor || (isDark ? "221, 74, 255" : "168, 85, 247")
  const color3 = thirdColor || (isDark ? "100, 220, 255" : "34, 211, 238")
  const color4 = fourthColor || (isDark ? "200, 50, 50" : "244, 63, 94")
  const color5 = fifthColor || (isDark ? "180, 180, 50" : "234, 179, 8")
  const ptrColor = pointerColor || (isDark ? "140, 100, 255" : "99, 102, 241")

  // Use color intensity from settings
  const intensity = colorIntensity

  return (
    <div
      className={cn(
        "fixed inset-0 -z-10 overflow-hidden pointer-events-none transition-colors duration-700",
        containerClassName
      )}
      style={{
        background: `linear-gradient(40deg, ${bgStart}, ${bgEnd})`,
      }}
    >
      <svg className="hidden">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div
        className={cn("gradients-container h-full w-full blur-lg", className)}
        style={
          {
            "--gradient-size": size,
            "--blending-value": blendingValue,
            "--color-intensity": intensity,
            "--first-color": color1,
            "--second-color": color2,
            "--third-color": color3,
            "--fourth-color": color4,
            "--fifth-color": color5,
            "--pointer-color": ptrColor,
            "--pointer-x": `${cursorPosition.x}px`,
            "--pointer-y": `${cursorPosition.y}px`,
          } as React.CSSProperties
        }
      >
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,rgba(var(--first-color),var(--color-intensity))_0,rgba(var(--first-color),0)_50%)_no-repeat]`,
            "[mix-blend-mode:var(--blending-value)] w-(--gradient-size) h-(--gradient-size)",
            "top-[calc(40%-var(--gradient-size)/2)] left-[calc(40%-var(--gradient-size)/2)]",
            "animate-first opacity-100"
          )}
        />
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,rgba(var(--second-color),var(--color-intensity))_0,rgba(var(--second-color),0)_50%)_no-repeat]`,
            "[mix-blend-mode:var(--blending-value)] w-(--gradient-size) h-(--gradient-size)",
            "top-[calc(30%-var(--gradient-size)/2)] left-[calc(30%-var(--gradient-size)/2)]",
            "animate-second opacity-100"
          )}
        />
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,rgba(var(--third-color),var(--color-intensity))_0,rgba(var(--third-color),0)_50%)_no-repeat]`,
            "[mix-blend-mode:var(--blending-value)] w-(--gradient-size) h-(--gradient-size)",
            "top-[calc(60%-var(--gradient-size)/2)] left-[calc(60%-var(--gradient-size)/2)]",
            "animate-third opacity-100"
          )}
        />
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,rgba(var(--fourth-color),var(--color-intensity))_0,rgba(var(--fourth-color),0)_50%)_no-repeat]`,
            "[mix-blend-mode:var(--blending-value)] w-(--gradient-size) h-(--gradient-size)",
            "top-[calc(10%-var(--gradient-size)/2)] left-[calc(10%-var(--gradient-size)/2)]",
            "animate-fourth opacity-100"
          )}
        />
        <div
          className={cn(
            `absolute [background:radial-gradient(circle_at_center,rgba(var(--fifth-color),var(--color-intensity))_0,rgba(var(--fifth-color),0)_50%)_no-repeat]`,
            "[mix-blend-mode:var(--blending-value)] w-(--gradient-size) h-(--gradient-size)",
            "top-[calc(70%-var(--gradient-size)/2)] left-[calc(70%-var(--gradient-size)/2)]",
            "animate-fifth opacity-100"
          )}
        />

        {interactive && (
          <div
            className={cn(
              `absolute [background:radial-gradient(circle_at_center,rgba(var(--pointer-color),var(--color-intensity))_0,rgba(var(--pointer-color),0)_50%)_no-repeat]`,
              "[mix-blend-mode:var(--blending-value)] w-full h-full",
              "opacity-70"
            )}
            style={{
              top: `calc(var(--pointer-y) - 50%)`,
              left: `calc(var(--pointer-x) - 50%)`,
            }}
          />
        )}
      </div>
      {children}
    </div>
  )
}
