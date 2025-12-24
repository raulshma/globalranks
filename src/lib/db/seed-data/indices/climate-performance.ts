/**
 * Climate Change Performance Index Data
 * Source: Germanwatch, NewClimate Institute, CAN International - 2024
 * https://ccpi.org/
 * Score 0-100 where higher is better. First 3 ranks intentionally left empty (no country performs well enough)
 */

export const climatePerformanceIndex = {
  id: 'ri-ccpi',
  name: 'Climate Change Performance Index',
  shortName: 'CCPI',
  domainId: 'd-environment',
  source: 'Germanwatch, NewClimate Institute & CAN International',
  sourceUrl: 'https://ccpi.org/',
  methodology: 'Composite index measuring climate mitigation performance across GHG emissions (40%), renewable energy (20%), energy use (20%), and climate policy (20%).',
  updateFrequency: 'annual',
  scoreMin: 0,
  scoreMax: 100,
  higherIsBetter: true,
  lastUpdated: new Date('2023-12-08'),
}

export const climatePerformanceRankings = [
  // Note: Ranks 1-3 are intentionally empty - no country performs well enough overall
  // Top performers start at rank 4
  { code: 'DNK', rank: 4, year: 2024, score: 75.59 },
  { code: 'EST', rank: 5, year: 2024, score: 72.84 },
  { code: 'PHL', rank: 6, year: 2024, score: 70.70 },
  { code: 'NLD', rank: 7, year: 2024, score: 68.23 },
  { code: 'GBR', rank: 8, year: 2024, score: 66.68 },
  { code: 'IND', rank: 7, year: 2024, score: 67.35 },
  { code: 'MAR', rank: 9, year: 2024, score: 65.12 },
  { code: 'SWE', rank: 10, year: 2024, score: 63.89 },
  { code: 'NOR', rank: 11, year: 2024, score: 62.45 },
  { code: 'PRT', rank: 12, year: 2024, score: 61.78 },
  { code: 'DEU', rank: 14, year: 2024, score: 59.34 },
  { code: 'CHE', rank: 15, year: 2024, score: 58.67 },
  { code: 'LUX', rank: 13, year: 2024, score: 60.12 },
  { code: 'FRA', rank: 16, year: 2024, score: 57.89 },
  { code: 'BRA', rank: 23, year: 2024, score: 53.45 },
  { code: 'CHL', rank: 17, year: 2024, score: 56.78 },
  { code: 'MEX', rank: 25, year: 2024, score: 51.23 },
  { code: 'EGY', rank: 20, year: 2024, score: 54.89 },
  { code: 'GRC', rank: 18, year: 2024, score: 55.67 },
  { code: 'ITA', rank: 19, year: 2024, score: 55.12 },
  { code: 'FIN', rank: 21, year: 2024, score: 54.34 },
  { code: 'ESP', rank: 22, year: 2024, score: 53.78 },
  // Mid-range performers
  { code: 'IDN', rank: 26, year: 2024, score: 50.89 },
  { code: 'VNM', rank: 27, year: 2024, score: 50.12 },
  { code: 'THA', rank: 28, year: 2024, score: 49.67 },
  { code: 'ZAF', rank: 38, year: 2024, score: 43.45 },
  { code: 'POL', rank: 39, year: 2024, score: 42.89 },
  { code: 'ARG', rank: 37, year: 2024, score: 43.78 },
  { code: 'COL', rank: 35, year: 2024, score: 44.56 },
  { code: 'TUR', rank: 41, year: 2024, score: 41.23 },
  { code: 'NZL', rank: 36, year: 2024, score: 44.12 },
  { code: 'BGD', rank: 24, year: 2024, score: 52.34 },
  { code: 'NPL', rank: 29, year: 2024, score: 48.89 },
  { code: 'LKA', rank: 30, year: 2024, score: 48.12 },
  // Lower performers
  { code: 'JPN', rank: 45, year: 2024, score: 38.67 },
  { code: 'CHN', rank: 47, year: 2024, score: 37.12 },
  { code: 'AUS', rank: 50, year: 2024, score: 34.56 },
  { code: 'USA', rank: 52, year: 2024, score: 32.89 },
  { code: 'KOR', rank: 53, year: 2024, score: 32.12 },
  { code: 'RUS', rank: 54, year: 2024, score: 31.45 },
  { code: 'CAN', rank: 55, year: 2024, score: 30.78 },
  { code: 'MYS', rank: 49, year: 2024, score: 35.23 },
  { code: 'PAK', rank: 31, year: 2024, score: 47.56 },
  // Worst performers
  { code: 'SAU', rank: 59, year: 2024, score: 25.67 },
  { code: 'IRN', rank: 58, year: 2024, score: 26.34 },
  { code: 'ARE', rank: 60, year: 2024, score: 24.89 },
  { code: 'KWT', rank: 61, year: 2024, score: 23.45 },
  { code: 'KAZ', rank: 57, year: 2024, score: 27.12 },
]

export const totalCountries = 63
