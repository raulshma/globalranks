/**
 * ICT Development Index Data
 * Source: International Telecommunication Union (ITU) - 2024
 * https://www.itu.int/en/ITU-D/Statistics/Pages/IDI/default.aspx
 * Score 0-100 where higher is better (better ICT development)
 */

export const ictDevelopmentIndex = {
  id: 'ri-idi',
  name: 'ICT Development Index',
  shortName: 'IDI',
  domainId: 'd-innovation',
  source: 'International Telecommunication Union (ITU)',
  sourceUrl: 'https://www.itu.int/en/ITU-D/Statistics/Pages/IDI/default.aspx',
  methodology: 'Composite index measuring ICT development based on universal connectivity and meaningful connectivity sub-indices.',
  updateFrequency: 'annual',
  scoreMin: 0,
  scoreMax: 100,
  higherIsBetter: true,
  lastUpdated: new Date('2024-06-01'),
}

export const ictDevelopmentRankings = [
  // Top performers - highest ICT development
  { code: 'SGP', rank: 1, year: 2024, score: 100.0 },
  { code: 'DNK', rank: 2, year: 2024, score: 99.2 },
  { code: 'KOR', rank: 3, year: 2024, score: 98.8 },
  { code: 'ARE', rank: 4, year: 2024, score: 97.5 },
  { code: 'CHE', rank: 5, year: 2024, score: 97.2 },
  { code: 'NOR', rank: 6, year: 2024, score: 96.8 },
  { code: 'SWE', rank: 7, year: 2024, score: 96.5 },
  { code: 'GBR', rank: 8, year: 2024, score: 96.1 },
  { code: 'NLD', rank: 9, year: 2024, score: 95.8 },
  { code: 'FIN', rank: 10, year: 2024, score: 95.4 },
  { code: 'JPN', rank: 11, year: 2024, score: 95.1 },
  { code: 'SAU', rank: 12, year: 2024, score: 95.7 },
  { code: 'USA', rank: 13, year: 2024, score: 94.7 },
  { code: 'DEU', rank: 14, year: 2024, score: 94.3 },
  { code: 'AUS', rank: 15, year: 2024, score: 93.9 },
  { code: 'EST', rank: 16, year: 2024, score: 93.5 },
  { code: 'FRA', rank: 17, year: 2024, score: 93.1 },
  { code: 'NZL', rank: 18, year: 2024, score: 92.7 },
  { code: 'CAN', rank: 19, year: 2024, score: 92.3 },
  { code: 'BEL', rank: 20, year: 2024, score: 91.9 },
  // More developed nations
  { code: 'ISR', rank: 21, year: 2024, score: 91.5 },
  { code: 'BHR', rank: 22, year: 2024, score: 91.2 },
  { code: 'QAT', rank: 23, year: 2024, score: 90.8 },
  { code: 'ESP', rank: 24, year: 2024, score: 90.4 },
  { code: 'AUT', rank: 25, year: 2024, score: 90.0 },
  { code: 'ITA', rank: 28, year: 2024, score: 88.9 },
  { code: 'PRT', rank: 29, year: 2024, score: 88.5 },
  { code: 'IRL', rank: 26, year: 2024, score: 89.6 },
  { code: 'CZE', rank: 30, year: 2024, score: 88.1 },
  { code: 'GRC', rank: 32, year: 2024, score: 87.3 },
  { code: 'POL', rank: 33, year: 2024, score: 86.9 },
  { code: 'HUN', rank: 34, year: 2024, score: 86.5 },
  { code: 'SVK', rank: 35, year: 2024, score: 86.1 },
  { code: 'CHL', rank: 42, year: 2024, score: 83.2 },
  { code: 'MYS', rank: 45, year: 2024, score: 81.8 },
  { code: 'RUS', rank: 47, year: 2024, score: 80.9 },
  { code: 'TUR', rank: 52, year: 2024, score: 78.5 },
  { code: 'CHN', rank: 53, year: 2024, score: 78.1 },
  { code: 'MEX', rank: 68, year: 2024, score: 70.3 },
  { code: 'BRA', rank: 67, year: 2024, score: 70.8 },
  { code: 'THA', rank: 61, year: 2024, score: 74.2 },
  { code: 'ARG', rank: 65, year: 2024, score: 71.6 },
  { code: 'COL', rank: 71, year: 2024, score: 68.7 },
  // South Asia
  { code: 'IND', rank: 97, year: 2024, score: 51.2 },
  { code: 'LKA', rank: 79, year: 2024, score: 64.5 },
  { code: 'VNM', rank: 75, year: 2024, score: 66.8 },
  { code: 'IDN', rank: 85, year: 2024, score: 59.6 },
  { code: 'PHL', rank: 89, year: 2024, score: 56.7 },
  { code: 'BGD', rank: 112, year: 2024, score: 42.3 },
  { code: 'NPL', rank: 129, year: 2024, score: 33.8 },
  { code: 'PAK', rank: 123, year: 2024, score: 37.5 },
  // Africa
  { code: 'ZAF', rank: 82, year: 2024, score: 61.8 },
  { code: 'EGY', rank: 93, year: 2024, score: 53.6 },
  { code: 'KEN', rank: 108, year: 2024, score: 44.2 },
  { code: 'GHA', rank: 115, year: 2024, score: 40.8 },
  { code: 'NGA', rank: 125, year: 2024, score: 36.2 },
  // Lower performers
  { code: 'AFG', rank: 158, year: 2024, score: 21.3 },
  { code: 'ETH', rank: 147, year: 2024, score: 26.5 },
]

export const totalCountries = 170
