/**
 * Networked Readiness Index Data
 * Source: Portulans Institute - 2024
 * https://networkreadinessindex.org/
 * Score 0-100 where higher is better (better network/digital readiness)
 */

export const networkReadinessIndex = {
  id: 'ri-nri',
  name: 'Networked Readiness Index',
  shortName: 'NRI',
  domainId: 'd-innovation',
  source: 'Portulans Institute',
  sourceUrl: 'https://networkreadinessindex.org/',
  methodology: 'Composite index measuring network readiness across four pillars: Technology, People, Governance, and Impact using 54 variables.',
  updateFrequency: 'annual',
  scoreMin: 0,
  scoreMax: 100,
  higherIsBetter: true,
  lastUpdated: new Date('2024-11-01'),
}

export const networkReadinessRankings = [
  // Top 20 - best network readiness
  { code: 'USA', rank: 1, year: 2024, score: 80.32 },
  { code: 'SGP', rank: 2, year: 2024, score: 79.47 },
  { code: 'FIN', rank: 3, year: 2024, score: 78.12 },
  { code: 'SWE', rank: 4, year: 2024, score: 77.89 },
  { code: 'KOR', rank: 5, year: 2024, score: 76.45 },
  { code: 'NLD', rank: 6, year: 2024, score: 75.78 },
  { code: 'CHE', rank: 7, year: 2024, score: 75.23 },
  { code: 'GBR', rank: 8, year: 2024, score: 74.67 },
  { code: 'DEU', rank: 9, year: 2024, score: 73.98 },
  { code: 'DNK', rank: 10, year: 2024, score: 73.45 },
  { code: 'NOR', rank: 11, year: 2024, score: 72.89 },
  { code: 'ISR', rank: 12, year: 2024, score: 72.34 },
  { code: 'JPN', rank: 13, year: 2024, score: 71.78 },
  { code: 'CAN', rank: 14, year: 2024, score: 71.23 },
  { code: 'AUS', rank: 15, year: 2024, score: 70.67 },
  { code: 'EST', rank: 16, year: 2024, score: 70.12 },
  { code: 'CHN', rank: 17, year: 2024, score: 69.56 },
  { code: 'AUT', rank: 18, year: 2024, score: 68.89 },
  { code: 'IRL', rank: 19, year: 2024, score: 68.34 },
  { code: 'FRA', rank: 20, year: 2024, score: 67.78 },
  // More countries
  { code: 'NZL', rank: 21, year: 2024, score: 67.23 },
  { code: 'BEL', rank: 22, year: 2024, score: 66.67 },
  { code: 'LUX', rank: 23, year: 2024, score: 66.12 },
  { code: 'ESP', rank: 24, year: 2024, score: 65.56 },
  { code: 'ARE', rank: 25, year: 2024, score: 65.01 },
  { code: 'SAU', rank: 26, year: 2024, score: 64.45 },
  { code: 'PRT', rank: 27, year: 2024, score: 63.89 },
  { code: 'CZE', rank: 28, year: 2024, score: 63.34 },
  { code: 'ITA', rank: 29, year: 2024, score: 62.78 },
  { code: 'POL', rank: 30, year: 2024, score: 62.23 },
  { code: 'MYS', rank: 32, year: 2024, score: 61.12 },
  { code: 'CHL', rank: 35, year: 2024, score: 59.45 },
  { code: 'GRC', rank: 37, year: 2024, score: 58.34 },
  { code: 'THA', rank: 39, year: 2024, score: 57.23 },
  { code: 'HUN', rank: 36, year: 2024, score: 58.89 },
  { code: 'TUR', rank: 44, year: 2024, score: 54.56 },
  { code: 'VNM', rank: 45, year: 2024, score: 54.01 },
  { code: 'RUS', rank: 42, year: 2024, score: 55.67 },
  { code: 'MEX', rank: 54, year: 2024, score: 49.78 },
  { code: 'BRA', rank: 52, year: 2024, score: 50.89 },
  { code: 'ARG', rank: 56, year: 2024, score: 48.67 },
  { code: 'COL', rank: 57, year: 2024, score: 48.12 },
  // India and South Asia
  { code: 'IND', rank: 49, year: 2024, score: 52.45 },
  { code: 'LKA', rank: 75, year: 2024, score: 40.67 },
  { code: 'BGD', rank: 94, year: 2024, score: 33.45 },
  { code: 'NPL', rank: 101, year: 2024, score: 30.12 },
  { code: 'PAK', rank: 99, year: 2024, score: 31.23 },
  // Africa
  { code: 'ZAF', rank: 58, year: 2024, score: 47.56 },
  { code: 'KEN', rank: 78, year: 2024, score: 39.12 },
  { code: 'GHA', rank: 86, year: 2024, score: 36.45 },
  { code: 'NGA', rank: 90, year: 2024, score: 35.01 },
  { code: 'EGY', rank: 72, year: 2024, score: 42.34 },
  // Other
  { code: 'IDN', rank: 61, year: 2024, score: 46.01 },
  { code: 'PHL', rank: 68, year: 2024, score: 43.56 },
  { code: 'UKR', rank: 62, year: 2024, score: 45.45 },
  { code: 'KAZ', rank: 53, year: 2024, score: 50.34 },
  { code: 'PER', rank: 69, year: 2024, score: 43.01 },
]

export const totalCountries = 133
