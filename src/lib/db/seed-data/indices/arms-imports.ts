/**
 * SIPRI Arms Imports Index Data
 * Source: Stockholm International Peace Research Institute (SIPRI) - 2024
 * https://www.sipri.org/
 */

export const armsImportsIndex = {
  id: 'ri-arms-imports',
  name: 'SIPRI Arms Imports Index',
  shortName: 'Arms Imports',
  domainId: 'd-military',
  source: 'Stockholm International Peace Research Institute (SIPRI)',
  sourceUrl: 'https://www.sipri.org/',
  methodology: 'Measures share of global arms imports by country over a 5-year period (2020-2024). Based on trend-indicator values (TIV) which represent transfer of military resources.',
  updateFrequency: 'annual',
  scoreMin: 0,
  scoreMax: 100,
  higherIsBetter: false,
  lastUpdated: new Date('2024-03-01'),
}

export const armsImportsRankings = [
  { code: 'UKR', rank: 1, year: 2024, score: 8.8 },
  { code: 'IND', rank: 2, year: 2024, score: 8.3 },
  { code: 'QAT', rank: 3, year: 2024, score: 6.8 },
  { code: 'SAU', rank: 4, year: 2024, score: 6.8 },
  { code: 'PAK', rank: 5, year: 2024, score: 4.6 },
  { code: 'JPN', rank: 6, year: 2024, score: 3.9 },
  { code: 'AUS', rank: 7, year: 2024, score: 3.5 },
  { code: 'EGY', rank: 8, year: 2024, score: 3.3 },
  { code: 'USA', rank: 9, year: 2024, score: 3.1 },
  { code: 'KWT', rank: 10, year: 2024, score: 2.9 },
  { code: 'KOR', rank: 11, year: 2024, score: 2.7 },
  { code: 'GBR', rank: 12, year: 2024, score: 2.5 },
  { code: 'POL', rank: 13, year: 2024, score: 2.4 },
  { code: 'NOR', rank: 14, year: 2024, score: 2.2 },
  { code: 'ARE', rank: 15, year: 2024, score: 2.1 },
  { code: 'TUR', rank: 16, year: 2024, score: 2.0 },
  { code: 'DEU', rank: 17, year: 2024, score: 1.9 },
  { code: 'NLD', rank: 18, year: 2024, score: 1.8 },
  { code: 'ISR', rank: 19, year: 2024, score: 1.7 },
  { code: 'IDN', rank: 20, year: 2024, score: 1.6 },
  { code: 'GRC', rank: 21, year: 2024, score: 1.5 },
  { code: 'THA', rank: 22, year: 2024, score: 1.4 },
  { code: 'VNM', rank: 23, year: 2024, score: 1.3 },
  { code: 'PHL', rank: 24, year: 2024, score: 1.2 },
  { code: 'SGP', rank: 25, year: 2024, score: 1.1 },
  { code: 'MYS', rank: 26, year: 2024, score: 1.0 },
  { code: 'BRA', rank: 27, year: 2024, score: 0.9 },
  { code: 'CAN', rank: 28, year: 2024, score: 0.8 },
  { code: 'ITA', rank: 29, year: 2024, score: 0.7 },
  { code: 'ESP', rank: 30, year: 2024, score: 0.6 },
]

export const totalCountries = 162
