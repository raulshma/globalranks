/**
 * Server functions for rankings data access
 * Requirements: 2.2, 2.3, 4.1
 */

import { and, asc, desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { createServerFn } from '@tanstack/react-start'
import { db } from '../db'
import { rankingEntries, rankingIndices } from '../db/schema'
import { withCache, cacheKey, CACHE_TTL } from '../cache'

// Zod schemas for validation
const filtersSchema = z.object({
  domain: z.string().optional(),
  year: z.number().optional(),
  source: z.string().optional(),
  methodology: z.string().optional(),
})

/**
 * Get rankings by country with optional filters
 * Requirement 2.2: Update all rankings when country is selected
 * Requirement 2.3: Display rankings by category, year, source, or methodology
 */
export const getRankingsByCountry = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      countryCode: z.string().length(3),
      filters: filtersSchema.optional(),
    })
  )
  .handler(async ({ data }) => {
    const { countryCode, filters } = data

    // Create a cache key that includes filters
    const filterKey = filters ? JSON.stringify(filters) : 'none'

    // Redis cache: rankings by country
    return withCache(
      cacheKey('rankingsByCountry', countryCode, filterKey),
      CACHE_TTL.DYNAMIC,
      async () => {
        // Build query with relations
        const rankings = await db.query.rankingEntries.findMany({
          where: eq(rankingEntries.countryCode, countryCode),
          with: {
            index: {
              with: {
                domain: true,
              },
            },
            country: true,
          },
          orderBy: [desc(rankingEntries.year), asc(rankingEntries.rank)],
        })

        // Apply filters in memory (for complex filtering)
        let filtered = rankings

        if (filters?.domain) {
          filtered = filtered.filter((r) => r.index.domainId === filters.domain)
        }

        if (filters?.year) {
          filtered = filtered.filter((r) => r.year === filters.year)
        }

        if (filters?.source) {
          filtered = filtered.filter((r) =>
            r.index.source.toLowerCase().includes(filters.source!.toLowerCase())
          )
        }

        if (filters?.methodology) {
          filtered = filtered.filter((r) =>
            r.index.methodology
              .toLowerCase()
              .includes(filters.methodology!.toLowerCase())
          )
        }

        return filtered
      }
    )
  })


/**
 * Get rankings by domain for a specific country
 * Requirement 2.3: Display rankings by category
 */
export const getRankingsByDomain = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      domainId: z.string(),
      countryCode: z.string().length(3),
    })
  )
  .handler(async ({ data }) => {
    const { domainId, countryCode } = data

    // Redis cache: rankings by domain and country
    return withCache(
      cacheKey('rankingsByDomain', domainId, countryCode),
      CACHE_TTL.REFERENCE,
      async () => {
        // Get all indices for the domain
        const indices = await db.query.rankingIndices.findMany({
          where: eq(rankingIndices.domainId, domainId),
          with: {
            domain: true,
          },
        })

        const indexIds = indices.map((i) => i.id)

        // Get ranking entries for those indices and the specified country
        const rankings = await db.query.rankingEntries.findMany({
          where: eq(rankingEntries.countryCode, countryCode),
          with: {
            index: {
              with: {
                domain: true,
              },
            },
            country: true,
          },
          orderBy: [desc(rankingEntries.year), asc(rankingEntries.rank)],
        })

        // Filter to only include entries for indices in the domain
        const filtered = rankings.filter((r) => indexIds.includes(r.indexId))

        return {
          domain: indices[0]?.domain ?? null,
          indices,
          rankings: filtered,
        }
      }
    )
  })

/**
 * Get ranking by index for a specific country and optional year
 * Requirement 2.3: Display rankings by category, year
 */
export const getRankingByIndex = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      indexId: z.string(),
      countryCode: z.string().length(3),
      year: z.number().optional(),
    })
  )
  .handler(async ({ data }) => {
    const { indexId, countryCode, year } = data

    // Redis cache: ranking by index, country, and optional year
    return withCache(
      cacheKey('rankingByIndex', indexId, countryCode, year ?? 'latest'),
      CACHE_TTL.REFERENCE,
      async () => {
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

        // Build conditions for ranking entry query
        const conditions = [
          eq(rankingEntries.indexId, indexId),
          eq(rankingEntries.countryCode, countryCode),
        ]

        if (year) {
          conditions.push(eq(rankingEntries.year, year))
        }

        // Get ranking entries
        const entries = await db.query.rankingEntries.findMany({
          where: and(...conditions),
          with: {
            country: true,
          },
          orderBy: [desc(rankingEntries.year)],
        })

        // If year specified, return single entry; otherwise return latest
        const entry = entries.length > 0 ? entries[0] : null

        return {
          index,
          entry,
          allEntries: entries,
        }
      }
    )
  })


/**
 * Get time series data for an index and country
 * Requirement 4.1: Provide longitudinal data for each ranking index
 */
export const getTimeSeriesData = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      indexId: z.string(),
      countryCode: z.string().length(3),
    })
  )
  .handler(async ({ data }) => {
    const { indexId, countryCode } = data

    // Redis cache: time series data
    return withCache(
      cacheKey('timeseries', indexId, countryCode),
      CACHE_TTL.REFERENCE,
      async () => {
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

        // Get all ranking entries for this index and country, ordered by year
        const entries = await db.query.rankingEntries.findMany({
          where: and(
            eq(rankingEntries.indexId, indexId),
            eq(rankingEntries.countryCode, countryCode)
          ),
          orderBy: [asc(rankingEntries.year)],
        })

        if (entries.length === 0) {
          return {
            indexId,
            countryCode,
            index,
            entries: [],
            trend: 'stable' as const,
            velocity: 0,
            volatility: 0,
            milestones: index.milestones,
          }
        }

        // Calculate velocity (rate of rank change over time)
        // Negative velocity = improving (rank decreasing), Positive = declining
        const firstEntry = entries[0]
        const lastEntry = entries[entries.length - 1]
        const yearSpan = lastEntry.year - firstEntry.year

        const velocity =
          yearSpan > 0 ? (lastEntry.rank - firstEntry.rank) / yearSpan : 0

        // Calculate volatility (standard deviation of year-over-year changes)
        const yearOverYearChanges: Array<number> = []
        for (let i = 1; i < entries.length; i++) {
          yearOverYearChanges.push(entries[i].rank - entries[i - 1].rank)
        }

        let volatility = 0
        if (yearOverYearChanges.length > 0) {
          const mean =
            yearOverYearChanges.reduce((a, b) => a + b, 0) /
            yearOverYearChanges.length
          const squaredDiffs = yearOverYearChanges.map((x) => Math.pow(x - mean, 2))
          const avgSquaredDiff =
            squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length
          volatility = Math.sqrt(avgSquaredDiff)
        }

        // Determine trend indicator
        const STABILITY_THRESHOLD = 0.5 // Configurable threshold
        let trend: 'improving' | 'declining' | 'stable'
        if (velocity < -STABILITY_THRESHOLD) {
          trend = 'improving' // Rank decreasing = improving
        } else if (velocity > STABILITY_THRESHOLD) {
          trend = 'declining' // Rank increasing = declining
        } else {
          trend = 'stable'
        }

        // Transform entries to time series format
        const timeSeriesEntries = entries.map((e) => ({
          year: e.year,
          rank: e.rank,
          totalCountries: e.totalCountries,
          score: e.score,
          normalizedScore: e.normalizedScore,
          percentile: e.percentile,
        }))

        return {
          indexId,
          countryCode,
          index,
          entries: timeSeriesEntries,
          trend,
          velocity,
          volatility,
          milestones: index.milestones,
        }
      }
    )
  })
