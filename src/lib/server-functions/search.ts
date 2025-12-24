/**
 * Server functions for filtering and search
 * Requirements: 2.3, 2.5
 */

import { asc, desc, like, or } from 'drizzle-orm'
import { z } from 'zod'
import { createServerFn } from '@tanstack/react-start'
import { db } from '../db'
import { rankingEntries, rankingIndices } from '../db/schema'

// Filter schema for comprehensive filtering
const filterSchema = z.object({
  domain: z.string().optional(),
  year: z.number().optional(),
  yearStart: z.number().optional(),
  yearEnd: z.number().optional(),
  source: z.string().optional(),
  methodology: z.string().optional(),
  countryCode: z.string().length(3).optional(),
})

// Search schema
const searchSchema = z.object({
  query: z.string().min(1),
  limit: z.number().optional().default(20),
})

/**
 * Build filter conditions for ranking queries
 * Requirement 2.3: Display rankings by category, year, source, or methodology
 */
export const searchRankingIndices = createServerFn({ method: 'GET' })
  .inputValidator(searchSchema)
  .handler(async ({ data }) => {
    const { query, limit } = data
    const searchPattern = `%${query.toLowerCase()}%`

    // Search across index names, descriptions, and sources
    const indices = await db.query.rankingIndices.findMany({
      where: or(
        like(rankingIndices.name, searchPattern),
        like(rankingIndices.shortName, searchPattern),
        like(rankingIndices.source, searchPattern),
        like(rankingIndices.methodology, searchPattern)
      ),
      with: {
        domain: true,
      },
      orderBy: [asc(rankingIndices.name)],
      limit,
    })

    return indices
  })


/**
 * Get filtered rankings with comprehensive filter support
 * Requirement 2.3: Display rankings by category, year, source, or methodology
 * Requirement 2.5: Provide filtering and search capabilities
 */
export const getFilteredRankings = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      filters: filterSchema,
      searchQuery: z.string().optional(),
      limit: z.number().optional().default(100),
      offset: z.number().optional().default(0),
    })
  )
  .handler(async ({ data }) => {
    const { filters, searchQuery, limit, offset } = data

    // Get all ranking entries with relations
    let rankings = await db.query.rankingEntries.findMany({
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

    // Apply filters
    if (filters.countryCode) {
      rankings = rankings.filter((r) => r.countryCode === filters.countryCode)
    }

    if (filters.domain) {
      rankings = rankings.filter((r) => r.index.domainId === filters.domain)
    }

    if (filters.year) {
      rankings = rankings.filter((r) => r.year === filters.year)
    }

    if (filters.yearStart) {
      rankings = rankings.filter((r) => r.year >= filters.yearStart!)
    }

    if (filters.yearEnd) {
      rankings = rankings.filter((r) => r.year <= filters.yearEnd!)
    }

    if (filters.source) {
      const sourceLower = filters.source.toLowerCase()
      rankings = rankings.filter((r) =>
        r.index.source.toLowerCase().includes(sourceLower)
      )
    }

    if (filters.methodology) {
      const methodologyLower = filters.methodology.toLowerCase()
      rankings = rankings.filter((r) =>
        r.index.methodology.toLowerCase().includes(methodologyLower)
      )
    }

    // Apply search query across index names and descriptions
    if (searchQuery) {
      const queryLower = searchQuery.toLowerCase()
      rankings = rankings.filter(
        (r) =>
          r.index.name.toLowerCase().includes(queryLower) ||
          r.index.shortName.toLowerCase().includes(queryLower) ||
          r.index.source.toLowerCase().includes(queryLower) ||
          r.index.methodology.toLowerCase().includes(queryLower)
      )
    }

    // Get total count before pagination
    const total = rankings.length

    // Apply pagination
    const paginated = rankings.slice(offset, offset + limit)

    return {
      data: paginated,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    }
  })

/**
 * Get available filter options (domains, years, sources)
 * Useful for populating filter dropdowns
 */
export const getFilterOptions = createServerFn({ method: 'GET' }).handler(
  async () => {
    // Get all domains
    const domains = await db.query.domains.findMany({
      orderBy: (d, { asc: ascFn }) => [ascFn(d.name)],
    })

    // Get all indices for source options
    const indices = await db.query.rankingIndices.findMany({
      orderBy: (idx, { asc: ascFn }) => [ascFn(idx.source)],
    })

    // Get unique sources
    const sources = [...new Set(indices.map((i) => i.source))].sort()

    // Get all ranking entries for year options
    const entries = await db.query.rankingEntries.findMany({
      columns: {
        year: true,
      },
    })

    // Get unique years
    const years = [...new Set(entries.map((e) => e.year))].sort((a, b) => b - a)

    return {
      domains,
      sources,
      years,
      methodologies: [...new Set(indices.map((i) => i.methodology))].sort(),
    }
  }
)
