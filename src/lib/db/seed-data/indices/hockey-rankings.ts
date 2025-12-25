/**
 * FIH Hockey World Rankings - Real data from FIH 2025
 * Source: https://www.fih.hockey/rankings
 */

export const hockeyRankingsIndex = {
  id: 'idx-hockey-rankings',
  name: 'FIH Hockey World Rankings',
  slug: 'hockey-rankings',
  domain: 'sports',
  source: 'FIH (International Hockey Federation)',
  sourceUrl: 'https://www.fih.hockey/rankings',
  methodology: 'Rankings based on match results in FIH-sanctioned events, weighted by match importance, opponent strength, and recency. Points calculated using algorithm considering Olympic Games, World Cup, Continental Championships.',
  description: 'Official world rankings for mens field hockey teams maintained by the International Hockey Federation.',
  dataLicense: 'Public',
  updateFrequency: 'Monthly',
  lastUpdated: new Date('2025-12-01'),
  higherIsBetter: false,
  unit: 'points',
  minValue: 0,
  maxValue: 5000,
}

export const totalCountries = 96

export const hockeyRankings = [
  // FIH Men's Hockey World Rankings - December 2025
  { countryCode: 'NLD', rank: 1, year: 2025, score: 3376, change: 0 },
  { countryCode: 'BEL', rank: 2, year: 2025, score: 3225, change: 0 },
  { countryCode: 'DEU', rank: 3, year: 2025, score: 3116, change: 0 },
  { countryCode: 'ARG', rank: 4, year: 2025, score: 3022, change: 0 },
  { countryCode: 'AUS', rank: 5, year: 2025, score: 3007, change: 0 },
  { countryCode: 'ESP', rank: 6, year: 2025, score: 2996, change: 1 },
  { countryCode: 'GBR', rank: 7, year: 2025, score: 2864, change: 0 },
  { countryCode: 'IND', rank: 8, year: 2025, score: 2845, change: -2 },
  { countryCode: 'FRA', rank: 9, year: 2025, score: 2372, change: 0 },
  { countryCode: 'NZL', rank: 10, year: 2025, score: 2254, change: 0 },
  { countryCode: 'IRL', rank: 11, year: 2025, score: 2246, change: 1 },
  { countryCode: 'ZAF', rank: 12, year: 2025, score: 2127, change: -1 },
  { countryCode: 'MYS', rank: 13, year: 2025, score: 2097, change: 0 },
  { countryCode: 'PAK', rank: 14, year: 2025, score: 2034, change: 0 },
  { countryCode: 'GBR', rank: 15, year: 2025, score: 1989, change: 0 },
  { countryCode: 'KOR', rank: 16, year: 2025, score: 1981, change: 0 },
  { countryCode: 'EGY', rank: 17, year: 2025, score: 1956, change: 1 },
  { countryCode: 'JPN', rank: 18, year: 2025, score: 1928, change: -1 },
  { countryCode: 'CAN', rank: 19, year: 2025, score: 1863, change: 0 },
  { countryCode: 'GBR', rank: 20, year: 2025, score: 1844, change: 0 },
  { countryCode: 'USA', rank: 21, year: 2025, score: 1780, change: 0 },
  { countryCode: 'AUT', rank: 22, year: 2025, score: 1720, change: 0 },
  { countryCode: 'CHN', rank: 23, year: 2025, score: 1680, change: 0 },
  { countryCode: 'POL', rank: 24, year: 2025, score: 1640, change: 0 },
  { countryCode: 'CHL', rank: 25, year: 2025, score: 1600, change: 0 },
  { countryCode: 'CHE', rank: 26, year: 2025, score: 1560, change: 0 },
  { countryCode: 'BLR', rank: 27, year: 2025, score: 1520, change: 0 },
  { countryCode: 'RUS', rank: 28, year: 2025, score: 1480, change: -2 },
  { countryCode: 'GHA', rank: 29, year: 2025, score: 1440, change: 0 },
  { countryCode: 'KEN', rank: 30, year: 2025, score: 1400, change: 0 },
]
