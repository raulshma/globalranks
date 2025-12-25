/**
 * Server functions for domain data
 * Requirements: 3.2, 3.4
 */

import { asc, desc, eq } from "drizzle-orm"
import { z } from "zod"
import { createServerFn } from "@tanstack/react-start"
import { setResponseHeader } from "@tanstack/react-start/server"
import { db } from "../db"
import { domains, rankingEntries } from "../db/schema"
import { CDN_CACHE } from "../cache-config"
import { CACHE_TTL, cacheKey, withCache } from "../cache"

/**
 * Get all domains with their indices and aggregate statistics
 * Requirement 3.2: Display all indices within a domain with summary statistics
 * Requirement 3.4: Highlight best and worst performing indices per domain
 */
export const getAllDomainsWithStats = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      countryCode: z.string().length(3),
    })
  )
  .handler(async ({ data }) => {
    const { countryCode } = data

    // Cache for 30 minutes (REFERENCE data - domain stats)
    setResponseHeader('Cache-Control', CDN_CACHE.REFERENCE)

    // Redis cache: domain stats by country
    return withCache(
      cacheKey('domains', 'stats', countryCode),
      CACHE_TTL.REFERENCE,
      async () => {
        // Get all domains
        const allDomains = await db.query.domains.findMany({
          orderBy: [asc(domains.name)],
          with: {
            indices: true,
          },
        })

        // Get all rankings for the country (all years) to find the latest per index
        const allRankings = await db.query.rankingEntries.findMany({
          where: eq(rankingEntries.countryCode, countryCode),
          with: {
            index: {
              with: {
                domain: true,
              },
            },
          },
          orderBy: [desc(rankingEntries.year)],
        })

        // Group rankings by indexId and get the latest entry for each
        const latestRankingsMap = new Map<string, typeof allRankings[0]>()
        const previousRankingsMap = new Map<string, typeof allRankings[0]>()
        
        for (const ranking of allRankings) {
          const indexId = ranking.indexId
          if (!latestRankingsMap.has(indexId)) {
            // First entry for this index (since ordered by year desc, it's the latest)
            latestRankingsMap.set(indexId, ranking)
          } else {
            // Check if this is the previous year's entry for trend calculation
            const latestEntry = latestRankingsMap.get(indexId)!
            if (ranking.year === latestEntry.year - 1 && !previousRankingsMap.has(indexId)) {
              previousRankingsMap.set(indexId, ranking)
            }
          }
        }

        const latestRankings = Array.from(latestRankingsMap.values())
        
        // Determine the latest year from the data (for display purposes)
        const latestYear = latestRankings.length > 0 
          ? Math.max(...latestRankings.map(r => r.year))
          : new Date().getFullYear()



        // Build domain stats
        const domainsWithStats = allDomains.map((domain) => {
          const domainRankings = latestRankings.filter(
            (r) => r.index.domainId === domain.id
          )

          if (domainRankings.length === 0) {
            return {
              ...domain,
              stats: {
                totalIndices: domain.indices.length,
                rankedIndices: 0,
                avgPercentile: 0,
                avgRankChange: 0,
                bestIndex: null,
                worstIndex: null,
              },
              rankings: [],
            }
          }

          // Calculate rank changes
          const rankingsWithChange = domainRankings.map((ranking) => {
            const previous = previousRankingsMap.get(ranking.indexId)
            const rankChange = previous ? previous.rank - ranking.rank : 0
            return {
              ...ranking,
              rankChange,
              previousRank: previous?.rank ?? null,
            }
          })

          const avgPercentile =
            domainRankings.reduce((sum, r) => sum + r.percentile, 0) /
            domainRankings.length

          const avgRankChange =
            rankingsWithChange.reduce((sum, r) => sum + r.rankChange, 0) /
            rankingsWithChange.length

          // Sort by percentile to find best/worst
          const sortedByPercentile = [...rankingsWithChange].sort(
            (a, b) => b.percentile - a.percentile
          )
          const bestIndex = sortedByPercentile[0]
          const worstIndex = sortedByPercentile[sortedByPercentile.length - 1]

          return {
            ...domain,
            stats: {
              totalIndices: domain.indices.length,
              rankedIndices: domainRankings.length,
              avgPercentile,
              avgRankChange,
              bestIndex: {
                id: bestIndex.index.id,
                name: bestIndex.index.name,
                shortName: bestIndex.index.shortName,
                rank: bestIndex.rank,
                totalCountries: bestIndex.totalCountries,
                percentile: bestIndex.percentile,
                rankChange: bestIndex.rankChange,
              },
              worstIndex: {
                id: worstIndex.index.id,
                name: worstIndex.index.name,
                shortName: worstIndex.index.shortName,
                rank: worstIndex.rank,
                totalCountries: worstIndex.totalCountries,
                percentile: worstIndex.percentile,
                rankChange: worstIndex.rankChange,
              },
            },
            rankings: rankingsWithChange.map((r) => ({
              indexId: r.index.id,
              indexName: r.index.name,
              shortName: r.index.shortName,
              source: r.index.source,
              rank: r.rank,
              totalCountries: r.totalCountries,
              percentile: r.percentile,
              score: r.score,
              normalizedScore: r.normalizedScore,
              rankChange: r.rankChange,
              previousRank: r.previousRank,
            })),
          }
        })

        return {
          countryCode,
          latestYear,
          domains: domainsWithStats,
        }
      }
    )
  })

/**
 * Get a single domain with all its indices and rankings
 * Requirement 3.2: Display all indices within a domain
 */
export const getDomainWithIndices = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      domainId: z.string(),
      countryCode: z.string().length(3),
    })
  )
  .handler(async ({ data }) => {
    const { domainId, countryCode } = data

    // Cache for 30 minutes (REFERENCE data - domain detail with rankings)
    setResponseHeader('Cache-Control', CDN_CACHE.REFERENCE)

    // Redis cache: domain with indices by domain and country
    return withCache(
      cacheKey('domain', domainId, countryCode),
      CACHE_TTL.REFERENCE,
      async () => {
        // Get the domain
        const domain = await db.query.domains.findFirst({
          where: eq(domains.id, domainId),
          with: {
            indices: true,
          },
        })

        if (!domain) {
          throw new Error(`Domain not found: ${domainId}`)
        }

        // Get all rankings for this domain's indices
        const indexIds = domain.indices.map((i) => i.id)

        // Get all rankings for the country for this domain's indices (all years)
        const allRankings = await db.query.rankingEntries.findMany({
          where: (entries, { and: andFn, eq: eqFn, inArray }) =>
            andFn(
              eqFn(entries.countryCode, countryCode),
              inArray(entries.indexId, indexIds)
            ),
          with: {
            index: true,
          },
          orderBy: [desc(rankingEntries.year)],
        })

        // Group rankings by indexId and get the latest entry for each
        const latestRankingsMap = new Map<string, typeof allRankings[0]>()
        const previousRankingsMap = new Map<string, typeof allRankings[0]>()
        
        for (const ranking of allRankings) {
          const indexId = ranking.indexId
          if (!latestRankingsMap.has(indexId)) {
            // First entry for this index (since ordered by year desc, it's the latest)
            latestRankingsMap.set(indexId, ranking)
          } else {
            // Check if this is the previous year's entry for trend calculation
            const latestEntry = latestRankingsMap.get(indexId)!
            if (ranking.year === latestEntry.year - 1 && !previousRankingsMap.has(indexId)) {
              previousRankingsMap.set(indexId, ranking)
            }
          }
        }

        const latestRankings = Array.from(latestRankingsMap.values())
        
        // Determine the latest year from the data (for display purposes)
        const latestYear = latestRankings.length > 0 
          ? Math.max(...latestRankings.map(r => r.year))
          : new Date().getFullYear()
        
        // Previous year for display (relative to the latest data)
        const previousYear = latestYear - 1

        // Build rankings with change
        const rankingsWithChange = latestRankings.map((ranking) => {
          const previous = previousRankingsMap.get(ranking.indexId)
          const rankChange = previous ? previous.rank - ranking.rank : 0
          return {
            indexId: ranking.index.id,
            indexName: ranking.index.name,
            shortName: ranking.index.shortName,
            source: ranking.index.source,
            sourceUrl: ranking.index.sourceUrl,
            methodology: ranking.index.methodology,
            rank: ranking.rank,
            totalCountries: ranking.totalCountries,
            percentile: ranking.percentile,
            score: ranking.score,
            normalizedScore: ranking.normalizedScore,
            rankChange,
            previousRank: previous?.rank ?? null,
          }
        })

        // Calculate aggregate stats
        const avgPercentile =
          rankingsWithChange.length > 0
            ? rankingsWithChange.reduce((sum, r) => sum + r.percentile, 0) /
              rankingsWithChange.length
            : 0

        const avgRankChange =
          rankingsWithChange.length > 0
            ? rankingsWithChange.reduce((sum, r) => sum + r.rankChange, 0) /
              rankingsWithChange.length
            : 0

        return {
          domain,
          countryCode,
          latestYear,
          previousYear,
          stats: {
            totalIndices: domain.indices.length,
            rankedIndices: rankingsWithChange.length,
            avgPercentile,
            avgRankChange,
          },
          rankings: rankingsWithChange.sort((a, b) => b.percentile - a.percentile),
        }
      }
    )
  })
