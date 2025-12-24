/**
 * FDI Confidence Index Data
 * Source: Kearney - Foreign Direct Investment Confidence Index 2024
 * https://www.kearney.com/foreign-direct-investment-confidence-index
 */

export const fdiConfidenceIndex = {
  id: 'ri-fdici',
  name: 'FDI Confidence Index',
  shortName: 'FDICI',
  domainId: 'd-economy',
  source: 'Kearney',
  sourceUrl: 'https://www.kearney.com/service/global-business-policy-council/foreign-direct-investment-confidence-index',
  methodology: 'Survey of global business executives measuring investor sentiment regarding future (three-year) FDI flows based on market attractiveness, regulatory environment, and economic outlook.',
  updateFrequency: 'annual',
  scoreMin: 0,
  scoreMax: 3,
  higherIsBetter: true,
  lastUpdated: new Date('2024-04-03'),
}

export const fdiConfidenceRankings = [
  { code: 'USA', rank: 1, year: 2024, score: 2.12 }, // United States
  { code: 'CAN', rank: 2, year: 2024, score: 1.98 }, // Canada
  { code: 'CHN', rank: 3, year: 2024, score: 1.95 }, // China (incl. Hong Kong)
  { code: 'GBR', rank: 4, year: 2024, score: 1.92 }, // United Kingdom
  { code: 'DEU', rank: 5, year: 2024, score: 1.89 }, // Germany
  { code: 'JPN', rank: 6, year: 2024, score: 1.86 }, // Japan
  { code: 'FRA', rank: 7, year: 2024, score: 1.83 }, // France
  { code: 'AUS', rank: 8, year: 2024, score: 1.80 }, // Australia
  { code: 'SGP', rank: 9, year: 2024, score: 1.77 }, // Singapore
  { code: 'ITA', rank: 10, year: 2024, score: 1.74 }, // Italy
  { code: 'ESP', rank: 11, year: 2024, score: 1.71 }, // Spain
  { code: 'NLD', rank: 12, year: 2024, score: 1.68 }, // Netherlands
  { code: 'CHE', rank: 13, year: 2024, score: 1.65 }, // Switzerland
  { code: 'KOR', rank: 14, year: 2024, score: 1.62 }, // South Korea
  { code: 'ARE', rank: 15, year: 2024, score: 1.59 }, // UAE
  { code: 'SAU', rank: 16, year: 2024, score: 1.56 }, // Saudi Arabia
  { code: 'IND', rank: 17, year: 2024, score: 1.53 }, // India
  { code: 'BRA', rank: 18, year: 2024, score: 1.50 }, // Brazil
  { code: 'MEX', rank: 19, year: 2024, score: 1.47 }, // Mexico
  { code: 'POL', rank: 20, year: 2024, score: 1.44 }, // Poland
  { code: 'ARG', rank: 21, year: 2024, score: 1.41 }, // Argentina
  { code: 'SWE', rank: 22, year: 2024, score: 1.38 }, // Sweden
  { code: 'BEL', rank: 23, year: 2024, score: 1.35 }, // Belgium
  { code: 'AUT', rank: 24, year: 2024, score: 1.32 }, // Austria
  { code: 'DNK', rank: 25, year: 2024, score: 1.29 }, // Denmark
]

export const totalCountries = 25
