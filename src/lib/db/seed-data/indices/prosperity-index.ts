/**
 * Legatum Prosperity Index Data
 * Source: Legatum Institute - 2023
 * https://www.prosperity.com/rankings
 */

export const prosperityIndex = {
  id: 'ri-prosperity',
  name: 'Prosperity Index',
  shortName: 'LPI',
  domainId: 'd-economy',
  source: 'Legatum Institute',
  sourceUrl: 'https://www.prosperity.com/rankings',
  methodology: 'Assesses national prosperity across 12 pillars: Safety & Security, Personal Freedom, Governance, Social Capital, Investment Environment, Enterprise Conditions, Infrastructure, Economic Quality, Living Conditions, Health, Education, and Natural Environment. Score ranges from 0-100.',
  updateFrequency: 'annual',
  scoreMin: 0,
  scoreMax: 100,
  higherIsBetter: true,
  lastUpdated: new Date('2023-11-01'),
}

// 2023 Legatum Prosperity Index rankings
export const prosperityRankings = [
  // Top 20
  { code: 'DNK', rank: 1, year: 2023, score: 85.7 }, // Denmark
  { code: 'SWE', rank: 2, year: 2023, score: 84.5 },
  { code: 'NOR', rank: 3, year: 2023, score: 84.3 },
  { code: 'FIN', rank: 4, year: 2023, score: 83.9 },
  { code: 'CHE', rank: 5, year: 2023, score: 83.5 },
  { code: 'IRL', rank: 6, year: 2023, score: 82.8 },
  { code: 'NLD', rank: 7, year: 2023, score: 82.4 },
  { code: 'LUX', rank: 8, year: 2023, score: 82.0 },
  { code: 'DEU', rank: 9, year: 2023, score: 81.6 },
  { code: 'NZL', rank: 10, year: 2023, score: 81.2 },
  { code: 'AUT', rank: 11, year: 2023, score: 80.8 },
  { code: 'ISL', rank: 12, year: 2023, score: 80.5 },
  { code: 'GBR', rank: 13, year: 2023, score: 80.1 },
  { code: 'CAN', rank: 14, year: 2023, score: 79.6 },
  { code: 'AUS', rank: 15, year: 2023, score: 79.2 },
  { code: 'JPN', rank: 16, year: 2023, score: 78.5 },
  { code: 'SGP', rank: 17, year: 2023, score: 78.1 },
  { code: 'BEL', rank: 18, year: 2023, score: 77.8 },
  { code: 'USA', rank: 19, year: 2023, score: 77.4 },
  { code: 'FRA', rank: 20, year: 2023, score: 76.9 },
  // 21-50
  { code: 'CZE', rank: 21, year: 2023, score: 76.3 },
  { code: 'HKG', rank: 22, year: 2023, score: 75.8 },
  { code: 'ESP', rank: 23, year: 2023, score: 75.2 },
  { code: 'EST', rank: 24, year: 2023, score: 74.6 },
  { code: 'SVN', rank: 25, year: 2023, score: 74.1 },
  { code: 'PRT', rank: 26, year: 2023, score: 73.5 },
  { code: 'MLT', rank: 27, year: 2023, score: 73.0 },
  { code: 'POL', rank: 28, year: 2023, score: 72.4 },
  { code: 'KOR', rank: 29, year: 2023, score: 71.9 },
  { code: 'LTU', rank: 30, year: 2023, score: 71.3 },
  { code: 'ISR', rank: 32, year: 2023, score: 70.8 },
  { code: 'ITA', rank: 34, year: 2023, score: 70.2 },
  { code: 'LVA', rank: 35, year: 2023, score: 69.7 },
  { code: 'CHL', rank: 37, year: 2023, score: 68.9 },
  { code: 'SVK', rank: 38, year: 2023, score: 68.4 },
  { code: 'GRC', rank: 40, year: 2023, score: 67.8 },
  { code: 'HRV', rank: 41, year: 2023, score: 67.2 },
  { code: 'CRI', rank: 42, year: 2023, score: 66.7 },
  { code: 'URY', rank: 43, year: 2023, score: 66.1 },
  { code: 'ARE', rank: 44, year: 2023, score: 65.5 },
  { code: 'ROU', rank: 45, year: 2023, score: 65.0 },
  { code: 'QAT', rank: 46, year: 2023, score: 64.5 },
  { code: 'MUS', rank: 47, year: 2023, score: 64.0 },
  { code: 'BGR', rank: 48, year: 2023, score: 63.5 },
  { code: 'HUN', rank: 49, year: 2023, score: 63.0 },
  { code: 'PAN', rank: 50, year: 2023, score: 62.5 },
  // 51-100
  { code: 'ARG', rank: 51, year: 2023, score: 62.1 },
  { code: 'MYS', rank: 52, year: 2023, score: 61.8 },
  { code: 'SRB', rank: 53, year: 2023, score: 61.4 },
  { code: 'CHN', rank: 54, year: 2023, score: 62.1 },
  { code: 'THA', rank: 56, year: 2023, score: 61.0 },
  { code: 'MNE', rank: 58, year: 2023, score: 60.5 },
  { code: 'TUR', rank: 60, year: 2023, score: 59.8 },
  { code: 'MEX', rank: 71, year: 2023, score: 57.3 },
  { code: 'IDN', rank: 63, year: 2023, score: 60.9 },
  { code: 'BRA', rank: 66, year: 2023, score: 60.1 },
  { code: 'COL', rank: 68, year: 2023, score: 59.4 },
  { code: 'ZAF', rank: 70, year: 2023, score: 58.1 },
  { code: 'VNM', rank: 73, year: 2023, score: 58.9 },
  { code: 'RUS', rank: 77, year: 2023, score: 56.8 },
  { code: 'PHL', rank: 79, year: 2023, score: 56.2 },
  { code: 'EGY', rank: 85, year: 2023, score: 54.8 },
  { code: 'UKR', rank: 88, year: 2023, score: 53.9 },
  { code: 'IRN', rank: 96, year: 2023, score: 51.5 },
  // 101-130
  { code: 'IND', rank: 103, year: 2023, score: 53.7 },
  { code: 'NPL', rank: 108, year: 2023, score: 48.6 },
  { code: 'KEN', rank: 110, year: 2023, score: 47.8 },
  { code: 'NGA', rank: 118, year: 2023, score: 45.3 },
  { code: 'BGD', rank: 124, year: 2023, score: 47.9 },
  { code: 'PAK', rank: 136, year: 2023, score: 45.1 },
  { code: 'ETH', rank: 142, year: 2023, score: 42.1 },
  { code: 'SDN', rank: 155, year: 2023, score: 36.8 },
  { code: 'YEM', rank: 162, year: 2023, score: 32.5 },
  { code: 'SSD', rank: 167, year: 2023, score: 28.4 }, // South Sudan (bottom)
]

export const totalCountries = 167
