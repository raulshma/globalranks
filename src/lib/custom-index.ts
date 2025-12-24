/**
 * Custom Index Builder utility functions
 * Requirements: 6.3, 6.5
 */

import type { CustomIndexComponent, RankingEntry } from './types'

/**
 * Validation error for custom index configuration
 */
export interface WeightValidationError {
  type: 'sum_not_100' | 'negative_weight' | 'weight_exceeds_100' | 'empty_components' | 'duplicate_index'
  message: string
  details?: {
    actualSum?: number
    invalidWeight?: number
    duplicateIndexId?: string
  }
}

/**
 * Result of weight validation
 */
export interface WeightValidationResult {
  valid: boolean
  errors: Array<WeightValidationError>
}

/**
 * Validates that custom index weights sum to exactly 100.
 * 
 * Validation rules:
 * - Components array must not be empty
 * - Each weight must be >= 0
 * - Each weight must be <= 100
 * - Sum of all weights must equal 100 (with 0.01 tolerance for floating point)
 * - No duplicate index IDs
 * 
 * Requirement 6.5: Validate that weights sum to 100%
 * 
 * @param components - Array of custom index components with weights
 * @returns Validation result with valid flag and any errors
 */
export function validateWeights(components: Array<CustomIndexComponent>): WeightValidationResult {
  const errors: Array<WeightValidationError> = []

  // Check for empty components
  if (components.length === 0) {
    errors.push({
      type: 'empty_components',
      message: 'At least one index component is required',
    })
    return { valid: false, errors }
  }

  // Check for duplicate index IDs
  const indexIds = new Set<string>()
  for (const component of components) {
    if (indexIds.has(component.indexId)) {
      errors.push({
        type: 'duplicate_index',
        message: `Duplicate index ID: ${component.indexId}`,
        details: { duplicateIndexId: component.indexId },
      })
    }
    indexIds.add(component.indexId)
  }

  // Check individual weights
  for (const component of components) {
    if (component.weight < 0) {
      errors.push({
        type: 'negative_weight',
        message: `Weight cannot be negative: ${component.weight} for index ${component.indexId}`,
        details: { invalidWeight: component.weight },
      })
    }
    if (component.weight > 100) {
      errors.push({
        type: 'weight_exceeds_100',
        message: `Weight cannot exceed 100: ${component.weight} for index ${component.indexId}`,
        details: { invalidWeight: component.weight },
      })
    }
  }

  // Calculate sum and check if it equals 100
  const totalWeight = components.reduce((sum, c) => sum + c.weight, 0)
  const TOLERANCE = 0.01 // Floating point tolerance

  if (Math.abs(totalWeight - 100) > TOLERANCE) {
    errors.push({
      type: 'sum_not_100',
      message: `Weights must sum to 100, but got ${totalWeight.toFixed(2)}`,
      details: { actualSum: totalWeight },
    })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Result of composite score calculation
 */
export interface CompositeScoreResult {
  score: number | null
  componentsUsed: number
  componentsMissing: number
  missingIndexIds: Array<string>
}

/**
 * Map of index ID to normalized score for composite calculation
 */
export type IndexScoreMap = Map<string, number | null>

/**
 * Calculates a composite score using weighted average of normalized scores.
 * 
 * Formula: compositeScore = Σ(normalized_score_i × weight_i / 100)
 * 
 * Handles missing data gracefully:
 * - If some indices have missing scores, calculates using available data
 * - Re-normalizes weights for available indices to maintain proportions
 * - Returns null only if ALL indices have missing scores
 * 
 * Requirement 6.3: Calculate composite "Performance Score" based on user-defined weights
 * 
 * @param components - Array of custom index components with weights
 * @param scores - Map of index ID to normalized score (0-100 or null)
 * @returns Composite score result with score and missing data info
 */
export function calculateCompositeScore(
  components: Array<CustomIndexComponent>,
  scores: IndexScoreMap
): CompositeScoreResult {
  if (components.length === 0) {
    return {
      score: null,
      componentsUsed: 0,
      componentsMissing: 0,
      missingIndexIds: [],
    }
  }

  const missingIndexIds: Array<string> = []
  let availableWeightSum = 0
  let weightedScoreSum = 0

  // Calculate weighted sum for available scores
  for (const component of components) {
    const normalizedScore = scores.get(component.indexId)

    if (normalizedScore === null || normalizedScore === undefined) {
      missingIndexIds.push(component.indexId)
    } else {
      availableWeightSum += component.weight
      weightedScoreSum += normalizedScore * component.weight
    }
  }

  const componentsUsed = components.length - missingIndexIds.length
  const componentsMissing = missingIndexIds.length

  // If no scores available, return null
  if (availableWeightSum === 0) {
    return {
      score: null,
      componentsUsed,
      componentsMissing,
      missingIndexIds,
    }
  }

  // Calculate composite score, re-normalizing for available weights
  // This maintains proportional weighting when some data is missing
  const compositeScore = weightedScoreSum / availableWeightSum

  return {
    score: compositeScore,
    componentsUsed,
    componentsMissing,
    missingIndexIds,
  }
}

/**
 * Creates an IndexScoreMap from ranking entries for composite calculation
 * 
 * @param entries - Array of ranking entries with normalized scores
 * @returns Map of index ID to normalized score
 */
export function createScoreMapFromEntries(entries: Array<RankingEntry>): IndexScoreMap {
  const scoreMap: IndexScoreMap = new Map()

  for (const entry of entries) {
    scoreMap.set(entry.indexId, entry.normalizedScore)
  }

  return scoreMap
}
