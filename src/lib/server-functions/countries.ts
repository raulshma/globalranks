/**
 * Server functions for country and full ranking list data access
 * Requirements: 1.6, 2.6, 2.7
 */

import { asc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { createServerFn } from '@tanstack/react-start'
import { db } from '../db'
import { countries, peerGroups, rankingEntries } from '../db/schema'

/**
 * Get full ranking list for an index (all countries)
 * Requirement 1.6: Store complete ranking list for each index
 * Requirement 2.7: Show full country list with ranks
 */
export const getFullRankingList = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      indexId: z.string(),
      year: z.number(),
    })
  )
  .handler(async ({ data }) => {
    const { indexId, year } = data

    // Get all ranking entries for this index and year, ordered by rank
    const rankings = await db.query.rankingEntries.findMany({
      where: (entries, { and: andFn, eq: eqFn }) =>
        andFn(eqFn(entries.indexId, indexId), eqFn(entries.year, year)),
      with: {
        country: true,
        index: true,
      },
      orderBy: [asc(rankingEntries.rank)],
    })

    return rankings
  })

/**
 * Get all countries for selector population
 * Requirement 2.6: Populate country selector from complete list
 */
export const getAllCountries = createServerFn({ method: 'GET' }).handler(
  async () => {
    const allCountries = await db.query.countries.findMany({
      orderBy: [asc(countries.name)],
    })

    return allCountries
  }
)

/**
 * Get countries by peer group
 * Requirement 1.6: Support peer group comparisons
 */
export const getCountriesByPeerGroup = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      peerGroupId: z.string(),
    })
  )
  .handler(async ({ data }) => {
    const { peerGroupId } = data

    // Get the peer group
    const peerGroup = await db.query.peerGroups.findFirst({
      where: eq(peerGroups.id, peerGroupId),
    })

    if (!peerGroup) {
      throw new Error(`Peer group not found: ${peerGroupId}`)
    }

    // Parse the country codes from JSON
    const countryCodes = JSON.parse(peerGroup.countryCodes) as Array<string>

    // Get all countries in the peer group
    const groupCountries = await db.query.countries.findMany({
      orderBy: [asc(countries.name)],
    })

    // Filter to only include countries in the peer group
    const filtered = groupCountries.filter((c) => countryCodes.includes(c.code))

    return {
      peerGroup: {
        id: peerGroup.id,
        name: peerGroup.name,
        countryCodes,
      },
      countries: filtered,
    }
  })

/**
 * Get all peer groups
 * Useful for populating peer group selectors
 */
export const getAllPeerGroups = createServerFn({ method: 'GET' }).handler(
  async () => {
    const allPeerGroups = await db.query.peerGroups.findMany({
      orderBy: [asc(peerGroups.name)],
    })

    // Parse country codes for each peer group
    return allPeerGroups.map((pg) => ({
      id: pg.id,
      name: pg.name,
      countryCodes: JSON.parse(pg.countryCodes) as Array<string>,
    }))
  }
)
