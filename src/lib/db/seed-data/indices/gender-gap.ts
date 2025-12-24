/**
 * Global Gender Gap Index Data
 * Source: World Economic Forum (WEF) - 2024
 * https://www.weforum.org/reports/global-gender-gap-report-2024/
 * Score represents percentage of gender gap closed (0-100%). Higher is better.
 */

export const genderGapIndex = {
  id: 'ri-gggi',
  name: 'Global Gender Gap Index',
  shortName: 'GGGI',
  domainId: 'd-social',
  source: 'World Economic Forum (WEF)',
  sourceUrl: 'https://www.weforum.org/reports/global-gender-gap-report-2024/',
  methodology: 'Composite index measuring gender parity across four dimensions: economic participation, educational attainment, health, and political empowerment.',
  updateFrequency: 'annual',
  scoreMin: 0,
  scoreMax: 100,
  higherIsBetter: true,
  lastUpdated: new Date('2024-06-12'),
}

export const genderGapRankings = [
  // Top 20 - most gender equal
  { code: 'ISL', rank: 1, year: 2024, score: 93.5 },
  { code: 'FIN', rank: 2, year: 2024, score: 87.5 },
  { code: 'NOR', rank: 3, year: 2024, score: 87.4 },
  { code: 'NZL', rank: 4, year: 2024, score: 83.5 },
  { code: 'SWE', rank: 5, year: 2024, score: 81.6 },
  { code: 'DEU', rank: 6, year: 2024, score: 81.0 },
  { code: 'IRL', rank: 7, year: 2024, score: 80.2 },
  { code: 'ESP', rank: 8, year: 2024, score: 79.7 },
  { code: 'GBR', rank: 9, year: 2024, score: 79.2 },
  { code: 'AUS', rank: 24, year: 2024, score: 78.0 },
  { code: 'NLD', rank: 27, year: 2024, score: 77.2 },
  { code: 'BEL', rank: 12, year: 2024, score: 77.9 },
  { code: 'PRT', rank: 29, year: 2024, score: 77.0 },
  { code: 'CAN', rank: 35, year: 2024, score: 76.1 },
  { code: 'FRA', rank: 22, year: 2024, score: 75.6 },
  { code: 'CHE', rank: 25, year: 2024, score: 76.8 },
  { code: 'DNK', rank: 23, year: 2024, score: 76.5 },
  { code: 'SGP', rank: 48, year: 2024, score: 74.4 },
  { code: 'AUT', rank: 37, year: 2024, score: 75.8 },
  { code: 'ITA', rank: 87, year: 2024, score: 70.5 },
  // Asia Pacific
  { code: 'PHL', rank: 16, year: 2024, score: 77.9 },
  { code: 'THA', rank: 66, year: 2024, score: 72.0 },
  { code: 'VNM', rank: 72, year: 2024, score: 71.0 },
  { code: 'MYS', rank: 102, year: 2024, score: 68.2 },
  { code: 'IDN', rank: 87, year: 2024, score: 69.7 },
  { code: 'CHN', rank: 106, year: 2024, score: 67.8 },
  { code: 'JPN', rank: 118, year: 2024, score: 66.3 },
  { code: 'KOR', rank: 94, year: 2024, score: 69.3 },
  // Americas
  { code: 'USA', rank: 43, year: 2024, score: 74.8 },
  { code: 'ARG', rank: 33, year: 2024, score: 76.3 },
  { code: 'MEX', rank: 33, year: 2024, score: 76.4 },
  { code: 'BRA', rank: 57, year: 2024, score: 73.0 },
  { code: 'COL', rank: 36, year: 2024, score: 75.7 },
  { code: 'CHL', rank: 38, year: 2024, score: 75.6 },
  { code: 'PER', rank: 65, year: 2024, score: 72.1 },
  { code: 'CRI', rank: 30, year: 2024, score: 76.8 },
  // South Asia
  { code: 'BGD', rank: 99, year: 2024, score: 68.8 },
  { code: 'NPL', rank: 117, year: 2024, score: 66.3 },
  { code: 'LKA', rank: 122, year: 2024, score: 65.3 },
  { code: 'IND', rank: 129, year: 2024, score: 64.1 },
  { code: 'PAK', rank: 145, year: 2024, score: 57.1 },
  // Middle East and Africa
  { code: 'ZAF', rank: 18, year: 2024, score: 78.2 },
  { code: 'ARE', rank: 74, year: 2024, score: 71.3 },
  { code: 'SAU', rank: 126, year: 2024, score: 64.8 },
  { code: 'TUR', rank: 132, year: 2024, score: 63.0 },
  { code: 'EGY', rank: 135, year: 2024, score: 61.4 },
  { code: 'NGA', rank: 105, year: 2024, score: 67.9 },
  { code: 'KEN', rank: 63, year: 2024, score: 72.5 },
  // Eastern Europe
  { code: 'POL', rank: 41, year: 2024, score: 75.1 },
  { code: 'RUS', rank: 54, year: 2024, score: 73.4 },
  { code: 'UKR', rank: 55, year: 2024, score: 73.3 },
  { code: 'CZE', rank: 76, year: 2024, score: 71.2 },
  { code: 'HUN', rank: 89, year: 2024, score: 69.6 },
  { code: 'ROU', rank: 68, year: 2024, score: 71.6 },
]

export const totalCountries = 146
