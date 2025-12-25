// Settings types for background configuration

// 3D Background Settings
export interface ThreeBackgroundSettings {
  objectVisibility: {
    coinStack: boolean
    natureSymbol: boolean
    innovationSymbol: boolean
    healthSymbol: boolean
    educationSymbol: boolean
    infrastructureSymbol: boolean
    peaceSymbol: boolean
    freedomSymbol: boolean
    sportsSymbol: boolean
    techSymbol: boolean
    lawSymbol: boolean
    energySymbol: boolean
    travelSymbol: boolean
    mediaSymbol: boolean
  }
  starsEnabled: boolean
  sparklesEnabled: boolean
  sparkleCount: number // 50-300
  parallaxIntensity: number // 0-1
}

// Gradient Animation Settings
export interface GradientSettings {
  size: string // "30%" to "100%"
  blendingValue: string // "hard-light", "soft-light", "overlay", "multiply", "screen"
  interactive: boolean
  colorIntensity: number // 0.1 to 1.0 (controls rgba alpha)
}

// Meteor Settings
export interface MeteorSettings {
  enabled: boolean
  count: number // 1-5
  minDelay: number // 2-10 seconds
  maxDelay: number // 5-20 seconds
  minDuration: number // 1-4 seconds
  maxDuration: number // 3-8 seconds
  explosionChance: number // 0-0.5 (0% to 50%)
  tailLength: number // 100-400 px
}

// Combined settings
export interface BackgroundSettingsState {
  threeBackground: ThreeBackgroundSettings
  gradient: GradientSettings
  meteors: MeteorSettings
}

// Default settings
export const defaultSettings: BackgroundSettingsState = {
  threeBackground: {
    objectVisibility: {
      coinStack: true,
      natureSymbol: true,
      innovationSymbol: true,
      healthSymbol: true,
      educationSymbol: true,
      infrastructureSymbol: true,
      peaceSymbol: true,
      freedomSymbol: true,
      sportsSymbol: true,
      techSymbol: true,
      lawSymbol: true,
      energySymbol: true,
      travelSymbol: true,
      mediaSymbol: true,
    },
    starsEnabled: true,
    sparklesEnabled: true,
    sparkleCount: 150,
    parallaxIntensity: 0.5,
  },
  gradient: {
    size: "50%",
    blendingValue: "hard-light",
    interactive: true,
    colorIntensity: 0.4,
  },
  meteors: {
    enabled: true,
    count: 2,
    minDelay: 5,
    maxDelay: 15,
    minDuration: 2,
    maxDuration: 5,
    explosionChance: 0.1,
    tailLength: 200,
  },
}
