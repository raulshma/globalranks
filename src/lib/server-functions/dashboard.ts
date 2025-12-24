/**
 * Server functions for dashboard data
 * Requirements: 2.1, 3.3
 */

import { asc, eq, sql } from "drizzle-orm"
import { z } from "zod"
import { createServerFn } from "@tanstack/react-start"
import { db } from "../db"
import { domains, rankingEntries } from "../db/schema"

/**
 * Get dashboard overview data for a country
 * Requirement 2.1: Default to India as selected country
 * Requirement 3.3: Show domain-level aggregate scores and trends
 */
export const getDashboardData = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      countryCode: z.string().length(3),
    })
  )
  .handler(async ({ data }) => {
    const { countryCode } = data

    // Get all domains
    const allDomains = await db.query.domains.findMany({
      orderBy: [asc(domains.name)],
    })

    // Get latest year's rankings for the country
    const latestYearResult = await db
      .select({ maxYear: sql<number>`MAX(${rankingEntries.year})` })
      .from(rankingEntries)
      .where(eq(rankingEntries.countryCode, countryCode))

    const latestYear = latestYearResult[0]?.maxYear ?? new Date().getFullYear()

    // Get all rankings for the country in the latest year
    const latestRankings = await db.query.rankingEntries.findMany({
      where: (entries, { and: andFn, eq: eqFn }) =>
        andFn(
          eqFn(entries.countryCode, countryCode),
          eqFn(entries.year, latestYear)
        ),
      with: {
        index: {
          with: {
            domain: true,
          },
        },
      },
      orderBy: [asc(rankingEntries.rank)],
    })

    // Get previous year's rankings for trend calculation
    const previousYear = latestYear - 1
    const previousRankings = await db.query.rankingEntries.findMany({
      where: (entries, { and: andFn, eq: eqFn }) =>
        andFn(
          eqFn(entries.countryCode, countryCode),
          eqFn(entries.year, previousYear)
        ),
      with: {
        index: true,
      },
    })

    // Create a map of previous rankings by index ID
    const previousRankingsMap = new Map(
      previousRankings.map((r) => [r.indexId, r])
    )

    // Calculate rank changes and categorize
    const rankingsWithChange = latestRankings.map((ranking) => {
      const previous = previousRankingsMap.get(ranking.indexId)
      const rankChange = previous ? previous.rank - ranking.rank : 0
      return {
        ...ranking,
        rankChange,
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
      latestYear,
      previousYear,
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
      })),
      topDeclining: topDeclining.map((r) => ({
        indexId: r.index.id,
        indexName: r.index.name,
        domainName: r.index.domain.name,
        rank: r.rank,
        previousRank: r.previousRank,
        rankChange: r.rankChange,
        percentile: r.percentile,
      })),
    }
  })
