/**
 * Server functions for custom index CRUD operations
 * Requirements: 6.1, 6.2, 6.4
 */

import { and, eq, or } from 'drizzle-orm'
import { z } from 'zod'
import { createServerFn } from '@tanstack/react-start'
import { db } from '../db'
import { customIndices, rankingEntries } from '../db/schema'
import { calculateCompositeScore, validateWeights } from '../custom-index'
import type { CustomIndex, CustomIndexComponent } from '../types'
import type { IndexScoreMap } from '../custom-index'

// Zod schema for custom index component
const customIndexComponentSchema = z.object({
  indexId: z.string().min(1),
  weight: z.number().min(0).max(100),
})

// Zod schema for creating/updating custom index
const customIndexInputSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  components: z.array(customIndexComponentSchema).min(1, 'At least one component is required'),
  isPublic: z.boolean().default(false),
})

/**
 * Generate a unique ID for custom indices
 */
function generateId(): string {
  return `ci_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Save a new custom index
 * 
 * Requirement 6.1: Allow users to select multiple indices across domains
 * Requirement 6.2: Allow users to assign weights to each selected index
 * Requirement 6.4: Allow users to save, name, and share their custom indices
 */
export const saveCustomIndex = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      userId: z.string().min(1),
      data: customIndexInputSchema,
    })
  )
  .handler(async ({ data: { userId, data } }) => {
    // Validate weights sum to 100
    const validation = validateWeights(data.components)
    if (!validation.valid) {
      throw new Error(validation.errors.map(e => e.message).join('; '))
    }

    const id = generateId()
    const now = new Date()

    const [inserted] = await db
      .insert(customIndices)
      .values({
        id,
        name: data.name,
        userId,
        components: JSON.stringify(data.components),
        isPublic: data.isPublic,
        createdAt: now,
        updatedAt: now,
      })
      .returning()

    return {
      ...inserted,
      components: data.components,
    } as CustomIndex
  })

/**
 * Get a custom index by ID
 * 
 * Requirement 6.4: Allow users to save, name, and share their custom indices
 */
export const getCustomIndex = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      id: z.string().min(1),
      userId: z.string().optional(), // Optional: for access control
    })
  )
  .handler(async ({ data: { id, userId } }) => {
    const customIndex = await db.query.customIndices.findFirst({
      where: eq(customIndices.id, id),
    })

    if (!customIndex) {
      throw new Error(`Custom index not found: ${id}`)
    }

    // Check access: either public or owned by user
    if (!customIndex.isPublic && userId && customIndex.userId !== userId) {
      throw new Error('Access denied: This custom index is private')
    }

    // Parse components from JSON
    const components = JSON.parse(customIndex.components) as Array<CustomIndexComponent>

    return {
      ...customIndex,
      components,
    } as CustomIndex
  })


/**
 * Get all custom indices for a user (including public ones)
 * 
 * Requirement 6.4: Allow users to save, name, and share their custom indices
 */
export const getUserCustomIndices = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      userId: z.string().min(1),
      includePublic: z.boolean().default(true),
    })
  )
  .handler(async ({ data: { userId, includePublic } }) => {
    let indices

    if (includePublic) {
      // Get user's indices and all public indices
      indices = await db.query.customIndices.findMany({
        where: or(
          eq(customIndices.userId, userId),
          eq(customIndices.isPublic, true)
        ),
      })
    } else {
      // Get only user's indices
      indices = await db.query.customIndices.findMany({
        where: eq(customIndices.userId, userId),
      })
    }

    // Parse components for each index
    return indices.map((index) => ({
      ...index,
      components: JSON.parse(index.components) as Array<CustomIndexComponent>,
    })) as Array<CustomIndex>
  })

/**
 * Update an existing custom index
 * 
 * Requirement 6.4: Allow users to save, name, and share their custom indices
 */
export const updateCustomIndex = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      id: z.string().min(1),
      userId: z.string().min(1),
      data: customIndexInputSchema.partial(), // Allow partial updates
    })
  )
  .handler(async ({ data: { id, userId, data } }) => {
    // Check ownership
    const existing = await db.query.customIndices.findFirst({
      where: and(
        eq(customIndices.id, id),
        eq(customIndices.userId, userId)
      ),
    })

    if (!existing) {
      throw new Error('Custom index not found or access denied')
    }

    // If components are being updated, validate weights
    if (data.components) {
      const validation = validateWeights(data.components)
      if (!validation.valid) {
        throw new Error(validation.errors.map(e => e.message).join('; '))
      }
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    }

    if (data.name !== undefined) {
      updateData.name = data.name
    }
    if (data.components !== undefined) {
      updateData.components = JSON.stringify(data.components)
    }
    if (data.isPublic !== undefined) {
      updateData.isPublic = data.isPublic
    }

    const [updated] = await db
      .update(customIndices)
      .set(updateData)
      .where(eq(customIndices.id, id))
      .returning()

    return {
      ...updated,
      components: data.components ?? JSON.parse(existing.components) as Array<CustomIndexComponent>,
    } as CustomIndex
  })

/**
 * Delete a custom index
 * 
 * Requirement 6.4: Allow users to save, name, and share their custom indices
 */
export const deleteCustomIndex = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      id: z.string().min(1),
      userId: z.string().min(1),
    })
  )
  .handler(async ({ data: { id, userId } }) => {
    // Check ownership
    const existing = await db.query.customIndices.findFirst({
      where: and(
        eq(customIndices.id, id),
        eq(customIndices.userId, userId)
      ),
    })

    if (!existing) {
      throw new Error('Custom index not found or access denied')
    }

    await db.delete(customIndices).where(eq(customIndices.id, id))

    return { success: true, deletedId: id }
  })

/**
 * Calculate composite score for a custom index and country
 * 
 * Requirement 6.3: Calculate and display a composite "Performance Score"
 */
export const calculateCustomIndexScore = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      customIndexId: z.string().min(1),
      countryCode: z.string().length(3),
      year: z.number().optional(),
    })
  )
  .handler(async ({ data: { customIndexId, countryCode, year } }) => {
    // Get the custom index
    const customIndex = await db.query.customIndices.findFirst({
      where: eq(customIndices.id, customIndexId),
    })

    if (!customIndex) {
      throw new Error(`Custom index not found: ${customIndexId}`)
    }

    const components = JSON.parse(customIndex.components) as Array<CustomIndexComponent>
    const indexIds = components.map(c => c.indexId)

    // Get ranking entries for the component indices
    const entries = await db.query.rankingEntries.findMany({
      where: eq(rankingEntries.countryCode, countryCode),
      with: {
        index: true,
      },
    })

    // Filter to relevant indices and optionally by year
    let relevantEntries = entries.filter(e => indexIds.includes(e.indexId))

    if (year) {
      relevantEntries = relevantEntries.filter(e => e.year === year)
    } else {
      // Get latest year for each index
      const latestByIndex = new Map<string, typeof entries[0]>()
      for (const entry of relevantEntries) {
        const existing = latestByIndex.get(entry.indexId)
        if (!existing || entry.year > existing.year) {
          latestByIndex.set(entry.indexId, entry)
        }
      }
      relevantEntries = Array.from(latestByIndex.values())
    }

    // Create score map
    const scoreMap: IndexScoreMap = new Map()
    for (const entry of relevantEntries) {
      scoreMap.set(entry.indexId, entry.normalizedScore)
    }

    // Calculate composite score
    const result = calculateCompositeScore(components, scoreMap)

    return {
      customIndex: {
        ...customIndex,
        components,
      },
      countryCode,
      year: year ?? 'latest',
      ...result,
      entriesUsed: relevantEntries.map(e => ({
        indexId: e.indexId,
        indexName: e.index.name,
        normalizedScore: e.normalizedScore,
        year: e.year,
      })),
    }
  })
