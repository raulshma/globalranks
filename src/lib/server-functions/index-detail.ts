/**
 * Server functions for index detail data
 * Requirements: 1.5, 1.7, 2.4, 2.7
 */

import { and, asc, desc, eq } from "drizzle-orm"
import { z } from "zod"
import { createServerFn } from "@tanstack/react-start"
import { db } from "../db"
import { rankingEntries, rankingIndices } from "../db/schema"

/**
 * Get full index details with complete ranking list
 * Requirement 1.5: Expose raw datasets, derived metrics, and methodology notes
 * Requirement 1.7: Cite official source URL and publishing organization
 * Requirement 2.4: Show absolute rank, percentile rank, score-based performance
 * Requirement 2.7: Show full country list with ranks
 */
export const getIndexDetail = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      indexId: z.string(),
      countryCode: z.string().length(3),
      year: z.number().optional(),
    })
  )
  .handler(async ({ data }) => {
    const { indexId, countryCode, year } = data

    // Get the index details
    const index = await db.query.rankingIndices.findFirst({
      where: eq(rankingIndices.id, indexId),
      with: {
        domain: true,
        milestones: true,
      },
    })

    if (!index) {
      throw new Error(`Index not found: ${indexId}`)
    }

    // Get all available years for this index
    const allEntries = await db.query.rankingEntries.findMany({
      where: eq(rankingEntries.indexId, indexId),
      columns: {
        year: true,
      },
    })

    const availableYears = [...new Set(allEntries.map((e) => e.year))].sort(
      (a, b) => b - a
    )

    const latestYear = year ?? (availableYears[0] || new Date().getFullYear())

    // Get full ranking list for the selected year (all countries)
    const fullRankingList = await db.query.rankingEntries.findMany({
      where: and(
        eq(rankingEntries.indexId, indexId),
        eq(rankingEntries.year, latestYear)
      ),
      with: {
        country: true,
      },
      orderBy: [asc(rankingEntries.rank)],
    })

    // Get the selected country's entry
    const selectedCountryEntry = fullRankingList.find(
      (e) => e.countryCode === countryCode
    )

    // Get historical data for the selected country
    const countryHistory = await db.query.rankingEntries.findMany({
      where: and(
        eq(rankingEntries.indexId, indexId),
        eq(rankingEntries.countryCode, countryCode)
      ),
      orderBy: [desc(rankingEntries.year)],
    })

    // Parse sub-metrics if available
    const subMetrics = selectedCountryEntry?.subMetrics
      ? (JSON.parse(selectedCountryEntry.subMetrics) as Array<{
          name: string
          value: number
          weight: number
          rank: number | null
        }>)
      : null

    return {
      index: {
        id: index.id,
        name: index.name,
        shortName: index.shortName,
        source: index.source,
        sourceUrl: index.sourceUrl,
        methodology: index.methodology,
        updateFrequency: index.updateFrequency,
        scoreMin: index.scoreMin,
        scoreMax: index.scoreMax,
        higherIsBetter: index.higherIsBetter,
        lastUpdated: index.lastUpdated,
        domain: index.domain,
      },
      selectedYear: latestYear,
      availableYears,
      selectedCountry: {
        code: countryCode,
        entry: selectedCountryEntry
          ? {
              rank: selectedCountryEntry.rank,
              totalCountries: selectedCountryEntry.totalCountries,
              score: selectedCountryEntry.score,
              normalizedScore: selectedCountryEntry.normalizedScore,
              percentile: selectedCountryEntry.percentile,
              confidence: selectedCountryEntry.confidence,
            }
          : null,
        history: countryHistory.map((e) => ({
          year: e.year,
          rank: e.rank,
          totalCountries: e.totalCountries,
          score: e.score,
          normalizedScore: e.normalizedScore,
          percentile: e.percentile,
        })),
        subMetrics,
      },
      fullRankingList: fullRankingList.map((e) => ({
        rank: e.rank,
        countryCode: e.countryCode,
        countryName: e.country.name,
        region: e.country.region,
        score: e.score,
        normalizedScore: e.normalizedScore,
        percentile: e.percentile,
        isSelected: e.countryCode === countryCode,
      })),
      milestones: index.milestones.map((m) => ({
        year: m.year,
        event: m.event,
        impact: m.impact,
        source: m.source,
      })),
    }
  })
