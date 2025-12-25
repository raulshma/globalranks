/**
 * Server functions for country all-indices view
 * Requirements: 2.1, 3.2 - Display latest rankings for all indices for a country
 */

import { asc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { createServerFn } from '@tanstack/react-start'
import { db } from '../db'
import { domains, rankingEntries, rankingIndices } from '../db/schema'
import { withCache, cacheKey, CACHE_TTL } from '../cache'

/**
 * Latest ranking for an index (most recent year available)
 */
export interface LatestIndexRanking {
  indexId: string
  indexName: string
  shortName: string
  domainId: string
  domainName: string
  domainIcon: string
  source: string
  sourceUrl: string
  year: number | null
  rank: number | null
  totalCountries: number | null
  percentile: number | null
  score: number | null
  normalizedScore: number | null
  previousYear: number | null
  previousRank: number | null
  rankChange: number | null
  hasData: boolean
}

/**
 * Grouped by domain for display
 */
export interface DomainRankingGroup {
  domainId: string
  domainName: string
  domainIcon: string
  rankings: Array<LatestIndexRanking>
  avgPercentile: number
  indicesCount: number
}

/**
 * Page data from loader
 */
export interface CountryRankingsPageData {
  countryCode: string
  countryName: string
  rankings: Array<LatestIndexRanking>
  groupedByDomain: Array<DomainRankingGroup>
  totalIndices: number
  indicesWithData: number
}


/**
 * Get all latest rankings for a country
 * For each index, retrieves the most recent ranking entry available
 * Calculates rank change from previous available year
 * Groups results by domain
 *
 * Requirements: 2.1, 3.2
 */
export const getAllLatestRankingsForCountry = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      countryCode: z.string().length(3),
    })
  )
  .handler(async ({ data }) => {
    const { countryCode } = data

    // Redis cache: all latest rankings by country
    return withCache(
      cacheKey('allLatestRankings', countryCode),
      CACHE_TTL.DYNAMIC,
      async () => {
        // Get country info
        const country = await db.query.countries.findFirst({
          where: (countries, { eq: eqFn }) => eqFn(countries.code, countryCode),
        })

        if (!country) {
          throw new Error(`Country not found: ${countryCode}`)
        }

        // Get all domains
        const allDomains = await db.query.domains.findMany({
          orderBy: [asc(domains.name)],
        })

        // Get all indices with their domains
        const allIndices = await db.query.rankingIndices.findMany({
          with: {
            domain: true,
          },
          orderBy: [asc(rankingIndices.name)],
        })

        // Get all ranking entries for this country
        const allRankings = await db.query.rankingEntries.findMany({
          where: eq(rankingEntries.countryCode, countryCode),
          orderBy: [asc(rankingEntries.indexId), asc(rankingEntries.year)],
        })

        // Group rankings by index and find latest + previous year for each
        const rankingsByIndex = new Map<
          string,
          {
            latest: (typeof allRankings)[0] | null
            previous: (typeof allRankings)[0] | null
          }
        >()

        for (const ranking of allRankings) {
          const existing = rankingsByIndex.get(ranking.indexId)
          if (!existing) {
            rankingsByIndex.set(ranking.indexId, { latest: ranking, previous: null })
          } else {
            // Since ordered by year ascending, each new entry is more recent
            if (existing.latest && ranking.year > existing.latest.year) {
              rankingsByIndex.set(ranking.indexId, {
                latest: ranking,
                previous: existing.latest,
              })
            } else if (existing.latest && ranking.year < existing.latest.year) {
              // This is an older entry, check if it should be previous
              if (!existing.previous || ranking.year > existing.previous.year) {
                rankingsByIndex.set(ranking.indexId, {
                  latest: existing.latest,
                  previous: ranking,
                })
              }
            }
          }
        }

        // Build latest rankings array - include all indices, even without data
        const latestRankings: Array<LatestIndexRanking> = []

        for (const index of allIndices) {
          const rankingData = rankingsByIndex.get(index.id)
          const latest = rankingData?.latest
          const previous = rankingData?.previous

          if (latest) {
            // Calculate rank change (positive = improved, negative = declined)
            const rankChange = previous ? previous.rank - latest.rank : null

            latestRankings.push({
              indexId: index.id,
              indexName: index.name,
              shortName: index.shortName,
              domainId: index.domainId,
              domainName: index.domain.name,
              domainIcon: index.domain.icon,
              source: index.source,
              sourceUrl: index.sourceUrl,
              year: latest.year,
              rank: latest.rank,
              totalCountries: latest.totalCountries,
              percentile: latest.percentile,
              score: latest.score,
              normalizedScore: latest.normalizedScore,
              previousYear: previous?.year ?? null,
              previousRank: previous?.rank ?? null,
              rankChange,
              hasData: true,
            })
          } else {
            // Index has no data for this country - Requirement 2.4
            latestRankings.push({
              indexId: index.id,
              indexName: index.name,
              shortName: index.shortName,
              domainId: index.domainId,
              domainName: index.domain.name,
              domainIcon: index.domain.icon,
              source: index.source,
              sourceUrl: index.sourceUrl,
              year: null,
              rank: null,
              totalCountries: null,
              percentile: null,
              score: null,
              normalizedScore: null,
              previousYear: null,
              previousRank: null,
              rankChange: null,
              hasData: false,
            })
          }
        }

        // Group by domain
        const domainMap = new Map<string, DomainRankingGroup>()

        for (const domain of allDomains) {
          domainMap.set(domain.id, {
            domainId: domain.id,
            domainName: domain.name,
            domainIcon: domain.icon,
            rankings: [],
            avgPercentile: 0,
            indicesCount: 0,
          })
        }

        for (const ranking of latestRankings) {
          const group = domainMap.get(ranking.domainId)
          if (group) {
            group.rankings.push(ranking)
          }
        }

        // Calculate stats for each domain group
        const groupedByDomain: Array<DomainRankingGroup> = []

        Array.from(domainMap.values()).forEach((group) => {
          if (group.rankings.length > 0) {
            // Only include rankings with data for percentile calculation
            const rankingsWithData = group.rankings.filter((r) => r.hasData && r.percentile !== null)
            const totalPercentile = rankingsWithData.reduce(
              (sum, r) => sum + (r.percentile ?? 0),
              0
            )
            group.avgPercentile = rankingsWithData.length > 0 ? totalPercentile / rankingsWithData.length : 0
            group.indicesCount = group.rankings.length
            // Sort rankings within group by name
            group.rankings.sort((a, b) => a.indexName.localeCompare(b.indexName))
          }
          groupedByDomain.push(group)
        })

        // Sort groups by domain name
        groupedByDomain.sort((a, b) => a.domainName.localeCompare(b.domainName))

        const result: CountryRankingsPageData = {
          countryCode,
          countryName: country.name,
          rankings: latestRankings,
          groupedByDomain,
          totalIndices: allIndices.length,
          indicesWithData: latestRankings.length,
        }

        return result
      }
    )
  })
