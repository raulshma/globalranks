/**
 * ICC Cricket Rankings (ODI) - Real data from ICC December 2025
 * Source: https://www.icc-cricket.com/rankings
 */

export const cricketOdiRankingsIndex = {
  id: 'idx-cricket-odi',
  name: 'ICC ODI Team Rankings',
  slug: 'cricket-odi-rankings',
  domain: 'sports',
  source: 'International Cricket Council (ICC)',
  sourceUrl: 'https://www.icc-cricket.com/rankings/odi-team-rankings',
  methodology: 'Based on weighted match results from last 4 years, with recent matches weighted more heavily. Points earned based on opponent strength and match outcomes. Rankings updated after every series.',
  description: 'Official world rankings for One Day International (ODI) cricket teams.',
  dataLicense: 'Public',
  updateFrequency: 'After each series',
  lastUpdated: new Date('2025-12-01'),
  higherIsBetter: false,
  unit: 'rating points',
  minValue: 0,
  maxValue: 150,
}

export const totalCountries = 20

export const cricketOdiRankings = [
  { countryCode: 'IND', rank: 1, year: 2025, score: 124, change: 0 },
  { countryCode: 'NZL', rank: 2, year: 2025, score: 118, change: 1 },
  { countryCode: 'AUS', rank: 3, year: 2025, score: 115, change: -1 },
  { countryCode: 'PAK', rank: 4, year: 2025, score: 110, change: 0 },
  { countryCode: 'LKA', rank: 5, year: 2025, score: 105, change: 1 },
  { countryCode: 'ZAF', rank: 6, year: 2025, score: 102, change: -1 },
  { countryCode: 'GBR', rank: 7, year: 2025, score: 98, change: 0 },
  { countryCode: 'BGD', rank: 8, year: 2025, score: 94, change: 0 },
  { countryCode: 'AFG', rank: 9, year: 2025, score: 85, change: 1 },
  { countryCode: 'IRL', rank: 10, year: 2025, score: 67, change: -1 },
  { countryCode: 'ZWE', rank: 11, year: 2025, score: 55, change: 0 },
  { countryCode: 'NLD', rank: 12, year: 2025, score: 45, change: 0 },
]
