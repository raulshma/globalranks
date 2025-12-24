/**
 * Rankings utility functions for the Global Rankings Platform
 * Requirements: 1.2, 2.4
 */

/**
 * Configuration for score normalization
 */
export interface NormalizationConfig {
  min: number // Minimum value in the original scoring system
  max: number // Maximum value in the original scoring system
  higherIsBetter: boolean // Whether higher scores are better
}

/**
 * Normalizes a score to a 0-100 range.
 *
 * Handles different scoring systems:
 * - Higher-is-better: score 100 = best, score 0 = worst
 * - Lower-is-better: score 100 = best (lowest original), score 0 = worst (highest original)
 *
 * Edge cases:
 * - Returns null for null/undefined scores
 * - Clamps out-of-range values to 0-100
 * - Handles min === max by returning 50 (midpoint)
 *
 * Requirement 1.2: Normalize disparate scoring systems into unified analytical layer
 *
 * @param score - The original score value (can be null)
 * @param config - Configuration specifying the scoring system
 * @returns Normalized score in 0-100 range, or null if input is null
 */
export function normalizeScore(
  score: number | null | undefined,
  config: NormalizationConfig
): number | null {
  // Handle null/undefined scores
  if (score === null || score === undefined) {
    return null
  }

  const { min, max, higherIsBetter } = config

  // Handle edge case where min equals max (no range)
  if (min === max) {
    return 50 // Return midpoint when there's no range
  }

  // Calculate the normalized value (0-1 range first)
  let normalized: number

  if (higherIsBetter) {
    // Higher original score = higher normalized score
    normalized = (score - min) / (max - min)
  } else {
    // Lower original score = higher normalized score (inverted)
    normalized = (max - score) / (max - min)
  }

  // Scale to 0-100 and clamp to valid range
  const scaledScore = normalized * 100

  // Clamp to 0-100 range for out-of-range values
  return Math.max(0, Math.min(100, scaledScore))
}


/**
 * Calculates the percentile rank from absolute rank and total countries.
 *
 * Formula: percentile = ((totalCountries - rank + 1) / totalCountries) * 100
 *
 * This means:
 * - Rank 1 out of 100 = 100th percentile (top performer)
 * - Rank 100 out of 100 = 1st percentile (bottom performer)
 *
 * Edge cases:
 * - Rank 1: Returns 100 (top percentile)
 * - Last rank: Returns value close to 0 (bottom percentile)
 * - Invalid inputs (rank < 1, totalCountries < 1, rank > totalCountries): Returns null
 *
 * Requirement 2.4: Show percentile rank
 *
 * @param rank - The absolute rank (1 = best)
 * @param totalCountries - Total number of countries in the ranking
 * @returns Percentile value (0-100), or null for invalid inputs
 */
export function calculatePercentile(
  rank: number,
  totalCountries: number
): number | null {
  // Validate inputs
  if (rank < 1 || totalCountries < 1 || rank > totalCountries) {
    return null
  }

  // Handle edge case of single country
  if (totalCountries === 1) {
    return 100 // Only country is at 100th percentile
  }

  // Calculate percentile: higher rank number = lower percentile
  // Rank 1 should be 100th percentile, last rank should be close to 0
  const percentile = ((totalCountries - rank + 1) / totalCountries) * 100

  return percentile
}
