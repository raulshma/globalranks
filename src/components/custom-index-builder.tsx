"use client"

import * as React from "react"
import {
  IconAlertCircle,
  IconCheck,
  IconDeviceFloppy,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react"

import type { IndexScoreMap } from "@/lib/custom-index"
import type { CustomIndexComponent, RankingIndex } from "@/lib/types"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { calculateCompositeScore, validateWeights } from "@/lib/custom-index"

interface CustomIndexBuilderProps {
  availableIndices: Array<RankingIndex>
  /** Map of index ID to normalized score for preview calculation */
  indexScores?: IndexScoreMap
  /** Initial components for editing an existing custom index */
  initialComponents?: Array<CustomIndexComponent>
  /** Initial name for editing an existing custom index */
  initialName?: string
  /** Callback when save is clicked */
  onSave?: (data: { name: string; components: Array<CustomIndexComponent>; isPublic: boolean }) => Promise<void>
  /** Whether save is in progress */
  isSaving?: boolean
  className?: string
}

interface ComponentWithIndex extends CustomIndexComponent {
  index: RankingIndex
}

/**
 * CustomIndexBuilder component for creating weighted composite indices
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */
export function CustomIndexBuilder({
  availableIndices,
  indexScores,
  initialComponents = [],
  initialName = "",
  onSave,
  isSaving = false,
  className,
}: CustomIndexBuilderProps) {
  // State for the custom index
  const [name, setName] = React.useState(initialName)
  const [components, setComponents] = React.useState<Array<ComponentWithIndex>>(() => {
    // Initialize with existing components if provided
    return initialComponents.map((c) => {
      const index = availableIndices.find((i) => i.id === c.indexId)
      if (!index) return null
      return { ...c, index }
    }).filter((c): c is ComponentWithIndex => c !== null)
  })
  const [isPublic, setIsPublic] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")
  const [saveError, setSaveError] = React.useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = React.useState(false)

  // Get indices that haven't been added yet
  const availableToAdd = React.useMemo(() => {
    const addedIds = new Set(components.map((c) => c.indexId))
    return availableIndices.filter((i) => !addedIds.has(i.id))
  }, [availableIndices, components])

  // Filter available indices by search
  const filteredIndices = React.useMemo(() => {
    if (!searchValue) return availableToAdd
    const lower = searchValue.toLowerCase()
    return availableToAdd.filter(
      (i) =>
        i.name.toLowerCase().includes(lower) ||
        i.shortName.toLowerCase().includes(lower) ||
        i.source.toLowerCase().includes(lower)
    )
  }, [availableToAdd, searchValue])

  // Calculate total weight
  const totalWeight = React.useMemo(
    () => components.reduce((sum, c) => sum + c.weight, 0),
    [components]
  )

  // Validate weights
  const validation = React.useMemo(
    () => validateWeights(components),
    [components]
  )

  // Calculate composite score preview
  const compositeScore = React.useMemo(() => {
    if (!indexScores || components.length === 0) return null
    return calculateCompositeScore(components, indexScores)
  }, [components, indexScores])

  // Add a new index to the custom index
  const handleAddIndex = React.useCallback((indexId: string | null) => {
    if (!indexId) return
    const index = availableIndices.find((i) => i.id === indexId)
    if (!index) return

    // Calculate default weight (distribute remaining evenly)
    const remainingWeight = Math.max(0, 100 - totalWeight)
    const defaultWeight = components.length === 0 ? 100 : Math.min(remainingWeight, 20)

    setComponents((prev) => [
      ...prev,
      { indexId, weight: defaultWeight, index },
    ])
    setSearchValue("")
  }, [availableIndices, components.length, totalWeight])

  // Remove an index from the custom index
  const handleRemoveIndex = React.useCallback((indexId: string) => {
    setComponents((prev) => prev.filter((c) => c.indexId !== indexId))
  }, [])

  // Update weight for an index
  const handleWeightChange = React.useCallback((indexId: string, weight: number) => {
    setComponents((prev) =>
      prev.map((c) => (c.indexId === indexId ? { ...c, weight } : c))
    )
  }, [])

  // Distribute weights evenly
  const handleDistributeEvenly = React.useCallback(() => {
    if (components.length === 0) return
    const evenWeight = 100 / components.length
    setComponents((prev) =>
      prev.map((c) => ({ ...c, weight: evenWeight }))
    )
  }, [components.length])

  // Handle save
  const handleSave = React.useCallback(async () => {
    if (!onSave) return
    if (!name.trim()) {
      setSaveError("Please enter a name for your custom index")
      return
    }
    if (!validation.valid) {
      setSaveError(validation.errors[0]?.message ?? "Invalid configuration")
      return
    }

    setSaveError(null)
    setSaveSuccess(false)

    try {
      await onSave({
        name: name.trim(),
        components: components.map((c) => ({ indexId: c.indexId, weight: c.weight })),
        isPublic,
      })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to save")
    }
  }, [onSave, name, validation, components, isPublic])

  return (
    <div className={className}>
      {/* Header with name input */}
      <div className="mb-6">
        <label className="text-xs font-medium text-muted-foreground mb-2 block">
          Custom Index Name
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Custom Performance Index"
          className="max-w-md"
        />
      </div>

      {/* Index selector */}
      <div className="mb-6">
        <label className="text-xs font-medium text-muted-foreground mb-2 block">
          Add Indices
        </label>
        <Combobox
          value=""
          onValueChange={handleAddIndex}
          inputValue={searchValue}
          onInputValueChange={setSearchValue}
        >
          <ComboboxInput
            placeholder="Search indices to add..."
            className="max-w-md"
            showClear={false}
          />
          <ComboboxContent className="max-h-64">
            <ComboboxList>
              {filteredIndices.map((index) => (
                <ComboboxItem key={index.id} value={index.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{index.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {index.source}
                    </span>
                  </div>
                </ComboboxItem>
              ))}
            </ComboboxList>
            <ComboboxEmpty>No indices found</ComboboxEmpty>
          </ComboboxContent>
        </Combobox>
      </div>

      {/* Selected components with weight sliders */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-medium text-muted-foreground" id="components-label">
            Components ({components.length})
          </label>
          {components.length > 1 && (
            <Button
              variant="ghost"
              size="xs"
              onClick={handleDistributeEvenly}
              className="text-muted-foreground"
              aria-label="Distribute weights evenly across all components"
            >
              Distribute evenly
            </Button>
          )}
        </div>

        {components.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            <IconSearch className="size-8 mx-auto mb-2 opacity-50" aria-hidden="true" />
            <p className="text-sm">No indices selected</p>
            <p className="text-xs">Search and add indices above to build your custom index</p>
          </Card>
        ) : (
          <div 
            className="space-y-3" 
            role="list" 
            aria-labelledby="components-label"
            aria-describedby="weight-summary"
          >
            {components.map((component) => (
              <ComponentRow
                key={component.indexId}
                component={component}
                onWeightChange={handleWeightChange}
                onRemove={handleRemoveIndex}
                score={indexScores?.get(component.indexId)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Weight summary and validation */}
      <div className="mb-6 p-4 bg-muted/50 rounded-none" id="weight-summary" role="status" aria-live="polite">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium">Total Weight</span>
          <span
            className={`text-sm font-bold ${
              Math.abs(totalWeight - 100) < 0.01
                ? "text-green-600 dark:text-green-400"
                : "text-amber-600 dark:text-amber-400"
            }`}
            aria-label={`Total weight: ${totalWeight.toFixed(1)} percent`}
          >
            {totalWeight.toFixed(1)}%
          </span>
        </div>

        {/* Progress bar */}
        <div 
          className="h-2 bg-muted rounded-full overflow-hidden mb-3"
          role="progressbar"
          aria-valuenow={totalWeight}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Weight distribution progress"
        >
          <div
            className={`h-full transition-all ${
              Math.abs(totalWeight - 100) < 0.01
                ? "bg-green-500"
                : totalWeight > 100
                  ? "bg-red-500"
                  : "bg-amber-500"
            }`}
            style={{ width: `${Math.min(totalWeight, 100)}%` }}
          />
        </div>

        {/* Validation messages */}
        {!validation.valid && (
          <div className="flex items-start gap-2 text-amber-600 dark:text-amber-400" role="alert">
            <IconAlertCircle className="size-4 mt-0.5 shrink-0" aria-hidden="true" />
            <span className="text-xs">{validation.errors[0]?.message}</span>
          </div>
        )}

        {validation.valid && components.length > 0 && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <IconCheck className="size-4" aria-hidden="true" />
            <span className="text-xs">Weights are valid</span>
          </div>
        )}
      </div>

      {/* Composite score preview */}
      {compositeScore && (
        <div className="mb-6 p-4 border border-border rounded-none">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">
              Composite Score Preview
            </span>
            {compositeScore.componentsMissing > 0 && (
              <Badge variant="outline" className="text-xs">
                {compositeScore.componentsMissing} missing
              </Badge>
            )}
          </div>
          <div className="text-3xl font-bold">
            {compositeScore.score !== null
              ? compositeScore.score.toFixed(1)
              : "—"}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Based on {compositeScore.componentsUsed} of {components.length} indices
          </p>
        </div>
      )}

      {/* Public toggle */}
      <div className="mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="size-4 rounded border-border"
          />
          <div>
            <span className="text-sm font-medium">Make public</span>
            <p className="text-xs text-muted-foreground">
              Allow others to view and use this custom index
            </p>
          </div>
        </label>
      </div>

      {/* Save button and status */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleSave}
          disabled={isSaving || !validation.valid || components.length === 0 || !name.trim()}
        >
          <IconDeviceFloppy className="size-4" />
          {isSaving ? "Saving..." : "Save Custom Index"}
        </Button>

        {saveError && (
          <span className="text-xs text-red-600 dark:text-red-400">{saveError}</span>
        )}

        {saveSuccess && (
          <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
            <IconCheck className="size-3" />
            Saved successfully
          </span>
        )}
      </div>
    </div>
  )
}


/**
 * Individual component row with weight slider
 */
interface ComponentRowProps {
  component: ComponentWithIndex
  onWeightChange: (indexId: string, weight: number) => void
  onRemove: (indexId: string) => void
  score?: number | null
}

function ComponentRow({ component, onWeightChange, onRemove, score }: ComponentRowProps) {
  const [inputValue, setInputValue] = React.useState(component.weight.toString())

  // Sync input value when weight changes externally
  React.useEffect(() => {
    setInputValue(component.weight.toFixed(1))
  }, [component.weight])

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    onWeightChange(component.indexId, value)
    setInputValue(value.toFixed(1))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputBlur = () => {
    const value = parseFloat(inputValue)
    if (!isNaN(value) && value >= 0 && value <= 100) {
      onWeightChange(component.indexId, value)
    } else {
      setInputValue(component.weight.toFixed(1))
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleInputBlur()
    }
  }

  // Handle keyboard shortcuts for slider
  const handleSliderKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const step = e.shiftKey ? 10 : 1
    if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      e.preventDefault()
      const newValue = Math.min(100, component.weight + step)
      onWeightChange(component.indexId, newValue)
    } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
      e.preventDefault()
      const newValue = Math.max(0, component.weight - step)
      onWeightChange(component.indexId, newValue)
    }
  }

  return (
    <div 
      className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 border border-border rounded-none bg-background"
      role="listitem"
    >
      {/* Index info */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate" id={`index-name-${component.indexId}`}>
          {component.index.name}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {component.index.source}
        </div>
      </div>

      {/* Score preview */}
      {score !== undefined && score !== null && (
        <div className="text-left sm:text-right">
          <div className="text-xs text-muted-foreground">Score</div>
          <div className="text-sm font-medium">{score.toFixed(1)}</div>
        </div>
      )}

      {/* Weight slider */}
      <div className="flex items-center gap-2 w-full sm:w-48">
        <input
          type="range"
          min="0"
          max="100"
          step="0.5"
          value={component.weight}
          onChange={handleSliderChange}
          onKeyDown={handleSliderKeyDown}
          className="flex-1 h-2 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label={`Weight for ${component.index.name}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={component.weight}
          aria-describedby={`index-name-${component.indexId}`}
        />
        <div className="flex items-center gap-1">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            className="w-16 text-center text-xs h-7"
            aria-label={`Weight percentage for ${component.index.name}`}
          />
          <span className="text-xs text-muted-foreground" aria-hidden="true">%</span>
        </div>
      </div>

      {/* Remove button */}
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => onRemove(component.indexId)}
        className="text-muted-foreground hover:text-destructive shrink-0 self-end sm:self-auto"
        aria-label={`Remove ${component.index.name} from custom index`}
      >
        <IconTrash className="size-4" aria-hidden="true" />
      </Button>
    </div>
  )
}
