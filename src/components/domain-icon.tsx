import {
  IconBooks,
  IconBuildingMonument,
  IconBuildingSkyscraper,
  IconBulb,
  IconCoin,
  IconCpu,
  IconFirstAidKit,
  IconMoodSmile,
  IconPlant,
  IconQuestionMark,
  IconShieldHalf,
  IconTrophy,
  IconUsers,
  IconWorld,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

export const ICON_MAP = {
  coin: IconCoin,
  books: IconBooks,
  "first-aid-kit": IconFirstAidKit,
  bulb: IconBulb,
  "building-government": IconBuildingMonument,
  world: IconWorld,
  "building-skyscraper": IconBuildingSkyscraper,
  cpu: IconCpu,
  "shield-half": IconShieldHalf,
  trophy: IconTrophy,
  "mood-smile": IconMoodSmile,
  users: IconUsers,
  plant: IconPlant,
  // Fallbacks for existing DB data (emojis)
  "💰": IconCoin,
  "📚": IconBooks,
  "🏥": IconFirstAidKit,
  "💡": IconBulb,
  "🏛️": IconBuildingMonument,
  "🌍": IconWorld,
  "🏗️": IconBuildingSkyscraper,
  "🖥️": IconCpu,
  "🛡️": IconShieldHalf,
  "🏆": IconTrophy,
  "😊": IconMoodSmile,
  "👥": IconUsers,
  "🌱": IconPlant,
} as const

export interface DomainIconProps {
  icon: string
  className?: string
}

export function DomainIcon({ icon, className }: DomainIconProps) {
  const Component = ICON_MAP[icon as keyof typeof ICON_MAP]
  return <Component className={cn("size-6", className)} />
}
