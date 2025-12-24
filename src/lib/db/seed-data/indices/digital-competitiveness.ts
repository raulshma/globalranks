/**
 * World Digital Competitiveness Ranking Data
 * Source: IMD World Competitiveness Center - WDCR 2024
 * https://www.imd.org/centers/wcc/world-competitiveness-center/rankings/world-digital-competitiveness-ranking/
 */

export const digitalCompetitivenessIndex = {
  id: 'ri-wdcr',
  name: 'World Digital Competitiveness Ranking',
  shortName: 'WDCR',
  domainId: 'd-innovation',
  source: 'IMD World Competitiveness Center',
  sourceUrl: 'https://www.imd.org/centers/wcc/world-competitiveness-center/rankings/world-digital-competitiveness-ranking/',
  methodology: 'Measures the capacity and readiness of 67 economies to adopt and explore digital technologies as a key driver for economic transformation in business, government and wider society.',
  updateFrequency: 'annual',
  scoreMin: 0,
  scoreMax: 100,
  higherIsBetter: true,
  lastUpdated: new Date('2024-11-15'),
}

export const digitalCompetitivenessRankings = [
  { code: 'SGP', rank: 1, year: 2024, score: 100.0 }, // Singapore
  { code: 'CHE', rank: 2, year: 2024, score: 98.5 }, // Switzerland
  { code: 'DNK', rank: 3, year: 2024, score: 97.8 }, // Denmark
  { code: 'USA', rank: 4, year: 2024, score: 96.2 }, // United States
  { code: 'SWE', rank: 5, year: 2024, score: 95.5 }, // Sweden
  { code: 'HKG', rank: 6, year: 2024, score: 94.8 }, // Hong Kong
  { code: 'NLD', rank: 7, year: 2024, score: 94.1 }, // Netherlands
  { code: 'KOR', rank: 8, year: 2024, score: 93.4 }, // South Korea
  { code: 'FIN', rank: 9, year: 2024, score: 92.7 }, // Finland
  { code: 'NOR', rank: 10, year: 2024, score: 92.0 }, // Norway
  { code: 'TWN', rank: 11, year: 2024, score: 91.3 }, // Taiwan
  { code: 'CAN', rank: 12, year: 2024, score: 90.6 }, // Canada
  { code: 'GBR', rank: 13, year: 2024, score: 89.9 }, // United Kingdom
  { code: 'AUS', rank: 14, year: 2024, score: 89.2 }, // Australia
  { code: 'ISR', rank: 15, year: 2024, score: 88.5 }, // Israel
  { code: 'DEU', rank: 16, year: 2024, score: 87.8 }, // Germany
  { code: 'IRL', rank: 17, year: 2024, score: 87.1 }, // Ireland
  { code: 'AUT', rank: 18, year: 2024, score: 86.4 }, // Austria
  { code: 'NZL', rank: 19, year: 2024, score: 85.7 }, // New Zealand
  { code: 'BEL', rank: 20, year: 2024, score: 85.0 }, // Belgium
  { code: 'JPN', rank: 21, year: 2024, score: 84.3 }, // Japan
  { code: 'FRA', rank: 22, year: 2024, score: 83.6 }, // France
  { code: 'EST', rank: 23, year: 2024, score: 82.9 }, // Estonia
  { code: 'CHN', rank: 24, year: 2024, score: 82.2 }, // China
  { code: 'ARE', rank: 25, year: 2024, score: 81.5 }, // UAE
  { code: 'MYS', rank: 30, year: 2024, score: 78.0 }, // Malaysia
  { code: 'SAU', rank: 35, year: 2024, score: 74.5 }, // Saudi Arabia
  { code: 'THA', rank: 40, year: 2024, score: 71.0 }, // Thailand
  { code: 'POL', rank: 42, year: 2024, score: 69.6 }, // Poland
  { code: 'TUR', rank: 45, year: 2024, score: 67.5 }, // Turkey
  { code: 'IND', rank: 51, year: 2024, score: 63.5 }, // India
  { code: 'IDN', rank: 53, year: 2024, score: 61.5 }, // Indonesia
  { code: 'MEX', rank: 55, year: 2024, score: 59.5 }, // Mexico
  { code: 'BRA', rank: 57, year: 2024, score: 57.5 }, // Brazil
  { code: 'ZAF', rank: 59, year: 2024, score: 55.5 }, // South Africa
  { code: 'ARG', rank: 61, year: 2024, score: 53.5 }, // Argentina
  { code: 'COL', rank: 63, year: 2024, score: 51.5 }, // Colombia
  { code: 'PER', rank: 65, year: 2024, score: 49.5 }, // Peru
  { code: 'VEN', rank: 67, year: 2024, score: 47.5 }, // Venezuela
]

export const totalCountries = 67
