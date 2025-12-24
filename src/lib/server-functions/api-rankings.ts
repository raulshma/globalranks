/**
 * Rankings API Server Function
 * Requirements: 1.7, 10.2
 *
 * Provides REST API access to ranking data with:
 * - Query params for filtering
 * - Paginated results with metadata
 * - Source citations in responses
 */

import { createServerFn } from '@tanstack/react-start'
import { and, asc, desc, eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/lib/db'
import { countries, rankingEntries, rankingIndices } from '@/lib/db/schema'
import { createRateLimitError, rateLimiters } from '@/lib/rate-limit'

// Validation schema for API query parameters
const rankingsQuerySchema = z.object({
  country: z.string().length(3).optional(),
  domain: z.string().optional(),
  index: z.string().optional(),
  year: z.number().optional(),
  yearStart: z.number().optional(),
  yearEnd: z.number().optional(),
  search: z.string().optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(20),
  clientId: z.string().optional(),
})

export type RankingsQueryParams = z.infer<typeof rankingsQuerySchema>

/**
 * Get paginated rankings with filtering
 * Requirement 10.2: Expose REST API for programmatic data access
 * Requirement 1.7: Include source citations in responses
 */
export const getRankingsApi = createServerFn({ method: 'GET' })
  .inputValidator(rankingsQuerySchema)
  .handler(async ({ data }) => {
    const {
      country: countryCode,
      domain: domainId,
      index: indexId,
      year,
      yearStart,
      yearEnd,
      search,
      page,
      pageSize,
      clientId = 'anonymous',
    } = data

    // Rate limiting check using the standard rate limiter
    const rateCheck = rateLimiters.standard(clientId)
    if (!rateCheck.allowed) {
      return createRateLimitError(rateCheck)
    }

    // Build conditions array
    const conditions = []

    if (countryCode) {
      conditions.push(eq(rankingEntries.countryCode, countryCode))
    }

    if (indexId) {
      conditions.push(eq(rankingEntries.indexId, indexId))
    }

    if (year) {
      conditions.push(eq(rankingEntries.year, year))
    }

    if (yearStart) {
      conditions.push(sql`${rankingEntries.year} >= ${yearStart}`)
    }

    if (yearEnd) {
      conditions.push(sql`${rankingEntries.year} <= ${yearEnd}`)
    }

    if (domainId) {
      conditions.push(eq(rankingIndices.domainId, domainId))
    }

    if (search) {
      conditions.push(
        sql`(${rankingIndices.name} LIKE ${'%' + search + '%'} OR ${rankingIndices.source} LIKE ${'%' + search + '%'})`
      )
    }

    // Get total count for pagination
    const countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(rankingEntries)
      .innerJoin(rankingIndices, eq(rankingEntries.indexId, rankingIndices.id))

    if (conditions.length > 0) {
      countQuery.where(and(...conditions))
    }

    const countResult = await countQuery
    const total = countResult[0]?.count || 0

    // Fetch paginated results with relations
    const query = db
      .select({
        id: rankingEntries.id,
        indexId: rankingEntries.indexId,
        countryCode: rankingEntries.countryCode,
        year: rankingEntries.year,
        rank: rankingEntries.rank,
        totalCountries: rankingEntries.totalCountries,
        score: rankingEntries.score,
        normalizedScore: rankingEntries.normalizedScore,
        percentile: rankingEntries.percentile,
        confidence: rankingEntries.confidence,
        subMetrics: rankingEntries.subMetrics,
        // Index details with source citations (Requirement 1.7)
        indexName: rankingIndices.name,
        indexShortName: rankingIndices.shortName,
        source: rankingIndices.source,
        sourceUrl: rankingIndices.sourceUrl,
        methodology: rankingIndices.methodology,
        domainId: rankingIndices.domainId,
        higherIsBetter: rankingIndices.higherIsBetter,
        // Country details
        countryName: countries.name,
        countryRegion: countries.region,
        countryIncomeLevel: countries.incomeLevel,
      })
      .from(rankingEntries)
      .innerJoin(rankingIndices, eq(rankingEntries.indexId, rankingIndices.id))
      .innerJoin(countries, eq(rankingEntries.countryCode, countries.code))

    if (conditions.length > 0) {
      query.where(and(...conditions))
    }

    // Apply ordering and pagination
    const results = await query
      .orderBy(desc(rankingEntries.year), asc(rankingEntries.rank))
      .limit(pageSize)
      .offset((page - 1) * pageSize)

    // Transform results to include source citations
    const responseData = results.map((row) => ({
      id: row.id,
      indexId: row.indexId,
      countryCode: row.countryCode,
      year: row.year,
      rank: row.rank,
      totalCountries: row.totalCountries,
      score: row.score,
      normalizedScore: row.normalizedScore,
      percentile: row.percentile,
      confidence: row.confidence,
      subMetrics: row.subMetrics ? JSON.parse(row.subMetrics) : null,
      index: {
        name: row.indexName,
        shortName: row.indexShortName,
        domainId: row.domainId,
        higherIsBetter: row.higherIsBetter,
        // Source citations (Requirement 1.7)
        source: row.source,
        sourceUrl: row.sourceUrl,
        methodology: row.methodology,
      },
      country: {
        code: row.countryCode,
        name: row.countryName,
        region: row.countryRegion,
        incomeLevel: row.countryIncomeLevel,
      },
    }))

    return {
      data: responseData,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        hasMore: page * pageSize < total,
      },
      filters: {
        country: countryCode,
        domain: domainId,
        index: indexId,
        year,
        yearStart,
        yearEnd,
        search,
      },
    }
  })

// Export type for the response
export type RankingsApiResponse = Awaited<ReturnType<typeof getRankingsApi>>
