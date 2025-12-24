/**
 * Seed script for Global Rankings Intelligence Platform
 * Uses modular data files from seed-data/ directory
 */

import {
  allIndices,
  allRankingsData,
  countriesData,
  domainsData,
  milestonesData,
  peerGroupsData,
} from './seed-data'
import {
  countries,
  domains,
  milestones,
  peerGroups,
  rankingEntries,
  rankingIndices,
} from './schema'
import { db } from './index'

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function calculatePercentile(rank: number, totalCountries: number): number {
  return ((totalCountries - rank + 1) / totalCountries) * 100
}

function normalizeScore(
  score: number,
  scoreMin: number,
  scoreMax: number,
  higherIsBetter: boolean
): number {
  const normalized = ((score - scoreMin) / (scoreMax - scoreMin)) * 100
  return higherIsBetter ? normalized : 100 - normalized
}

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

async function seed() {
  console.log('🌱 Starting database seed with REAL data...')

  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...')
    await db.delete(rankingEntries)
    await db.delete(milestones)
    await db.delete(rankingIndices)
    await db.delete(domains)
    await db.delete(peerGroups)
    await db.delete(countries)

    // Seed countries (without population field as it's not in schema)
    console.log('🌍 Seeding countries...')
    const countriesToInsert = countriesData.map(({ population: _pop, ...rest }) => rest)
    await db.insert(countries).values(countriesToInsert)
    console.log(`   ✓ Inserted ${countriesToInsert.length} countries`)

    // Seed peer groups
    console.log('👥 Seeding peer groups...')
    await db.insert(peerGroups).values(peerGroupsData)
    console.log(`   ✓ Inserted ${peerGroupsData.length} peer groups`)

    // Seed domains
    console.log('📁 Seeding domains...')
    await db.insert(domains).values(domainsData)
    console.log(`   ✓ Inserted ${domainsData.length} domains`)

    // Seed ranking indices
    console.log('📊 Seeding ranking indices...')
    await db.insert(rankingIndices).values(allIndices)
    console.log(`   ✓ Inserted ${allIndices.length} ranking indices`)

    // Seed milestones
    console.log('🏁 Seeding milestones...')
    const milestonesWithIds = milestonesData.map((m, i) => ({
      id: `ms-${i + 1}`,
      ...m,
    }))
    await db.insert(milestones).values(milestonesWithIds)
    console.log(`   ✓ Inserted ${milestonesWithIds.length} milestones`)

    // Seed ranking entries from all indices
    console.log('📈 Seeding ranking entries with REAL data...')
    const entries: Array<typeof rankingEntries.$inferInsert> = []

    for (const { index, rankings, totalCountries, valueField } of allRankingsData) {
      for (const r of rankings) {
        const score = valueField === 'value' ? (r as { value: number }).value : (r as { score: number }).score
        const year = r.year

        entries.push({
          id: `re-${index.id}-${r.code}-${year}`,
          indexId: index.id,
          countryCode: r.code,
          year,
          rank: r.rank,
          totalCountries,
          score,
          normalizedScore: normalizeScore(score, index.scoreMin, index.scoreMax, index.higherIsBetter),
          percentile: calculatePercentile(r.rank, totalCountries),
          confidence: 'high',
        })
      }
    }

    // Insert in batches to avoid SQLite variable limit
    const BATCH_SIZE = 500
    for (let i = 0; i < entries.length; i += BATCH_SIZE) {
      const batch = entries.slice(i, i + BATCH_SIZE)
      await db.insert(rankingEntries).values(batch)
      console.log(`   ✓ Inserted batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(entries.length / BATCH_SIZE)} (${batch.length} entries)`)
    }
    console.log(`   ✓ Total inserted: ${entries.length} ranking entries`)

    console.log('\n✅ Database seed completed successfully!')
    console.log(`
Summary:
  - Countries: ${countriesToInsert.length}
  - Peer Groups: ${peerGroupsData.length}
  - Domains: ${domainsData.length}
  - Ranking Indices: ${allIndices.length}
  - Milestones: ${milestonesWithIds.length}
  - Ranking Entries: ${entries.length}

Data Sources:
  - Population: Worldometers (2025)
  - GII: WIPO Global Innovation Index (2024)
  - HDI: UNDP Human Development Index (2023)
  - CPI: Transparency International (2024)
  - GDP Per Capita: IMF World Economic Outlook (2024)
  - EPI: Yale Environmental Performance Index (2024)
  - Democracy: Economist Intelligence Unit (2024)
  - Press Freedom: Reporters Without Borders (2024)
  - GFP: Global Firepower (2024)
  - FIFA: FIFA World Rankings (2024)
  - GDP Nominal: IMF (2024)
  - Passport: Henley Passport Index (2024)
  - Literacy: UNESCO (2024)
  - Ease of Business: World Bank (2019)
  - GCI: WEF Global Competitiveness (2024)
  - GPI: Global Peace Index - IEP (2025)
  - GHI: Global Hunger Index (2024)
  - GGGI: Global Gender Gap - WEF (2024)
  - RoLI: Rule of Law Index - WJP (2024)
  - EGDI: E-Government Index - UN (2024)
  - GTI: Global Terrorism Index - IEP (2025)
  - HCI: Human Capital Index - World Bank (2020)
  - CCPI: Climate Change Performance - Germanwatch (2024)
  - NRI: Networked Readiness Index (2024)
  - IEF: Index of Economic Freedom - Heritage (2024)
  - IDI: ICT Development Index - ITU (2024)
`)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    throw error
  }
}

// Run seed
seed()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
