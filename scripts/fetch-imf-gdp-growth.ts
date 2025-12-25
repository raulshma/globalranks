/**
 * Script to fetch Real GDP Growth data from IMF API and generate seed files
 * Usage: npx tsx scripts/fetch-imf-gdp-growth.ts
 *
 * IMF API Documentation: https://www.imf.org/external/datamapper/api/v1
 * Indicator: NGDP_RPCH (Real GDP growth, annual percent change)
 */

import * as fs from 'node:fs'
import * as path from 'node:path'

// Configuration
const IMF_API_BASE = 'https://www.imf.org/external/datamapper/api/v1'
const INDICATOR = 'NGDP_RPCH' // Real GDP growth rate
const START_YEAR = 2010
const END_YEAR = 2025
const OUTPUT_DIR = path.join(process.cwd(), 'src/lib/db/seed-data/indices/real-gdp-growth')

// Country code mapping from IMF codes to our database codes
// IMF uses ISO 3166-1 alpha-3 codes with some exceptions
const IMF_TO_DB_CODE: Record<string, string> = {
  // Special mappings for territories/regions not in our DB or with different codes
  UVK: 'XKX', // Kosovo (skip if not in DB)
  WBG: 'PSE', // West Bank and Gaza -> Palestine
  // Aggregate regions to skip (we only want country data)
}

// Regions/aggregates to skip (these are not individual countries)
// IMF uses various aggregate codes that we need to filter out
const SKIP_CODES = new Set([
  // Major aggregates
  'ADVEC', 'WEOWORLD', 'EMDE', 'EURO', 'CIS',
  // Regional aggregates (ending in Q typically)
  'AFQ', 'SSQ', 'EMQ', 'AMQ', 'APQ', 'MEQ', 'CAQ', 'EAQ', 'NAQ', 'SAQ',
  'SEQ', 'WAQ', 'PIQ', 'CMQ', 'EEQ', 'NMQ', 'SMQ', 'WHQ', 'WEQ', 'AZQ',
  'CBQ', 'EUQ', 'MAE', 'OAE',
  // Named aggregates
  'MENAP', 'SSA', 'AS5', 'DA', 'EU', 'WE', 'EDE', 'MECA', 'OEMDC',
  // Territories that may not be in our countries DB
  'ABW', // Aruba
])

interface IMFResponse {
  values: Partial<{
    [indicator: string]: {
      [countryCode: string]: {
        [year: string]: number
      }
    }
  }>
}

interface RankingEntry {
  code: string
  rank: number
  year: number
  score: number
}

async function fetchIMFData(): Promise<IMFResponse> {
  // Build periods parameter
  const periods = Array.from(
    { length: END_YEAR - START_YEAR + 1 },
    (_, i) => START_YEAR + i
  ).join(',')

  const url = `${IMF_API_BASE}/${INDICATOR}?periods=${periods}`

  console.log(`📡 Fetching data from IMF API...`)
  console.log(`   URL: ${url}`)

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`IMF API request failed: ${response.status} ${response.statusText}`)
  }

  const data = (await response.json()) as IMFResponse
  console.log(`   ✓ Data received successfully`)

  return data
}

function processData(data: IMFResponse): Map<number, Array<RankingEntry>> {
  const yearData = new Map<number, Array<RankingEntry>>()

  const indicatorData = data.values[INDICATOR]

  if (indicatorData === undefined) {
    throw new Error(`No data found for indicator ${INDICATOR}`)
  }

  // Initialize year maps
  for (let year = START_YEAR; year <= END_YEAR; year++) {
    yearData.set(year, [])
  }

  // Process each country
  for (const [imfCode, countryYearData] of Object.entries(indicatorData)) {
    // Skip aggregate regions
    if (SKIP_CODES.has(imfCode)) {
      continue
    }

    // Map IMF code to our DB code
    const dbCode = IMF_TO_DB_CODE[imfCode] || imfCode

    // Process each year for this country
    for (const [yearStr, value] of Object.entries(countryYearData)) {
      const year = parseInt(yearStr, 10)

      if (year < START_YEAR || year > END_YEAR) continue
      if (Number.isNaN(value)) continue

      // Round to 1 decimal place for cleaner data
      const score = Math.round(value * 10) / 10

      yearData.get(year)!.push({
        code: dbCode,
        rank: 0, // Will be calculated after sorting
        year,
        score,
      })
    }
  }

  // Sort and assign ranks for each year
  // Higher GDP growth = better = lower rank number
  for (const [_year, entries] of yearData.entries()) {
    // Sort by score descending (higher is better)
    entries.sort((a, b) => b.score - a.score)

    // Assign ranks
    entries.forEach((entry, index) => {
      entry.rank = index + 1
    })
  }

  return yearData
}

function generateYearFile(year: number, entries: Array<RankingEntry>): string {
  const lines: Array<string> = [
    '/**',
    ` * Real GDP Growth Rate ${year} - IMF Data`,
    ' * Source: IMF World Economic Outlook',
    ' */',
    '',
    `export const realGdpGrowthRankings${year} = [`,
  ]

  for (const entry of entries) {
    lines.push(`  { code: '${entry.code}', rank: ${entry.rank}, year: ${entry.year}, score: ${entry.score} },`)
  }

  lines.push(']')
  lines.push('')

  return lines.join('\n')
}

function generateIndexFile(years: Array<number>): string {
  const imports = years
    .map((year) => `import { realGdpGrowthRankings${year} } from './${year}'`)
    .join('\n')

  const spreadRankings = years
    .sort((a, b) => b - a) // Most recent first
    .map((year) => `  ...realGdpGrowthRankings${year},`)
    .join('\n')

  const reexports = years
    .map((year) => `export { realGdpGrowthRankings${year} } from './${year}'`)
    .join('\n')

  return `/**
 * Real GDP Growth Rate Data
 * Source: IMF World Economic Outlook - NGDP_RPCH
 * https://www.imf.org/external/datamapper/NGDP_RPCH@WEO
 * 
 * Auto-generated by scripts/fetch-imf-gdp-growth.ts
 * Last updated: ${new Date().toISOString()}
 */

${imports}

export const realGdpGrowthIndex = {
  id: 'idx-real-gdp-growth',
  name: 'Real GDP Growth Rate',
  shortName: 'GDP Growth',
  domainId: 'd-economy',
  source: 'IMF World Economic Outlook',
  sourceUrl: 'https://www.imf.org/external/datamapper/NGDP_RPCH@WEO',
  methodology:
    'Annual percentage change in real gross domestic product (GDP). Real GDP is measured in constant prices, which removes the effects of inflation. Data is compiled from national statistical sources, IMF staff estimates, and projections.',
  updateFrequency: 'semi-annual',
  scoreMin: -60,
  scoreMax: 100,
  higherIsBetter: true,
  lastUpdated: new Date('${new Date().toISOString().split('T')[0]}'),
  unit: 'percent',
}

// Combined rankings for seeding (all years, most recent first)
export const realGdpGrowthRankings = [
${spreadRankings}
]

export const totalCountries = 196

// Re-export year-specific data for direct access
${reexports}
`
}

async function main() {
  console.log('🚀 IMF Real GDP Growth Data Fetcher')
  console.log('===================================\n')

  try {
    // Fetch data from IMF API
    const rawData = await fetchIMFData()

    // Process and organize data by year
    console.log('\n📊 Processing data...')
    const yearData = processData(rawData)

    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true })
      console.log(`📁 Created directory: ${OUTPUT_DIR}`)
    }

    // Generate year-specific files
    console.log('\n📝 Generating seed files...')
    const generatedYears: Array<number> = []

    for (const [year, entries] of yearData.entries()) {
      if (entries.length === 0) {
        console.log(`   ⚠ No data for ${year}, skipping...`)
        continue
      }

      const filePath = path.join(OUTPUT_DIR, `${year}.ts`)
      const content = generateYearFile(year, entries)
      fs.writeFileSync(filePath, content, 'utf-8')
      console.log(`   ✓ Generated ${year}.ts (${entries.length} countries)`)
      generatedYears.push(year)
    }

    // Generate index file
    const indexPath = path.join(OUTPUT_DIR, 'index.ts')
    const indexContent = generateIndexFile(generatedYears)
    fs.writeFileSync(indexPath, indexContent, 'utf-8')
    console.log(`   ✓ Generated index.ts`)

    // Summary
    console.log('\n✅ Generation complete!')
    console.log(`
Summary:
  - Years covered: ${START_YEAR} to ${END_YEAR}
  - Files generated: ${generatedYears.length + 1}
  - Output directory: ${OUTPUT_DIR}

Next steps:
  1. Update src/lib/db/seed-data/indices/index.ts to import and export the new index
  2. Run 'pnpm db:seed' to seed the database with the new data
`)
  } catch (error) {
    console.error('\n❌ Error:', error)
    process.exit(1)
  }
}

main()
