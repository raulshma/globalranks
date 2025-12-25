/**
 * Server functions for dashboard data
 * Requirements: 2.1, 3.3
 */

import { asc, desc, eq } from "drizzle-orm"
import { z } from "zod"
import { createServerFn } from "@tanstack/react-start"
import { setResponseHeader } from "@tanstack/react-start/server"
import { db } from "../db"
import { domains, rankingEntries } from "../db/schema"
import { CDN_CACHE } from "../cache-config"
import { withCache, cacheKey, CACHE_TTL } from "../cache"

/**
 * Get dashboard overview data for a country
 * Requirement 2.1: Default to IND as selected country
 * Requirement 3.3: Show domain-level aggregate scores and trends
 * 
 * Uses each index's latest available data rather than filtering to a single year
 */
export const getDashboardData = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      countryCode: z.string().length(3),
    })
  )
  .handler(async ({ data }) => {
    const { countryCode } = data

    // Cache for 5 minutes (DYNAMIC data - varies by country)
    setResponseHeader('Cache-Control', CDN_CACHE.DYNAMIC)

    // Redis cache: dashboard data by country
    return withCache(
      cacheKey('dashboard', countryCode),
      CACHE_TTL.DYNAMIC,
      async () => {
        // Get all domains
        const allDomains = await db.query.domains.findMany({
          orderBy: [asc(domains.name)],
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
        const latestRankingsMap = new Map<string, (typeof allRankings)[0]>()
        const previousRankingsMap = new Map<string, (typeof allRankings)[0]>()

        for (const ranking of allRankings) {
          const indexId = ranking.indexId
          if (!latestRankingsMap.has(indexId)) {
            // First entry for this index (since ordered by year desc, it's the latest)
            latestRankingsMap.set(indexId, ranking)
          } else {
            // Check if this is the previous year's entry for trend calculation
            const latestEntry = latestRankingsMap.get(indexId)!
            if (
              ranking.year === latestEntry.year - 1 &&
              !previousRankingsMap.has(indexId)
            ) {
              previousRankingsMap.set(indexId, ranking)
            }
          }
        }

        const latestRankings = Array.from(latestRankingsMap.values())

        // Calculate rank changes and categorize
        const rankingsWithChange = latestRankings.map((ranking) => {
          const previous = previousRankingsMap.get(ranking.indexId)
          const rankChange = previous ? previous.rank - ranking.rank : 0
          return {
            ...ranking,
            rankChange,
            year: ranking.year,
            previousRank: previous?.rank ?? null,
          }
        })

        // Get top improving indices (positive rank change = improvement)
        const topImproving = [...rankingsWithChange]
          .filter((r) => r.rankChange > 0)
          .sort((a, b) => b.rankChange - a.rankChange)
          .slice(0, 5)

        // Get top declining indices (negative rank change = decline)
        const topDeclining = [...rankingsWithChange]
          .filter((r) => r.rankChange < 0)
          .sort((a, b) => a.rankChange - b.rankChange)
          .slice(0, 5)

        // Calculate domain summaries
        const domainSummaries = allDomains.map((domain) => {
          const domainRankings = rankingsWithChange.filter(
            (r) => r.index.domainId === domain.id
          )

          if (domainRankings.length === 0) {
            return {
              domain,
              totalIndices: 0,
              avgPercentile: 0,
              avgRankChange: 0,
              bestIndex: null,
              worstIndex: null,
            }
          }

          const avgPercentile =
            domainRankings.reduce((sum, r) => sum + r.percentile, 0) /
            domainRankings.length

          const avgRankChange =
            domainRankings.reduce((sum, r) => sum + r.rankChange, 0) /
            domainRankings.length

          // Best index = highest percentile
          const sortedByPercentile = [...domainRankings].sort(
            (a, b) => b.percentile - a.percentile
          )
          const bestIndex = sortedByPercentile[0]
          const worstIndex = sortedByPercentile[sortedByPercentile.length - 1]

          return {
            domain,
            totalIndices: domainRankings.length,
            avgPercentile,
            avgRankChange,
            bestIndex: {
              id: bestIndex.index.id,
              name: bestIndex.index.name,
              rank: bestIndex.rank,
              percentile: bestIndex.percentile,
            },
            worstIndex: {
              id: worstIndex.index.id,
              name: worstIndex.index.name,
              rank: worstIndex.rank,
              percentile: worstIndex.percentile,
            },
          }
        })

        // Calculate overall statistics
        const totalIndices = latestRankings.length
        const avgPercentile =
          totalIndices > 0
            ? latestRankings.reduce((sum, r) => sum + r.percentile, 0) / totalIndices
            : 0

        const improvingCount = rankingsWithChange.filter(
          (r) => r.rankChange > 0
        ).length
        const decliningCount = rankingsWithChange.filter(
          (r) => r.rankChange < 0
        ).length
        const stableCount = rankingsWithChange.filter(
          (r) => r.rankChange === 0
        ).length

        return {
          countryCode,
          summary: {
            totalIndices,
            avgPercentile,
            improvingCount,
            decliningCount,
            stableCount,
          },
          domainSummaries,
          topImproving: topImproving.map((r) => ({
            indexId: r.index.id,
            indexName: r.index.name,
            domainName: r.index.domain.name,
            rank: r.rank,
            previousRank: r.previousRank,
            rankChange: r.rankChange,
            percentile: r.percentile,
            year: r.year,
          })),
          topDeclining: topDeclining.map((r) => ({
            indexId: r.index.id,
            indexName: r.index.name,
            domainName: r.index.domain.name,
            rank: r.rank,
            previousRank: r.previousRank,
            rankChange: r.rankChange,
            percentile: r.percentile,
            year: r.year,
          })),
        }
      }
    )
  })
