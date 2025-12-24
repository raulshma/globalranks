/**
 * International Intellectual Property Index Data
 * Source: U.S. Chamber of Commerce - 2024
 * https://www.uschamber.com/intellectual-property/international-ip-index
 */

export const ipIndex = {
  id: 'ri-ip',
  name: 'International IP Index',
  shortName: 'IPI',
  domainId: 'd-economy',
  source: 'U.S. Chamber of Commerce',
  sourceUrl: 'https://www.uschamber.com/intellectual-property/international-ip-index',
  methodology: 'Evaluates intellectual property frameworks of economies across 50 unique criteria including patent protection, copyright laws, trademark enforcement, trade secrets, enforcement mechanisms, and international treaties. Score expressed as percentage of ideal IP environment.',
  updateFrequency: 'annual',
  scoreMin: 0,
  scoreMax: 100,
  higherIsBetter: true,
  lastUpdated: new Date('2024-02-01'),
}

// 2024 U.S. Chamber International IP Index rankings
export const ipIndexRankings = [
  // Top 10
  { code: 'USA', rank: 1, year: 2024, score: 95.48 },
  { code: 'GBR', rank: 2, year: 2024, score: 94.12 },
  { code: 'FRA', rank: 3, year: 2024, score: 93.12 },
  { code: 'DEU', rank: 4, year: 2024, score: 92.46 },
  { code: 'SWE', rank: 5, year: 2024, score: 92.12 },
  { code: 'JPN', rank: 6, year: 2024, score: 91.26 },
  { code: 'NLD', rank: 7, year: 2024, score: 91.24 },
  { code: 'IRL', rank: 8, year: 2024, score: 89.38 },
  { code: 'ESP', rank: 9, year: 2024, score: 86.44 },
  { code: 'CHE', rank: 10, year: 2024, score: 85.98 },
  // 11-30
  { code: 'ITA', rank: 11, year: 2024, score: 84.56 },
  { code: 'KOR', rank: 12, year: 2024, score: 83.24 },
  { code: 'AUT', rank: 13, year: 2024, score: 82.18 },
  { code: 'BEL', rank: 14, year: 2024, score: 81.42 },
  { code: 'AUS', rank: 15, year: 2024, score: 80.86 },
  { code: 'CAN', rank: 16, year: 2024, score: 79.54 },
  { code: 'DNK', rank: 17, year: 2024, score: 78.28 },
  { code: 'NOR', rank: 18, year: 2024, score: 76.94 },
  { code: 'FIN', rank: 19, year: 2024, score: 75.62 },
  { code: 'CHN', rank: 20, year: 2024, score: 74.38 },
  { code: 'THA', rank: 21, year: 2024, score: 62.76 },
  { code: 'ARG', rank: 22, year: 2024, score: 60.54 },
  { code: 'CHL', rank: 23, year: 2024, score: 58.82 },
  { code: 'TUR', rank: 24, year: 2024, score: 57.26 },
  { code: 'COL', rank: 25, year: 2024, score: 55.94 },
  { code: 'PER', rank: 26, year: 2024, score: 54.68 },
  { code: 'MYS', rank: 27, year: 2024, score: 53.44 },
  { code: 'ZAF', rank: 28, year: 2024, score: 51.28 },
  { code: 'MEX', rank: 29, year: 2024, score: 49.82 },
  { code: 'MAR', rank: 30, year: 2024, score: 49.72 },
  // 31-55
  { code: 'TWN', rank: 31, year: 2024, score: 48.84 },
  { code: 'NZL', rank: 32, year: 2024, score: 48.42 },
  { code: 'POL', rank: 33, year: 2024, score: 46.52 },
  { code: 'GRC', rank: 34, year: 2024, score: 46.00 },
  { code: 'ISR', rank: 35, year: 2024, score: 44.70 },
  { code: 'UAE', rank: 36, year: 2024, score: 42.16 },
  { code: 'HUN', rank: 37, year: 2024, score: 41.58 },
  { code: 'CZE', rank: 38, year: 2024, score: 41.08 },
  { code: 'PRT', rank: 39, year: 2024, score: 40.88 },
  { code: 'ROU', rank: 40, year: 2024, score: 40.76 },
  { code: 'SGP', rank: 41, year: 2024, score: 40.30 },
  { code: 'IND', rank: 42, year: 2024, score: 38.64 },
  { code: 'UKR', rank: 43, year: 2024, score: 38.28 },
  { code: 'VNM', rank: 44, year: 2024, score: 37.88 },
  { code: 'GHA', rank: 45, year: 2024, score: 37.28 },
  { code: 'BRN', rank: 46, year: 2024, score: 37.00 },
  { code: 'PHL', rank: 47, year: 2024, score: 36.34 },
  { code: 'BRA', rank: 48, year: 2024, score: 33.86 },
  { code: 'IDN', rank: 49, year: 2024, score: 30.40 },
  { code: 'HND', rank: 50, year: 2024, score: 29.58 },
  { code: 'SAU', rank: 51, year: 2024, score: 28.42 },
  { code: 'PAK', rank: 52, year: 2024, score: 27.42 },
  { code: 'DZA', rank: 53, year: 2024, score: 26.36 },
  { code: 'RUS', rank: 54, year: 2024, score: 25.00 },
  { code: 'VEN', rank: 55, year: 2024, score: 14.10 },
]

export const totalCountries = 55
