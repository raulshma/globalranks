/**
 * Server functions for country comparison and gap analysis
 * Requirements: 5.1, 5.2, 5.3, 5.4
 */

import { and, asc, desc, eq, inArray } from 'drizzle-orm'
import { z } from 'zod'
import { createServerFn } from '@tanstack/react-start'
import { db } from '../db'
import { countries, peerGroups, rankingEntries, rankingIndices } from '../db/schema'
import type { ComparisonDataPoint, GapAnalysis } from '../types'

/**
 * Compare multiple countries across all or selected indices
 * Requirement 5.1: Support predefined peer groups (BRICS, G20, South Asian, income-level)
 * Requirement 5.2: Generate side-by-side comparison dashboards
 * Requirement 5.4: Support comparison across multiple indices simultaneously
 */
export const compareCountries = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      countryCodes: z.array(z.string().length(3)).min(2),
      indexIds: z.array(z.string()).optional(),
      year: z.number().optional(),
      peerGroupId: z.string().optional(),
    })
  )
  .handler(async ({ data }) => {
    let { countryCodes } = data
    const { indexIds, year: inputYear, peerGroupId } = data
    let year = inputYear

    // If peer group is specified, get countries from peer group
    if (peerGroupId) {
      const peerGroup = await db.query.peerGroups.findFirst({
        where: eq(peerGroups.id, peerGroupId),
      })

      if (peerGroup) {
        const peerCountryCodes = JSON.parse(peerGroup.countryCodes) as Array<string>
        // Merge with provided country codes (deduplicate)
        countryCodes = [...new Set([...countryCodes, ...peerCountryCodes])]
      }
    }

    // Get the most recent year if not specified
    if (!year) {
      const latestEntry = await db.query.rankingEntries.findFirst({
        orderBy: [desc(rankingEntries.year)],
      })
      year = latestEntry?.year ?? new Date().getFullYear()
    }

    // Get all indices if not specified
    let indicesToCompare: Array<{ id: string; name: string; shortName: string; domainId: string }>
    if (indexIds && indexIds.length > 0) {
      indicesToCompare = await db.query.rankingIndices.findMany({
        where: inArray(rankingIndices.id, indexIds),
        columns: { id: true, name: true, shortName: true, domainId: true },
      })
    } else {
      indicesToCompare = await db.query.rankingIndices.findMany({
        columns: { id: true, name: true, shortName: true, domainId: true },
      })
    }

    const indexIdsToQuery = indicesToCompare.map((i) => i.id)

    // Get all ranking entries for the specified countries, indices, and year
    const entries = await db.query.rankingEntries.findMany({
      where: and(
        inArray(rankingEntries.countryCode, countryCodes),
        inArray(rankingEntries.indexId, indexIdsToQuery),
        eq(rankingEntries.year, year)
      ),
      with: {
        country: true,
        index: {
          with: {
            domain: true,
          },
        },
      },
      orderBy: [asc(rankingEntries.indexId), asc(rankingEntries.rank)],
    })

    // Transform to comparison data points
    const comparisonData: Array<ComparisonDataPoint> = entries.map((entry) => ({
      countryCode: entry.countryCode,
      indexId: entry.indexId,
      rank: entry.rank,
      score: entry.score,
      normalizedScore: entry.normalizedScore,
      percentile: entry.percentile,
      year: entry.year,
    }))

    // Get country details
    const countryDetails = await db.query.countries.findMany({
      where: inArray(countries.code, countryCodes),
      orderBy: [asc(countries.name)],
    })

    return {
      year,
      countries: countryDetails,
      indices: indicesToCompare,
      data: comparisonData,
      totalComparisons: comparisonData.length,
    }
  })


/**
 * Compare countries using a predefined peer group
 * Requirement 5.1: Support predefined peer groups (BRICS, G20, South Asian, income-level)
 */
export const compareWithPeerGroup = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      baseCountryCode: z.string().length(3),
      peerGroupId: z.string(),
      indexIds: z.array(z.string()).optional(),
      year: z.number().optional(),
    })
  )
  .handler(async ({ data }) => {
    const { baseCountryCode, peerGroupId, indexIds, year } = data

    // Get the peer group
    const peerGroup = await db.query.peerGroups.findFirst({
      where: eq(peerGroups.id, peerGroupId),
    })

    if (!peerGroup) {
      throw new Error(`Peer group not found: ${peerGroupId}`)
    }

    const peerCountryCodes = JSON.parse(peerGroup.countryCodes) as Array<string>

    // Ensure base country is included
    const allCountryCodes = [...new Set([baseCountryCode, ...peerCountryCodes])]

    // Use compareCountries for the actual comparison
    const comparison = await compareCountries({
      data: {
        countryCodes: allCountryCodes,
        indexIds,
        year,
      },
    })

    return {
      ...comparison,
      peerGroup: {
        id: peerGroup.id,
        name: peerGroup.name,
      },
      baseCountryCode,
    }
  })

/**
 * Calculate gaps between a base country and comparison countries
 * Requirement 5.3: Highlight gaps, convergence, or divergence patterns
 */
export const calculateGaps = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      baseCountryCode: z.string().length(3),
      comparisonCountryCodes: z.array(z.string().length(3)).min(1),
      indexIds: z.array(z.string()).optional(),
      year: z.number().optional(),
      historicalYears: z.number().optional().default(5), // Number of years to look back for trend
    })
  )
  .handler(async ({ data }) => {
    const { baseCountryCode, comparisonCountryCodes, indexIds, historicalYears } = data
    let { year } = data

    // Get the most recent year if not specified
    if (!year) {
      const latestEntry = await db.query.rankingEntries.findFirst({
        orderBy: [desc(rankingEntries.year)],
      })
      year = latestEntry?.year ?? new Date().getFullYear()
    }

    const allCountryCodes = [baseCountryCode, ...comparisonCountryCodes]

    // Get all indices if not specified
    let indexIdsToQuery: Array<string>
    if (indexIds && indexIds.length > 0) {
      indexIdsToQuery = indexIds
    } else {
      const allIndices = await db.query.rankingIndices.findMany({
        columns: { id: true },
      })
      indexIdsToQuery = allIndices.map((i) => i.id)
    }

    // Get current year data for all countries
    const currentEntries = await db.query.rankingEntries.findMany({
      where: and(
        inArray(rankingEntries.countryCode, allCountryCodes),
        inArray(rankingEntries.indexId, indexIdsToQuery),
        eq(rankingEntries.year, year)
      ),
      with: {
        index: true,
      },
    })

    // Get historical data for trend analysis
    const historicalStartYear = year - historicalYears
    const historicalEntries = await db.query.rankingEntries.findMany({
      where: and(
        inArray(rankingEntries.countryCode, allCountryCodes),
        inArray(rankingEntries.indexId, indexIdsToQuery)
      ),
      orderBy: [asc(rankingEntries.year)],
    })

    // Filter historical entries to the relevant year range
    const relevantHistoricalEntries = historicalEntries.filter(
      (e) => e.year >= historicalStartYear && e.year <= year
    )

    // Calculate gaps for each index and comparison country
    const gaps: Array<GapAnalysis & { comparisonCountryCode: string; indexName: string }> = []

    for (const indexId of indexIdsToQuery) {
      const baseEntry = currentEntries.find(
        (e) => e.countryCode === baseCountryCode && e.indexId === indexId
      )

      if (!baseEntry) continue

      for (const compCountryCode of comparisonCountryCodes) {
        const compEntry = currentEntries.find(
          (e) => e.countryCode === compCountryCode && e.indexId === indexId
        )

        if (!compEntry) continue

        // Calculate current gap (base_rank - comparison_rank)
        // Positive gap means base country is behind (higher rank number)
        // Negative gap means base country is ahead (lower rank number)
        const currentGap = baseEntry.rank - compEntry.rank

        // Calculate historical gap for trend determination
        const trend = calculateGapTrend(
          relevantHistoricalEntries,
          baseCountryCode,
          compCountryCode,
          indexId
        )

        gaps.push({
          indexId,
          indexName: baseEntry.index.name,
          baseRank: baseEntry.rank,
          comparisonRank: compEntry.rank,
          gap: currentGap,
          trend,
          comparisonCountryCode: compCountryCode,
        })
      }
    }

    // Get country details
    const countryDetails = await db.query.countries.findMany({
      where: inArray(countries.code, allCountryCodes),
    })

    return {
      baseCountryCode,
      comparisonCountryCodes,
      year,
      gaps,
      countries: countryDetails,
      summary: calculateGapSummary(gaps),
    }
  })


/**
 * Calculate gap trend (converging, diverging, or stable) based on historical data
 * Requirement 5.3: Determine convergence/divergence trends over time
 */
export function calculateGapTrend(
  historicalEntries: Array<{
    countryCode: string
    indexId: string
    year: number
    rank: number
  }>,
  baseCountryCode: string,
  comparisonCountryCode: string,
  indexId: string
): 'converging' | 'diverging' | 'stable' {
  // Filter entries for this index and both countries
  const baseEntries = historicalEntries
    .filter((e) => e.countryCode === baseCountryCode && e.indexId === indexId)
    .sort((a, b) => a.year - b.year)

  const compEntries = historicalEntries
    .filter((e) => e.countryCode === comparisonCountryCode && e.indexId === indexId)
    .sort((a, b) => a.year - b.year)

  if (baseEntries.length < 2 || compEntries.length < 2) {
    return 'stable' // Not enough data to determine trend
  }

  // Calculate gaps for each year where both countries have data
  const yearlyGaps: Array<{ year: number; gap: number }> = []

  for (const baseEntry of baseEntries) {
    const compEntry = compEntries.find((e) => e.year === baseEntry.year)
    if (compEntry) {
      yearlyGaps.push({
        year: baseEntry.year,
        gap: baseEntry.rank - compEntry.rank,
      })
    }
  }

  if (yearlyGaps.length < 2) {
    return 'stable'
  }

  // Calculate trend using linear regression slope of absolute gap values
  const firstGap = Math.abs(yearlyGaps[0].gap)
  const lastGap = Math.abs(yearlyGaps[yearlyGaps.length - 1].gap)
  const gapChange = lastGap - firstGap

  // Threshold for determining trend (configurable)
  const TREND_THRESHOLD = 2

  if (gapChange < -TREND_THRESHOLD) {
    return 'converging' // Gap is decreasing (countries getting closer)
  } else if (gapChange > TREND_THRESHOLD) {
    return 'diverging' // Gap is increasing (countries getting further apart)
  }

  return 'stable'
}

/**
 * Calculate summary statistics for gap analysis
 */
function calculateGapSummary(
  gaps: Array<{ gap: number; trend: 'converging' | 'diverging' | 'stable' }>
): {
  totalGaps: number
  averageGap: number
  convergingCount: number
  divergingCount: number
  stableCount: number
  positiveGaps: number // Base country behind
  negativeGaps: number // Base country ahead
} {
  if (gaps.length === 0) {
    return {
      totalGaps: 0,
      averageGap: 0,
      convergingCount: 0,
      divergingCount: 0,
      stableCount: 0,
      positiveGaps: 0,
      negativeGaps: 0,
    }
  }

  const totalGaps = gaps.length
  const averageGap = gaps.reduce((sum, g) => sum + g.gap, 0) / totalGaps
  const convergingCount = gaps.filter((g) => g.trend === 'converging').length
  const divergingCount = gaps.filter((g) => g.trend === 'diverging').length
  const stableCount = gaps.filter((g) => g.trend === 'stable').length
  const positiveGaps = gaps.filter((g) => g.gap > 0).length
  const negativeGaps = gaps.filter((g) => g.gap < 0).length

  return {
    totalGaps,
    averageGap,
    convergingCount,
    divergingCount,
    stableCount,
    positiveGaps,
    negativeGaps,
  }
}

/**
 * Get comparison data for a specific index across multiple countries
 * Useful for detailed index-level comparisons
 */
export const getIndexComparison = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      indexId: z.string(),
      countryCodes: z.array(z.string().length(3)).min(1),
      year: z.number().optional(),
    })
  )
  .handler(async ({ data }) => {
    const { indexId, countryCodes } = data
    let { year } = data

    // Get the index details
    const index = await db.query.rankingIndices.findFirst({
      where: eq(rankingIndices.id, indexId),
      with: {
        domain: true,
      },
    })

    if (!index) {
      throw new Error(`Index not found: ${indexId}`)
    }

    // Get the most recent year if not specified
    if (!year) {
      const latestEntry = await db.query.rankingEntries.findFirst({
        where: eq(rankingEntries.indexId, indexId),
        orderBy: [desc(rankingEntries.year)],
      })
      year = latestEntry?.year ?? new Date().getFullYear()
    }

    // Get ranking entries for the specified countries
    const entries = await db.query.rankingEntries.findMany({
      where: and(
        eq(rankingEntries.indexId, indexId),
        inArray(rankingEntries.countryCode, countryCodes),
        eq(rankingEntries.year, year)
      ),
      with: {
        country: true,
      },
      orderBy: [asc(rankingEntries.rank)],
    })

    // Get the full ranking list for context
    const fullRanking = await db.query.rankingEntries.findMany({
      where: and(
        eq(rankingEntries.indexId, indexId),
        eq(rankingEntries.year, year)
      ),
      orderBy: [asc(rankingEntries.rank)],
    })

    return {
      index,
      year,
      entries,
      totalCountriesInIndex: fullRanking.length,
      requestedCountries: countryCodes,
    }
  })

/**
 * Get countries by income level for comparison
 * Requirement 5.1: Support income-level peer comparisons
 */
export const getCountriesByIncomeLevel = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      incomeLevel: z.enum(['low', 'lower-middle', 'upper-middle', 'high']),
    })
  )
  .handler(async ({ data }) => {
    const { incomeLevel } = data

    const matchingCountries = await db.query.countries.findMany({
      where: eq(countries.incomeLevel, incomeLevel),
      orderBy: [asc(countries.name)],
    })

    return matchingCountries
  })
