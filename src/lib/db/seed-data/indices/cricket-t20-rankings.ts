/**
 * ICC Cricket Rankings (T20) - Real data from ICC December 2025
 * Source: https://www.icc-cricket.com/rankings
 */

export const cricketT20RankingsIndex = {
  id: 'idx-cricket-t20',
  name: 'ICC T20I Team Rankings',
  slug: 'cricket-t20-rankings',
  domain: 'sports',
  source: 'International Cricket Council (ICC)',
  sourceUrl: 'https://www.icc-cricket.com/rankings/t20-team-rankings',
  methodology: 'Based on weighted match results from last 3 years. More recent matches weighted higher. Points calculated based on opponent strength and match outcomes.',
  description: 'Official world rankings for Twenty20 International (T20I) cricket teams.',
  dataLicense: 'Public',
  updateFrequency: 'After each series',
  lastUpdated: new Date('2025-12-01'),
  higherIsBetter: false,
  unit: 'rating points',
  minValue: 0,
  maxValue: 300,
}

export const totalCountries = 20

export const cricketT20Rankings = [
  { countryCode: 'IND', rank: 1, year: 2025, score: 272, change: 0 },
  { countryCode: 'AUS', rank: 2, year: 2025, score: 264, change: 0 },
  { countryCode: 'GBR', rank: 3, year: 2025, score: 258, change: 0 },
  { countryCode: 'NZL', rank: 4, year: 2025, score: 250, change: 0 },
  { countryCode: 'ZAF', rank: 5, year: 2025, score: 245, change: 0 },
  { countryCode: 'PAK', rank: 6, year: 2025, score: 235, change: 0 },
  { countryCode: 'JAM', rank: 7, year: 2025, score: 225, change: 0 },
  { countryCode: 'AFG', rank: 8, year: 2025, score: 218, change: 0 },
  { countryCode: 'LKA', rank: 9, year: 2025, score: 210, change: 1 },
  { countryCode: 'BGD', rank: 10, year: 2025, score: 200, change: -1 },
  { countryCode: 'IRL', rank: 11, year: 2025, score: 185, change: 0 },
  { countryCode: 'ZWE', rank: 12, year: 2025, score: 170, change: 0 },
]
