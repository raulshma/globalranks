/**
 * Mercer CFA Institute Global Pension Index 2024 - Real data
 * Source: Mercer & CFA Institute
 * URL: https://www.mercer.com/global-pension-index/
 * 
 * The Global Pension Index evaluates retirement income systems based on
 * adequacy, sustainability, and integrity. Grades range from A (best) to E (worst).
 */

export const pensionIndex = {
  id: 'global-pension-index',
  name: 'Mercer Global Pension Index',
  shortName: 'MCGPI',
  domain: 'economy',
  source: 'Mercer & CFA Institute',
  sourceUrl: 'https://www.mercer.com/global-pension-index/',
  methodology: 'Evaluates retirement income systems based on three sub-indices: adequacy (40% weighting), sustainability (35% weighting), and integrity (25% weighting). Over 50 indicators are assessed. Scores range from 0 to 100, with grades from A (80+) to E (below 35).',
  description: 'The Global Pension Index is a comprehensive comparison of retirement income systems worldwide, measuring their effectiveness and sustainability.',
  isHigherBetter: true,
  lastUpdated: new Date('2025-12-01'),
  updateFrequency: 'Annual',
}

export const totalCountries = 48

// Rankings for 2024
export const pensionRankings = [
  // Grade A (80+) - First-class retirement systems
  { countryCode: 'NLD', rank: 1, year: 2024, score: 84.8 },
  { countryCode: 'ISL', rank: 2, year: 2024, score: 83.4 },
  { countryCode: 'DNK', rank: 3, year: 2024, score: 81.6 },
  { countryCode: 'ISR', rank: 4, year: 2024, score: 80.2 },
  
  // Grade B+ (75-80) - Sound structure with many good features
  { countryCode: 'FIN', rank: 5, year: 2024, score: 75.9 },
  { countryCode: 'AUS', rank: 6, year: 2024, score: 76.7 },
  { countryCode: 'NOR', rank: 7, year: 2024, score: 75.2 },
  { countryCode: 'CHL', rank: 8, year: 2024, score: 74.9 },
  { countryCode: 'SWE', rank: 9, year: 2024, score: 74.3 },
  { countryCode: 'SGP', rank: 10, year: 2024, score: 73.8 },
  
  // Grade B (65-75) - Sound structure but improvements possible
  { countryCode: 'GBR', rank: 11, year: 2024, score: 71.6 },
  { countryCode: 'CHE', rank: 12, year: 2024, score: 71.5 },
  { countryCode: 'URY', rank: 13, year: 2024, score: 68.9 },
  { countryCode: 'NZL', rank: 14, year: 2024, score: 68.7 },
  { countryCode: 'BEL', rank: 15, year: 2024, score: 68.6 },
  { countryCode: 'MEX', rank: 16, year: 2024, score: 68.5 },
  { countryCode: 'CAN', rank: 17, year: 2024, score: 68.4 },
  { countryCode: 'IRL', rank: 18, year: 2024, score: 68.1 },
  { countryCode: 'HKG', rank: 19, year: 2024, score: 66.2 },
  { countryCode: 'DEU', rank: 20, year: 2024, score: 65.8 },
  
  // Grade C+ (60-65) - Some good features but major risks/shortcomings
  { countryCode: 'PRT', rank: 21, year: 2024, score: 64.5 },
  { countryCode: 'ESP', rank: 22, year: 2024, score: 63.8 },
  { countryCode: 'FRA', rank: 23, year: 2024, score: 63.2 },
  { countryCode: 'COL', rank: 24, year: 2024, score: 62.5 },
  { countryCode: 'ZAF', rank: 25, year: 2024, score: 62.0 },
  { countryCode: 'ARE', rank: 26, year: 2024, score: 61.5 },
  { countryCode: 'SAU', rank: 27, year: 2024, score: 61.0 },
  { countryCode: 'ITA', rank: 28, year: 2024, score: 60.8 },
  { countryCode: 'USA', rank: 29, year: 2024, score: 60.4 },
  
  // Grade C (50-60) - Some good features but major risks/shortcomings
  { countryCode: 'POL', rank: 30, year: 2024, score: 56.8 },
  { countryCode: 'CHN', rank: 31, year: 2024, score: 56.5 },
  { countryCode: 'MYS', rank: 32, year: 2024, score: 56.3 },
  { countryCode: 'BRA', rank: 33, year: 2024, score: 55.8 },
  { countryCode: 'BWA', rank: 34, year: 2024, score: 55.4 },
  { countryCode: 'PER', rank: 35, year: 2024, score: 54.7 },
  { countryCode: 'JPN', rank: 36, year: 2024, score: 54.9 },
  { countryCode: 'VNM', rank: 37, year: 2024, score: 54.5 },
  { countryCode: 'TWN', rank: 38, year: 2024, score: 53.7 },
  { countryCode: 'AUT', rank: 39, year: 2024, score: 53.4 },
  { countryCode: 'KOR', rank: 40, year: 2024, score: 52.2 },
  { countryCode: 'IDN', rank: 41, year: 2024, score: 50.2 },
  { countryCode: 'THA', rank: 42, year: 2024, score: 50.0 },
  
  // Grade D (35-50) - Major weaknesses and/or omissions
  { countryCode: 'TUR', rank: 43, year: 2024, score: 48.5 },
  { countryCode: 'PAK', rank: 44, year: 2024, score: 47.2 },
  { countryCode: 'PHL', rank: 45, year: 2024, score: 45.8 },
  { countryCode: 'ARG', rank: 46, year: 2024, score: 45.5 },
  { countryCode: 'BGD', rank: 47, year: 2024, score: 44.5 },
  { countryCode: 'IND', rank: 48, year: 2024, score: 44.0 },
]
