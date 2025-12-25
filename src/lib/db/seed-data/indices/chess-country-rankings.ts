/**
 * FIDE Chess Country Rankings - Real data from FIDE December 2025
 * Source: https://ratings.fide.com
 */

export const chessCountryRankingsIndex = {
  id: 'idx-chess-country',
  name: 'FIDE Chess Country Rankings',
  slug: 'chess-country-rankings',
  domain: 'sports',
  source: 'FIDE (World Chess Federation)',
  sourceUrl: 'https://ratings.fide.com',
  methodology: 'Rankings based on average Elo rating of top 10 players from each federation. Updated monthly based on official FIDE rating calculations.',
  description: 'Official country rankings for chess based on average rating of top players.',
  dataLicense: 'Public',
  updateFrequency: 'Monthly',
  lastUpdated: new Date('2025-12-01'),
  higherIsBetter: true,
  unit: 'Elo rating',
  minValue: 0,
  maxValue: 3000,
}

export const totalCountries = 184

export const chessCountryRankings = [
  { countryCode: 'USA', rank: 1, year: 2025, score: 2727, change: 0 },
  { countryCode: 'IND', rank: 2, year: 2025, score: 2714, change: 0 },
  { countryCode: 'CHN', rank: 3, year: 2025, score: 2695, change: 0 },
  { countryCode: 'RUS', rank: 4, year: 2025, score: 2680, change: 0 },
  { countryCode: 'FRA', rank: 5, year: 2025, score: 2665, change: 0 },
  { countryCode: 'NLD', rank: 6, year: 2025, score: 2655, change: 0 },
  { countryCode: 'UZB', rank: 7, year: 2025, score: 2648, change: 2 },
  { countryCode: 'ESP', rank: 8, year: 2025, score: 2640, change: 0 },
  { countryCode: 'DEU', rank: 9, year: 2025, score: 2632, change: 0 },
  { countryCode: 'POL', rank: 10, year: 2025, score: 2625, change: 0 },
  { countryCode: 'UKR', rank: 11, year: 2025, score: 2618, change: -1 },
  { countryCode: 'ARM', rank: 12, year: 2025, score: 2610, change: 0 },
  { countryCode: 'HUN', rank: 13, year: 2025, score: 2602, change: 0 },
  { countryCode: 'AZE', rank: 14, year: 2025, score: 2595, change: 1 },
  { countryCode: 'GBR', rank: 15, year: 2025, score: 2588, change: 0 },
  { countryCode: 'NOR', rank: 16, year: 2025, score: 2580, change: 0 },
  { countryCode: 'IRN', rank: 17, year: 2025, score: 2572, change: 0 },
  { countryCode: 'CZE', rank: 18, year: 2025, score: 2565, change: 0 },
  { countryCode: 'SRB', rank: 19, year: 2025, score: 2558, change: 0 },
  { countryCode: 'VNM', rank: 20, year: 2025, score: 2550, change: 2 },
  { countryCode: 'ARG', rank: 21, year: 2025, score: 2542, change: 0 },
  { countryCode: 'GEO', rank: 22, year: 2025, score: 2535, change: 0 },
  { countryCode: 'ISR', rank: 23, year: 2025, score: 2528, change: 0 },
  { countryCode: 'ROU', rank: 24, year: 2025, score: 2520, change: 0 },
  { countryCode: 'CUB', rank: 25, year: 2025, score: 2512, change: 0 },
  { countryCode: 'TUR', rank: 26, year: 2025, score: 2505, change: 0 },
  { countryCode: 'ITA', rank: 27, year: 2025, score: 2498, change: 0 },
  { countryCode: 'PER', rank: 28, year: 2025, score: 2490, change: 0 },
  { countryCode: 'AUT', rank: 29, year: 2025, score: 2482, change: 0 },
  { countryCode: 'GRC', rank: 30, year: 2025, score: 2475, change: 0 },
]
