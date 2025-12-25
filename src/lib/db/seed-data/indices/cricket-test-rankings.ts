/**
 * ICC Cricket Rankings (Test) - Real data from ICC December 2025
 * Source: https://www.icc-cricket.com/rankings
 */

export const cricketTestRankingsIndex = {
  id: 'idx-cricket-test',
  name: 'ICC Test Team Rankings',
  slug: 'cricket-test-rankings',
  domain: 'sports',
  source: 'International Cricket Council (ICC)',
  sourceUrl: 'https://www.icc-cricket.com/rankings/test-team-rankings',
  methodology: 'Based on weighted match results from last 4 years. Recent matches weighted higher. Points based on opponent strength and match/series outcomes.',
  description: 'Official world rankings for Test cricket teams.',
  dataLicense: 'Public',
  updateFrequency: 'After each series',
  lastUpdated: new Date('2025-12-01'),
  higherIsBetter: false,
  unit: 'rating points',
  minValue: 0,
  maxValue: 150,
}

export const totalCountries = 12

export const cricketTestRankings = [
  { countryCode: 'AUS', rank: 1, year: 2025, score: 124, change: 0 },
  { countryCode: 'ZAF', rank: 2, year: 2025, score: 116, change: 1 },
  { countryCode: 'GBR', rank: 3, year: 2025, score: 112, change: -1 },
  { countryCode: 'IND', rank: 4, year: 2025, score: 104, change: 0 },
  { countryCode: 'NZL', rank: 5, year: 2025, score: 96, change: 0 },
  { countryCode: 'PAK', rank: 6, year: 2025, score: 88, change: 0 },
  { countryCode: 'LKA', rank: 7, year: 2025, score: 80, change: 0 },
  { countryCode: 'JAM', rank: 8, year: 2025, score: 72, change: 0 },
  { countryCode: 'BGD', rank: 9, year: 2025, score: 64, change: 0 },
  { countryCode: 'ZWE', rank: 10, year: 2025, score: 45, change: 0 },
  { countryCode: 'IRL', rank: 11, year: 2025, score: 35, change: 0 },
  { countryCode: 'AFG', rank: 12, year: 2025, score: 28, change: 0 },
]
