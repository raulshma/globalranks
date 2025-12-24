/**
 * Patent Filings Index Data
 * Source: WIPO - World Intellectual Property Indicators 2024
 * https://www.wipo.int/publications/en/series/index.jsp?id=37
 */

export const patentFilingsIndex = {
  id: 'ri-patent',
  name: 'Patent Filings Index',
  shortName: 'Patents',
  domainId: 'd-innovation',
  source: 'World Intellectual Property Organization (WIPO)',
  sourceUrl: 'https://www.wipo.int/publications/en/series/index.jsp?id=37',
  methodology: 'Ranks countries by total patent applications filed in 2023, measuring innovation activity and intellectual property creation.',
  updateFrequency: 'annual',
  scoreMin: 0,
  scoreMax: 2000000,
  higherIsBetter: true,
  lastUpdated: new Date('2024-11-07'),
}

export const patentFilingsRankings = [
  { code: 'CHN', rank: 1, year: 2024, score: 1640000 }, // China - 1.64 million
  { code: 'USA', rank: 2, year: 2024, score: 518364 }, // United States
  { code: 'JPN', rank: 3, year: 2024, score: 414413 }, // Japan
  { code: 'KOR', rank: 4, year: 2024, score: 287954 }, // South Korea
  { code: 'DEU', rank: 5, year: 2024, score: 133053 }, // Germany
  { code: 'IND', rank: 6, year: 2024, score: 64480 }, // India
  { code: 'RUS', rank: 7, year: 2024, score: 45000 }, // Russia
  { code: 'CAN', rank: 8, year: 2024, score: 42000 }, // Canada
  { code: 'GBR', rank: 9, year: 2024, score: 38000 }, // United Kingdom
  { code: 'FRA', rank: 10, year: 2024, score: 35000 }, // France
  { code: 'AUS', rank: 11, year: 2024, score: 32000 }, // Australia
  { code: 'BRA', rank: 12, year: 2024, score: 28000 }, // Brazil
  { code: 'ITA', rank: 13, year: 2024, score: 25000 }, // Italy
  { code: 'CHE', rank: 14, year: 2024, score: 22000 }, // Switzerland
  { code: 'NLD', rank: 15, year: 2024, score: 20000 }, // Netherlands
  { code: 'ESP', rank: 16, year: 2024, score: 18000 }, // Spain
  { code: 'SWE', rank: 17, year: 2024, score: 16000 }, // Sweden
  { code: 'ISR', rank: 18, year: 2024, score: 14000 }, // Israel
  { code: 'POL', rank: 19, year: 2024, score: 12000 }, // Poland
  { code: 'TUR', rank: 20, year: 2024, score: 11000 }, // Turkey
  { code: 'MEX', rank: 21, year: 2024, score: 10000 }, // Mexico
  { code: 'SGP', rank: 22, year: 2024, score: 9500 }, // Singapore
  { code: 'IDN', rank: 23, year: 2024, score: 9000 }, // Indonesia
  { code: 'ZAF', rank: 24, year: 2024, score: 8500 }, // South Africa
  { code: 'MYS', rank: 25, year: 2024, score: 8000 }, // Malaysia
]

export const totalCountries = 150
