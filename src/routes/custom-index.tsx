import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { IconPlus, IconTrash } from "@tabler/icons-react"
import * as React from "react"

import type { IndexScoreMap } from "@/lib/custom-index"
import type { RankingIndex } from "@/lib/types"

import { getAllDomainsWithStats } from "@/lib/server-functions/domains"
import { getRankingsByCountry } from "@/lib/server-functions/rankings"
import {
  deleteCustomIndex,
  getUserCustomIndices,
  saveCustomIndex,
} from "@/lib/server-functions/custom-index"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CustomIndexBuilder } from "@/components/custom-index-builder"
import { CACHE_CONFIG } from "@/lib/cache-config"

const searchSchema = z.object({
  country: z.string().length(3).optional().default("IND"),
})

// Temporary user ID for demo purposes
const DEMO_USER_ID = "demo-user"

export const Route = createFileRoute("/custom-index")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({
    country: search.country,
  }),
  // Custom index page is dynamic (user-specific data)
  staleTime: CACHE_CONFIG.DYNAMIC.staleTime,
  gcTime: CACHE_CONFIG.DYNAMIC.gcTime,
  loader: async ({ deps }) => {
    const { country } = deps

    // Get all domains with their indices
    const domainsData = await getAllDomainsWithStats({
      data: { countryCode: country },
    })

    // Get all rankings for the country to build score map
    const rankings = await getRankingsByCountry({
      data: { countryCode: country },
    })

    // Get user's saved custom indices
    const savedIndices = await getUserCustomIndices({
      data: { userId: DEMO_USER_ID, includePublic: true },
    })

    // Build available indices list
    const availableIndices: Array<RankingIndex> = []
    for (const domain of domainsData.domains) {
      for (const index of domain.indices) {
        availableIndices.push({
          id: index.id,
          name: index.name,
          shortName: index.shortName,
          domainId: domain.id,
          source: "",
          sourceUrl: "",
          methodology: "",
          updateFrequency: "annual",
          scoreRange: { min: 0, max: 100 },
          higherIsBetter: true,
          lastUpdated: new Date(),
        })
      }
    }

    // Build score map from rankings
    const indexScores: IndexScoreMap = new Map()
    for (const ranking of rankings) {
      // Use the most recent year's score for each index
      const existing = indexScores.get(ranking.indexId)
      if (existing === undefined) {
        indexScores.set(ranking.indexId, ranking.normalizedScore)
      }
    }

    return {
      countryCode: country,
      availableIndices,
      indexScores,
      savedIndices,
      latestYear: domainsData.latestYear,
    }
  },
  head: ({ loaderData }) => {
    const availableCount = loaderData?.availableIndices.length ?? 0

    return {
      meta: [
        {
          title: "Custom Index Builder — Global Indicies",
        },
        {
          name: "description",
          content: `Create custom weighted composite indices from ${availableCount}+ global ranking sources. Combine multiple indices to generate personalized performance scores aligned with your research needs.`,
        },
        {
          property: "og:title",
          content: "Custom Index Builder — Global Indicies",
        },
        {
          property: "og:description",
          content: `Create custom weighted composite indices from ${availableCount}+ global ranking sources.`,
        },
      ],
    }
  },
  component: CustomIndexPage,
})


function CustomIndexPage() {
  const data = Route.useLoaderData()
  const [isSaving, setIsSaving] = React.useState(false)
  const [savedIndices, setSavedIndices] = React.useState(data.savedIndices)
  const [showBuilder, setShowBuilder] = React.useState(true)

  // Handle saving a custom index
  const handleSave = async (saveData: {
    name: string
    components: Array<{ indexId: string; weight: number }>
    isPublic: boolean
  }) => {
    setIsSaving(true)
    try {
      const newIndex = await saveCustomIndex({
        data: {
          userId: DEMO_USER_ID,
          data: saveData,
        },
      })
      setSavedIndices((prev) => [...prev, newIndex])
    } finally {
      setIsSaving(false)
    }
  }

  // Handle deleting a custom index
  const handleDelete = async (indexId: string) => {
    try {
      await deleteCustomIndex({
        data: {
          id: indexId,
          userId: DEMO_USER_ID,
        },
      })
      setSavedIndices((prev) => prev.filter((i) => i.id !== indexId))
    } catch (error) {
      console.error("Failed to delete custom index:", error)
    }
  }

  return (
    <div className="space-y-8 container mx-auto px-4 relative z-10">
      <div className="flex justify-end">
        <Button
          variant={showBuilder ? "outline" : "default"}
          onClick={() => setShowBuilder(!showBuilder)}
        >
          <IconPlus className="size-4 mr-1" />
          {showBuilder ? "Hide Builder" : "New Custom Index"}
        </Button>
      </div>

      {/* Custom Index Builder */}
      {showBuilder && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create New Custom Index</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomIndexBuilder
              availableIndices={data.availableIndices}
              indexScores={data.indexScores}
              onSave={handleSave}
              isSaving={isSaving}
            />
          </CardContent>
        </Card>
      )}

      {/* Saved Custom Indices */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Saved Custom Indices ({savedIndices.length})
        </h2>

        {savedIndices.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {savedIndices.map((customIndex) => (
              <SavedIndexCard
                key={customIndex.id}
                customIndex={customIndex}
                availableIndices={data.availableIndices}
                indexScores={data.indexScores}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No saved custom indices yet. Create one above!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

interface SavedIndexCardProps {
  customIndex: {
    id: string
    name: string
    components: Array<{ indexId: string; weight: number }>
    isPublic: boolean
    createdAt: Date
  }
  availableIndices: Array<RankingIndex>
  indexScores: IndexScoreMap
  onDelete: (id: string) => void
}

function SavedIndexCard({
  customIndex,
  availableIndices,
  indexScores,
  onDelete,
}: SavedIndexCardProps) {
  // Calculate composite score
  const compositeScore = React.useMemo(() => {
    let weightedSum = 0
    let totalWeight = 0

    for (const component of customIndex.components) {
      const score = indexScores.get(component.indexId)
      if (score !== null && score !== undefined) {
        weightedSum += score * component.weight
        totalWeight += component.weight
      }
    }

    if (totalWeight === 0) return null
    return weightedSum / totalWeight
  }, [customIndex.components, indexScores])

  // Get index names for components
  const getIndexName = (indexId: string) => {
    return availableIndices.find((i) => i.id === indexId)?.name ?? indexId
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{customIndex.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              {customIndex.isPublic && (
                <Badge variant="secondary" className="text-xs">
                  Public
                </Badge>
              )}
              <span className="text-muted-foreground text-xs">
                {customIndex.components.length} indices
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onDelete(customIndex.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <IconTrash className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Composite Score */}
        <div className="mb-4 p-3 bg-white/5 border border-white/10 rounded-xl">
          <p className="text-xs text-muted-foreground">Composite Score</p>
          <p className="text-2xl font-bold">
            {compositeScore !== null ? compositeScore.toFixed(1) : "—"}
          </p>
        </div>

        {/* Components */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Components</p>
          {customIndex.components.slice(0, 5).map((component) => (
            <div
              key={component.indexId}
              className="flex items-center justify-between text-xs"
            >
              <span className="truncate flex-1">{getIndexName(component.indexId)}</span>
              <span className="text-muted-foreground ml-2">
                {component.weight.toFixed(0)}%
              </span>
            </div>
          ))}
          {customIndex.components.length > 5 && (
            <p className="text-xs text-muted-foreground">
              +{customIndex.components.length - 5} more
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
