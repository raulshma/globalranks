"use client"

import { IconCube, IconWaveSine } from "@tabler/icons-react"
import { useBackground } from "./background-provider"
import { Button } from "./ui/button"
import { Tooltip } from "./ui/tooltip"

export function BackgroundToggle() {
  const { background, setBackground } = useBackground()

  const toggle = () => {
    setBackground(background === "3d" ? "gradient" : "3d")
  }

  return (
    <Tooltip content={`Switch to ${background === "3d" ? "gradient" : "3D"} background`}>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        className="size-9"
      >
        {background === "3d" ? (
          <IconCube className="size-5" />
        ) : (
          <IconWaveSine className="size-5" />
        )}
        <span className="sr-only">
          Switch to {background === "3d" ? "gradient" : "3D"} background
        </span>
      </Button>
    </Tooltip>
  )
}
