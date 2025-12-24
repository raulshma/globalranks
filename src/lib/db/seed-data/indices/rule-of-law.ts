/**
 * Rule of Law Index Data
 * Source: World Justice Project (WJP) - 2024
 * https://worldjusticeproject.org/rule-of-law-index/
 * Score 0-1 where higher is better (stronger rule of law)
 */

export const ruleOfLawIndex = {
  id: 'ri-roli',
  name: 'Rule of Law Index',
  shortName: 'RoLI',
  domainId: 'd-governance',
  source: 'World Justice Project (WJP)',
  sourceUrl: 'https://worldjusticeproject.org/rule-of-law-index/',
  methodology: 'Composite index measuring rule of law across eight factors: government powers, corruption, open government, fundamental rights, order, regulatory enforcement, civil justice, and criminal justice.',
  updateFrequency: 'annual',
  scoreMin: 0,
  scoreMax: 1,
  higherIsBetter: true,
  lastUpdated: new Date('2024-10-01'),
}

export const ruleOfLawRankings = [
  // Top 20 - strongest rule of law
  { code: 'DNK', rank: 1, year: 2024, score: 0.90 },
  { code: 'NOR', rank: 2, year: 2024, score: 0.89 },
  { code: 'FIN', rank: 3, year: 2024, score: 0.87 },
  { code: 'SWE', rank: 4, year: 2024, score: 0.86 },
  { code: 'DEU', rank: 5, year: 2024, score: 0.84 },
  { code: 'NZL', rank: 6, year: 2024, score: 0.83 },
  { code: 'LUX', rank: 7, year: 2024, score: 0.83 },
  { code: 'NLD', rank: 8, year: 2024, score: 0.82 },
  { code: 'IRL', rank: 9, year: 2024, score: 0.82 },
  { code: 'EST', rank: 10, year: 2024, score: 0.81 },
  { code: 'AUS', rank: 11, year: 2024, score: 0.80 },
  { code: 'CAN', rank: 12, year: 2024, score: 0.79 },
  { code: 'AUT', rank: 13, year: 2024, score: 0.79 },
  { code: 'JPN', rank: 14, year: 2024, score: 0.78 },
  { code: 'GBR', rank: 15, year: 2024, score: 0.78 },
  { code: 'SGP', rank: 16, year: 2024, score: 0.77 },
  { code: 'BEL', rank: 17, year: 2024, score: 0.76 },
  { code: 'LTU', rank: 18, year: 2024, score: 0.75 },
  { code: 'KOR', rank: 19, year: 2024, score: 0.74 },
  { code: 'CZE', rank: 20, year: 2024, score: 0.73 },
  // More developed nations
  { code: 'FRA', rank: 22, year: 2024, score: 0.72 },
  { code: 'ESP', rank: 24, year: 2024, score: 0.71 },
  { code: 'USA', rank: 26, year: 2024, score: 0.69 },
  { code: 'PRT', rank: 23, year: 2024, score: 0.72 },
  { code: 'POL', rank: 35, year: 2024, score: 0.65 },
  { code: 'ITA', rank: 32, year: 2024, score: 0.66 },
  { code: 'GRC', rank: 43, year: 2024, score: 0.60 },
  { code: 'CRI', rank: 25, year: 2024, score: 0.70 },
  { code: 'URY', rank: 21, year: 2024, score: 0.72 },
  { code: 'CHL', rank: 27, year: 2024, score: 0.68 },
  // Asia Pacific
  { code: 'MYS', rank: 49, year: 2024, score: 0.58 },
  { code: 'CHN', rank: 94, year: 2024, score: 0.47 },
  { code: 'VNM', rank: 85, year: 2024, score: 0.49 },
  { code: 'THA', rank: 78, year: 2024, score: 0.50 },
  { code: 'IDN', rank: 63, year: 2024, score: 0.54 },
  { code: 'PHL', rank: 87, year: 2024, score: 0.49 },
  // South Asia
  { code: 'NPL', rank: 69, year: 2024, score: 0.52 },
  { code: 'LKA', rank: 75, year: 2024, score: 0.51 },
  { code: 'IND', rank: 79, year: 2024, score: 0.50 },
  { code: 'BGD', rank: 103, year: 2024, score: 0.44 },
  { code: 'PAK', rank: 122, year: 2024, score: 0.40 },
  { code: 'AFG', rank: 140, year: 2024, score: 0.32 },
  // Middle East and Africa
  { code: 'ARE', rank: 34, year: 2024, score: 0.65 },
  { code: 'JOR', rank: 54, year: 2024, score: 0.55 },
  { code: 'TUN', rank: 68, year: 2024, score: 0.52 },
  { code: 'SAU', rank: 61, year: 2024, score: 0.55 },
  { code: 'ZAF', rank: 55, year: 2024, score: 0.55 },
  { code: 'GHA', rank: 53, year: 2024, score: 0.56 },
  { code: 'KEN', rank: 99, year: 2024, score: 0.45 },
  { code: 'NGA', rank: 117, year: 2024, score: 0.41 },
  { code: 'EGY', rank: 126, year: 2024, score: 0.38 },
  { code: 'ETH', rank: 129, year: 2024, score: 0.37 },
  // Latin America
  { code: 'BRA', rank: 72, year: 2024, score: 0.51 },
  { code: 'ARG', rank: 74, year: 2024, score: 0.51 },
  { code: 'MEX', rank: 116, year: 2024, score: 0.41 },
  { code: 'COL', rank: 82, year: 2024, score: 0.50 },
  { code: 'PER', rank: 90, year: 2024, score: 0.48 },
  // Eastern Europe
  { code: 'ROU', rank: 50, year: 2024, score: 0.58 },
  { code: 'HUN', rank: 67, year: 2024, score: 0.53 },
  { code: 'SRB', rank: 75, year: 2024, score: 0.51 },
  { code: 'UKR', rank: 71, year: 2024, score: 0.52 },
  { code: 'RUS', rank: 107, year: 2024, score: 0.43 },
  { code: 'TUR', rank: 113, year: 2024, score: 0.42 },
  // Bottom countries
  { code: 'MMR', rank: 138, year: 2024, score: 0.33 },
  { code: 'KHM', rank: 141, year: 2024, score: 0.31 },
  { code: 'VEN', rank: 142, year: 2024, score: 0.27 },
]

export const totalCountries = 142
