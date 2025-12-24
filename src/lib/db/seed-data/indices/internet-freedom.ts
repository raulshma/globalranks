/**
 * Freedom on the Net Index Data
 * Source: Freedom House - 2024
 * https://freedomhouse.org/report/freedom-net
 */

export const internetFreedomIndex = {
  id: 'ri-internet-freedom',
  name: 'Freedom on the Net Index',
  shortName: 'Internet Freedom',
  domainId: 'd-governance',
  source: 'Freedom House',
  sourceUrl: 'https://freedomhouse.org/report/freedom-net',
  methodology: 'Assesses internet freedom based on obstacles to access, limits on content, and violations of user rights. Score from 0 (least free) to 100 (most free).',
  updateFrequency: 'annual',
  scoreMin: 0,
  scoreMax: 100,
  higherIsBetter: true,
  lastUpdated: new Date('2024-10-16'),
}

export const internetFreedomRankings = [
  { code: 'ISL', rank: 1, year: 2024, score: 94 },
  { code: 'EST', rank: 2, year: 2024, score: 93 },
  { code: 'CAN', rank: 3, year: 2024, score: 87 },
  { code: 'CRI', rank: 4, year: 2024, score: 85 },
  { code: 'DEU', rank: 5, year: 2024, score: 84 },
  { code: 'GBR', rank: 6, year: 2024, score: 82 },
  { code: 'TWN', rank: 7, year: 2024, score: 79 },
  { code: 'AUS', rank: 8, year: 2024, score: 78 },
  { code: 'FRA', rank: 9, year: 2024, score: 77 },
  { code: 'USA', rank: 10, year: 2024, score: 76 },
  { code: 'JPN', rank: 11, year: 2024, score: 75 },
  { code: 'ITA', rank: 12, year: 2024, score: 74 },
  { code: 'ARG', rank: 13, year: 2024, score: 73 },
  { code: 'ZAF', rank: 14, year: 2024, score: 72 },
  { code: 'KOR', rank: 15, year: 2024, score: 71 },
  { code: 'PHL', rank: 16, year: 2024, score: 68 },
  { code: 'COL', rank: 17, year: 2024, score: 67 },
  { code: 'BRA', rank: 18, year: 2024, score: 66 },
  { code: 'MEX', rank: 19, year: 2024, score: 64 },
  { code: 'NGA', rank: 20, year: 2024, score: 62 },
  { code: 'KEN', rank: 21, year: 2024, score: 60 },
  { code: 'IDN', rank: 22, year: 2024, score: 58 },
  { code: 'MYS', rank: 23, year: 2024, score: 56 },
  { code: 'UKR', rank: 24, year: 2024, score: 55 },
  { code: 'BGD', rank: 25, year: 2024, score: 53 },
  { code: 'IND', rank: 26, year: 2024, score: 50 },
  { code: 'TUR', rank: 27, year: 2024, score: 48 },
  { code: 'THA', rank: 28, year: 2024, score: 46 },
  { code: 'EGY', rank: 29, year: 2024, score: 42 },
  { code: 'VNM', rank: 30, year: 2024, score: 38 },
  { code: 'PAK', rank: 31, year: 2024, score: 35 },
  { code: 'RUS', rank: 32, year: 2024, score: 30 },
  { code: 'SAU', rank: 33, year: 2024, score: 28 },
  { code: 'IRN', rank: 34, year: 2024, score: 18 },
  { code: 'CHN', rank: 35, year: 2024, score: 9 },
  { code: 'MMR', rank: 36, year: 2024, score: 9 },
]

export const totalCountries = 70
