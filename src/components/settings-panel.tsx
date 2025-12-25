"use client"

import { IconSettings, IconRefresh, IconCube, IconWaveSine, IconMeteor } from "@tabler/icons-react"
import { useSettings } from "./settings-provider"
import { useBackground } from "./background-provider"
import { Button } from "./ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import { Slider } from "./ui/slider"
import { Switch } from "./ui/switch"
import { Tooltip } from "./ui/tooltip"
import { Separator } from "./ui/separator"

// Object visibility labels for the 3D background
const objectLabels: Record<string, string> = {
  coinStack: "Coin Stack (Economy)",
  natureSymbol: "Nature (Environment)",
  innovationSymbol: "Innovation",
  healthSymbol: "Health",
  educationSymbol: "Education",
  infrastructureSymbol: "Infrastructure",
  peaceSymbol: "Peace",
  freedomSymbol: "Freedom",
  sportsSymbol: "Sports",
  techSymbol: "Technology",
  lawSymbol: "Law",
  energySymbol: "Energy",
  travelSymbol: "Travel",
  mediaSymbol: "Media",
}

// Blend mode options
const blendModes = [
  { value: "hard-light", label: "Hard Light" },
  { value: "soft-light", label: "Soft Light" },
  { value: "overlay", label: "Overlay" },
  { value: "multiply", label: "Multiply" },
  { value: "screen", label: "Screen" },
]

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}

function SliderSetting({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  displayValue,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  displayValue?: string
}) {
  return (
    <div className="py-2 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-medium tabular-nums">{displayValue ?? value}</span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(val) => {
          const numVal = Array.isArray(val) ? val[0] : val
          onChange(numVal)
        }}
      />
    </div>
  )
}

function SectionTitle({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 pt-4 pb-2">
      <Icon className="size-4 text-primary" />
      <h3 className="font-semibold text-sm">{children}</h3>
    </div>
  )
}

export function SettingsPanel() {
  const { settings, updateThreeBackground, updateThreeObjectVisibility, updateGradient, updateMeteors, resetToDefaults } = useSettings()
  const { background } = useBackground()

  return (
    <Sheet>
      <Tooltip content="Background Settings">
        <SheetTrigger
          render={<Button variant="ghost" size="icon" className="size-9" />}
        >
          <IconSettings className="size-5" />
          <span className="sr-only">Background Settings</span>
        </SheetTrigger>
      </Tooltip>
      <SheetContent side="right" className="overflow-y-auto p-4">
        <SheetHeader>
          <SheetTitle>Background Settings</SheetTitle>
          <SheetDescription>
            Customize the appearance of the background and visual effects.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-1">
          {/* 3D Background Settings */}
          {background === "3d" && (
            <>
              <SectionTitle icon={IconCube}>3D Background</SectionTitle>
              
              <SettingRow label="Stars">
                <Switch
                  checked={settings.threeBackground.starsEnabled}
                  onCheckedChange={(checked: boolean) => updateThreeBackground({ starsEnabled: checked })}
                />
              </SettingRow>

              <SettingRow label="Sparkles">
                <Switch
                  checked={settings.threeBackground.sparklesEnabled}
                  onCheckedChange={(checked: boolean) => updateThreeBackground({ sparklesEnabled: checked })}
                />
              </SettingRow>

              {settings.threeBackground.sparklesEnabled && (
                <SliderSetting
                  label="Sparkle Count"
                  value={settings.threeBackground.sparkleCount}
                  min={50}
                  max={300}
                  step={10}
                  onChange={(v: number) => updateThreeBackground({ sparkleCount: v })}
                />
              )}

              <SliderSetting
                label="Parallax Intensity"
                value={settings.threeBackground.parallaxIntensity}
                min={0}
                max={1}
                step={0.1}
                onChange={(v: number) => updateThreeBackground({ parallaxIntensity: v })}
                displayValue={`${Math.round(settings.threeBackground.parallaxIntensity * 100)}%`}
              />

              <Separator className="my-3" />
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">Object Visibility</p>
              
              <div className="grid grid-cols-1 gap-0.5">
                {Object.entries(objectLabels).map(([key, label]) => (
                  <SettingRow key={key} label={label}>
                    <Switch
                      checked={settings.threeBackground.objectVisibility[key as keyof typeof settings.threeBackground.objectVisibility]}
                      onCheckedChange={(checked: boolean) =>
                        updateThreeObjectVisibility(key as keyof typeof settings.threeBackground.objectVisibility, checked)
                      }
                    />
                  </SettingRow>
                ))}
              </div>
            </>
          )}

          {/* Gradient Background Settings */}
          {background === "gradient" && (
            <>
              <SectionTitle icon={IconWaveSine}>Gradient Animation</SectionTitle>

              <SliderSetting
                label="Gradient Size"
                value={parseInt(settings.gradient.size)}
                min={30}
                max={100}
                step={5}
                onChange={(v: number) => updateGradient({ size: `${v}%` })}
                displayValue={settings.gradient.size}
              />

              <div className="py-2 space-y-2">
                <span className="text-sm text-muted-foreground">Blend Mode</span>
                <div className="flex flex-wrap gap-1">
                  {blendModes.map((mode) => (
                    <Button
                      key={mode.value}
                      variant={settings.gradient.blendingValue === mode.value ? "default" : "outline"}
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => updateGradient({ blendingValue: mode.value })}
                    >
                      {mode.label}
                    </Button>
                  ))}
                </div>
              </div>

              <SettingRow label="Mouse Tracking">
                <Switch
                  checked={settings.gradient.interactive}
                  onCheckedChange={(checked: boolean) => updateGradient({ interactive: checked })}
                />
              </SettingRow>

              <SliderSetting
                label="Color Intensity"
                value={settings.gradient.colorIntensity}
                min={0.1}
                max={1}
                step={0.05}
                onChange={(v: number) => updateGradient({ colorIntensity: v })}
                displayValue={`${Math.round(settings.gradient.colorIntensity * 100)}%`}
              />
            </>
          )}

          {/* Meteor Settings */}
          <SectionTitle icon={IconMeteor}>Meteors</SectionTitle>

          <SettingRow label="Enable Meteors">
            <Switch
              checked={settings.meteors.enabled}
              onCheckedChange={(checked: boolean) => updateMeteors({ enabled: checked })}
            />
          </SettingRow>

          {settings.meteors.enabled && (
            <>
              <SliderSetting
                label="Meteor Count"
                value={settings.meteors.count}
                min={1}
                max={5}
                step={1}
                onChange={(v: number) => updateMeteors({ count: v })}
              />

              <SliderSetting
                label="Min Spawn Delay"
                value={settings.meteors.minDelay}
                min={1}
                max={10}
                step={0.5}
                onChange={(v: number) => updateMeteors({ minDelay: v })}
                displayValue={`${settings.meteors.minDelay}s`}
              />

              <SliderSetting
                label="Max Spawn Delay"
                value={settings.meteors.maxDelay}
                min={5}
                max={30}
                step={1}
                onChange={(v: number) => updateMeteors({ maxDelay: v })}
                displayValue={`${settings.meteors.maxDelay}s`}
              />

              <SliderSetting
                label="Min Duration"
                value={settings.meteors.minDuration}
                min={1}
                max={4}
                step={0.5}
                onChange={(v: number) => updateMeteors({ minDuration: v })}
                displayValue={`${settings.meteors.minDuration}s`}
              />

              <SliderSetting
                label="Max Duration"
                value={settings.meteors.maxDuration}
                min={3}
                max={10}
                step={0.5}
                onChange={(v: number) => updateMeteors({ maxDuration: v })}
                displayValue={`${settings.meteors.maxDuration}s`}
              />

              <SliderSetting
                label="Explosion Chance"
                value={settings.meteors.explosionChance}
                min={0}
                max={0.5}
                step={0.05}
                onChange={(v: number) => updateMeteors({ explosionChance: v })}
                displayValue={`${Math.round(settings.meteors.explosionChance * 100)}%`}
              />

              <SliderSetting
                label="Tail Length"
                value={settings.meteors.tailLength}
                min={50}
                max={400}
                step={25}
                onChange={(v: number) => updateMeteors({ tailLength: v })}
                displayValue={`${settings.meteors.tailLength}px`}
              />
            </>
          )}

          {/* Reset Button */}
          <Separator className="my-4" />
          <Button variant="outline" className="w-full" onClick={resetToDefaults}>
            <IconRefresh className="size-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
