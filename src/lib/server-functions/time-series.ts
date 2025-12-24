/**
 * Time Series Engine - Server functions for time series data processing
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 */

import { and, asc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { createServerFn } from '@tanstack/react-start'
import { db } from '../db'
import { milestones, rankingEntries, rankingIndices } from '../db/schema'
import type {
  Milestone,
  TimeSeriesEntry,
  TrendIndicator,
} from '../types'

// Stability threshold for trend determination
const STABILITY_THRESHOLD = 0.5

// Default anomaly threshold (positions)
const DEFAULT_ANOMALY_THRESHOLD = 10

/**
 * Anomaly detected in time series data
 */
export interface Anomaly {
  year: number
  previousYear: number
  rankChange: number
  previousRank: number
  currentRank: number
  isSignificant: boolean
  direction: 'improvement' | 'decline'
}

/**
 * Time series metrics calculated from ranking entries
 */
export interface TimeSeriesMetrics {
  velocity: number
  volatility: number
  trend: TrendIndicator
  totalYears: number
  earliestYear: number
  latestYear: number
  bestRank: number
  worstRank: number
  averageRank: number
}

/**
 * Complete time series data with metrics and anomalies
 */
export interface TimeSeriesWithMetrics {
  indexId: string
  countryCode: string
  index: {
    id: string
    name: string
    shortName: string
    source: string
    sourceUrl: string
    higherIsBetter: boolean
  } | null
  entries: Array<TimeSeriesEntry>
  metrics: TimeSeriesMetrics
  anomalies: Array<Anomaly>
  milestones: Array<Milestone>
}


/**
 * Calculate velocity (rate of rank change over time)
 * Requirement 4.2: Calculate growth or decline velocity
 *
 * @param entries - Time series entries ordered by year ascending
 * @returns Velocity value (negative = improving, positive = declining)
 */
export function calculateVelocity(entries: Array<TimeSeriesEntry>): number {
  if (entries.length < 2) {
    return 0
  }

  const firstEntry = entries[0]
  const lastEntry = entries[entries.length - 1]
  const yearSpan = lastEntry.year - firstEntry.year

  if (yearSpan === 0) {
    return 0
  }

  // Velocity = (latest_rank - earliest_rank) / (latest_year - earliest_year)
  // Negative velocity = improving (rank decreasing)
  // Positive velocity = declining (rank increasing)
  return (lastEntry.rank - firstEntry.rank) / yearSpan
}

/**
 * Calculate volatility (standard deviation of year-over-year changes)
 * Requirement 4.2: Calculate volatility measures
 *
 * @param entries - Time series entries ordered by year ascending
 * @returns Volatility value (standard deviation)
 */
export function calculateVolatility(entries: Array<TimeSeriesEntry>): number {
  if (entries.length < 2) {
    return 0
  }

  // Calculate year-over-year rank changes
  const yearOverYearChanges: Array<number> = []
  for (let i = 1; i < entries.length; i++) {
    yearOverYearChanges.push(entries[i].rank - entries[i - 1].rank)
  }

  if (yearOverYearChanges.length === 0) {
    return 0
  }

  // Calculate mean of changes
  const mean =
    yearOverYearChanges.reduce((sum, change) => sum + change, 0) /
    yearOverYearChanges.length

  // Calculate variance
  const squaredDiffs = yearOverYearChanges.map((change) =>
    Math.pow(change - mean, 2)
  )
  const variance =
    squaredDiffs.reduce((sum, diff) => sum + diff, 0) / squaredDiffs.length

  // Return standard deviation
  return Math.sqrt(variance)
}

/**
 * Determine trend indicator based on velocity
 * Requirement 4.5: Display trend indicators (improving, declining, stable)
 *
 * @param velocity - Calculated velocity value
 * @param threshold - Stability threshold (default: 0.5)
 * @returns Trend indicator
 */
export function determineTrend(
  velocity: number,
  threshold: number = STABILITY_THRESHOLD
): TrendIndicator {
  if (velocity < -threshold) {
    return 'improving' // Rank decreasing = improving
  } else if (velocity > threshold) {
    return 'declining' // Rank increasing = declining
  }
  return 'stable'
}


/**
 * Detect anomalies in rank movements
 * Requirement 4.4: Flag significant rank movements as anomalies
 *
 * @param entries - Time series entries ordered by year ascending
 * @param threshold - Minimum rank change to flag as anomaly (default: 10)
 * @returns Array of detected anomalies
 */
export function detectAnomalies(
  entries: Array<TimeSeriesEntry>,
  threshold: number = DEFAULT_ANOMALY_THRESHOLD
): Array<Anomaly> {
  if (entries.length < 2) {
    return []
  }

  const anomalies: Array<Anomaly> = []

  for (let i = 1; i < entries.length; i++) {
    const previousEntry = entries[i - 1]
    const currentEntry = entries[i]
    const rankChange = currentEntry.rank - previousEntry.rank

    // Check if the absolute change exceeds the threshold
    const isSignificant = Math.abs(rankChange) >= threshold

    if (isSignificant) {
      anomalies.push({
        year: currentEntry.year,
        previousYear: previousEntry.year,
        rankChange,
        previousRank: previousEntry.rank,
        currentRank: currentEntry.rank,
        isSignificant: true,
        direction: rankChange < 0 ? 'improvement' : 'decline',
      })
    }
  }

  return anomalies
}

/**
 * Calculate comprehensive time series metrics
 *
 * @param entries - Time series entries ordered by year ascending
 * @returns Calculated metrics
 */
export function calculateMetrics(
  entries: Array<TimeSeriesEntry>
): TimeSeriesMetrics {
  if (entries.length === 0) {
    return {
      velocity: 0,
      volatility: 0,
      trend: 'stable',
      totalYears: 0,
      earliestYear: 0,
      latestYear: 0,
      bestRank: 0,
      worstRank: 0,
      averageRank: 0,
    }
  }

  const velocity = calculateVelocity(entries)
  const volatility = calculateVolatility(entries)
  const trend = determineTrend(velocity)

  const ranks = entries.map((e) => e.rank)
  const years = entries.map((e) => e.year)

  return {
    velocity,
    volatility,
    trend,
    totalYears: entries.length,
    earliestYear: Math.min(...years),
    latestYear: Math.max(...years),
    bestRank: Math.min(...ranks), // Lower rank is better
    worstRank: Math.max(...ranks),
    averageRank: ranks.reduce((sum, r) => sum + r, 0) / ranks.length,
  }
}


/**
 * Get time series data with comprehensive metrics
 * Requirement 4.1: Provide longitudinal data for each ranking index
 * Requirement 4.2: Calculate velocity and volatility measures
 * Requirement 4.4: Flag anomalous rank movements
 * Requirement 4.5: Display trend indicators
 *
 * @param indexId - The ranking index ID
 * @param countryCode - ISO 3166-1 alpha-3 country code
 * @param anomalyThreshold - Optional threshold for anomaly detection (default: 10)
 */
export const getTimeSeriesWithMetrics = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      indexId: z.string(),
      countryCode: z.string().length(3),
      anomalyThreshold: z
        .number()
        .optional()
        .default(DEFAULT_ANOMALY_THRESHOLD),
    })
  )
  .handler(async ({ data }): Promise<TimeSeriesWithMetrics> => {
    const { indexId, countryCode, anomalyThreshold } = data

    // Get the index details
    const index = await db.query.rankingIndices.findFirst({
      where: eq(rankingIndices.id, indexId),
    })

    // Get all ranking entries for this index and country, ordered by year ascending
    const entries = await db.query.rankingEntries.findMany({
      where: and(
        eq(rankingEntries.indexId, indexId),
        eq(rankingEntries.countryCode, countryCode)
      ),
      orderBy: [asc(rankingEntries.year)],
    })

    // Get milestones for this index
    const indexMilestones = await db.query.milestones.findMany({
      where: eq(milestones.indexId, indexId),
      orderBy: [asc(milestones.year)],
    })

    // Transform entries to time series format
    const timeSeriesEntries: Array<TimeSeriesEntry> = entries.map((e) => ({
      year: e.year,
      rank: e.rank,
      totalCountries: e.totalCountries,
      score: e.score,
      normalizedScore: e.normalizedScore,
      percentile: e.percentile,
    }))

    // Calculate metrics
    const metrics = calculateMetrics(timeSeriesEntries)

    // Detect anomalies
    const anomalies = detectAnomalies(timeSeriesEntries, anomalyThreshold)

    // Transform milestones to the expected format
    const transformedMilestones: Array<Milestone> = indexMilestones.map(
      (m) => ({
        id: m.id,
        indexId: m.indexId,
        year: m.year,
        event: m.event,
        impact: m.impact as 'positive' | 'negative' | 'neutral',
        source: m.source ?? undefined,
      })
    )

    return {
      indexId,
      countryCode,
      index: index
        ? {
            id: index.id,
            name: index.name,
            shortName: index.shortName,
            source: index.source,
            sourceUrl: index.sourceUrl,
            higherIsBetter: index.higherIsBetter,
          }
        : null,
      entries: timeSeriesEntries,
      metrics,
      anomalies,
      milestones: transformedMilestones,
    }
  })


/**
 * Milestone with associated time series data point
 */
export interface MilestoneWithContext {
  milestone: Milestone
  rankingEntry: TimeSeriesEntry | null
  previousEntry: TimeSeriesEntry | null
  rankChangeFromPrevious: number | null
}

/**
 * Get milestones for an index with associated time series context
 * Requirement 4.3: Support milestone annotations linking events to ranking shifts
 *
 * @param indexId - The ranking index ID
 * @param countryCode - Optional country code to get country-specific context
 */
export const getMilestonesForIndex = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      indexId: z.string(),
      countryCode: z.string().length(3).optional(),
    })
  )
  .handler(async ({ data }): Promise<Array<MilestoneWithContext>> => {
    const { indexId, countryCode } = data

    // Get milestones for this index
    const indexMilestones = await db.query.milestones.findMany({
      where: eq(milestones.indexId, indexId),
      orderBy: [asc(milestones.year)],
    })

    // If no country code provided, return milestones without ranking context
    if (!countryCode) {
      return indexMilestones.map((m) => ({
        milestone: {
          id: m.id,
          indexId: m.indexId,
          year: m.year,
          event: m.event,
          impact: m.impact as 'positive' | 'negative' | 'neutral',
          source: m.source ?? undefined,
        },
        rankingEntry: null,
        previousEntry: null,
        rankChangeFromPrevious: null,
      }))
    }

    // Get ranking entries for context
    const entries = await db.query.rankingEntries.findMany({
      where: and(
        eq(rankingEntries.indexId, indexId),
        eq(rankingEntries.countryCode, countryCode)
      ),
      orderBy: [asc(rankingEntries.year)],
    })

    // Create a map of year to entry for quick lookup
    const entriesByYear = new Map<number, TimeSeriesEntry>()
    entries.forEach((e) => {
      entriesByYear.set(e.year, {
        year: e.year,
        rank: e.rank,
        totalCountries: e.totalCountries,
        score: e.score,
        normalizedScore: e.normalizedScore,
        percentile: e.percentile,
      })
    })

    // Associate milestones with ranking entries
    return indexMilestones.map((m) => {
      const rankingEntry = entriesByYear.get(m.year) ?? null

      // Find the previous year's entry
      let previousEntry: TimeSeriesEntry | null = null
      const sortedYears = Array.from(entriesByYear.keys()).sort((a, b) => a - b)
      const currentYearIndex = sortedYears.indexOf(m.year)

      if (currentYearIndex > 0) {
        previousEntry =
          entriesByYear.get(sortedYears[currentYearIndex - 1]) ?? null
      }

      // Calculate rank change from previous year
      let rankChangeFromPrevious: number | null = null
      if (rankingEntry && previousEntry) {
        rankChangeFromPrevious = rankingEntry.rank - previousEntry.rank
      }

      return {
        milestone: {
          id: m.id,
          indexId: m.indexId,
          year: m.year,
          event: m.event,
          impact: m.impact as 'positive' | 'negative' | 'neutral',
          source: m.source ?? undefined,
        },
        rankingEntry,
        previousEntry,
        rankChangeFromPrevious,
      }
    })
  })


/**
 * Link milestones to time series data points
 * Returns time series entries with associated milestones
 * Requirement 4.3: Link milestones to time series data points
 */
export const getTimeSeriesWithMilestones = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      indexId: z.string(),
      countryCode: z.string().length(3),
    })
  )
  .handler(async ({ data }) => {
    const { indexId, countryCode } = data

    // Get ranking entries
    const entries = await db.query.rankingEntries.findMany({
      where: and(
        eq(rankingEntries.indexId, indexId),
        eq(rankingEntries.countryCode, countryCode)
      ),
      orderBy: [asc(rankingEntries.year)],
    })

    // Get milestones
    const indexMilestones = await db.query.milestones.findMany({
      where: eq(milestones.indexId, indexId),
      orderBy: [asc(milestones.year)],
    })

    // Create a map of year to milestones
    const milestonesByYear = new Map<number, Array<Milestone>>()
    indexMilestones.forEach((m) => {
      const milestone: Milestone = {
        id: m.id,
        indexId: m.indexId,
        year: m.year,
        event: m.event,
        impact: m.impact as 'positive' | 'negative' | 'neutral',
        source: m.source ?? undefined,
      }

      const existing = milestonesByYear.get(m.year) ?? []
      existing.push(milestone)
      milestonesByYear.set(m.year, existing)
    })

    // Transform entries with associated milestones
    return entries.map((e) => ({
      entry: {
        year: e.year,
        rank: e.rank,
        totalCountries: e.totalCountries,
        score: e.score,
        normalizedScore: e.normalizedScore,
        percentile: e.percentile,
      },
      milestones: milestonesByYear.get(e.year) ?? [],
    }))
  })
