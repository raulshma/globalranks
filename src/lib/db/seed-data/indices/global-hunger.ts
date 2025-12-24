/**
 * Global Hunger Index Data
 * Source: Welthungerhilfe & Concern Worldwide - 2024
 * https://www.globalhungerindex.org/
 * Lower score = less hunger. Categories: Low (<10), Moderate (10-19.9), Serious (20-34.9), Alarming (35-49.9), Extremely Alarming (≥50)
 */

export const globalHungerIndex = {
  id: 'ri-ghi',
  name: 'Global Hunger Index',
  shortName: 'GHI',
  domainId: 'd-social',
  source: 'Welthungerhilfe & Concern Worldwide',
  sourceUrl: 'https://www.globalhungerindex.org/',
  methodology: 'Composite index measuring hunger based on undernourishment, child stunting, child wasting, and child mortality.',
  updateFrequency: 'annual',
  scoreMin: 0,
  scoreMax: 100,
  higherIsBetter: false,
  lastUpdated: new Date('2024-10-10'),
}

export const globalHungerRankings = [
  // Top performers (tied for rank 1 - GHI score <5)
  { code: 'CHN', rank: 1, year: 2024, score: 5.0 },
  { code: 'ARE', rank: 1, year: 2024, score: 5.0 },
  { code: 'KWT', rank: 1, year: 2024, score: 5.0 },
  { code: 'TUR', rank: 23, year: 2024, score: 5.3 },
  { code: 'BRA', rank: 24, year: 2024, score: 5.5 },
  { code: 'RUS', rank: 25, year: 2024, score: 5.6 },
  { code: 'MEX', rank: 30, year: 2024, score: 6.5 },
  { code: 'ARG', rank: 31, year: 2024, score: 6.7 },
  { code: 'CHL', rank: 26, year: 2024, score: 5.7 },
  { code: 'URY', rank: 27, year: 2024, score: 5.8 },
  // European and developed nations
  { code: 'CRI', rank: 28, year: 2024, score: 6.0 },
  { code: 'MYS', rank: 38, year: 2024, score: 8.4 },
  { code: 'COL', rank: 48, year: 2024, score: 10.1 },
  { code: 'THA', rank: 33, year: 2024, score: 7.0 },
  { code: 'PER', rank: 45, year: 2024, score: 9.3 },
  { code: 'VNM', rank: 51, year: 2024, score: 11.3 },
  { code: 'ZAF', rank: 52, year: 2024, score: 12.3 },
  { code: 'PHL', rank: 62, year: 2024, score: 14.4 },
  { code: 'IDN', rank: 63, year: 2024, score: 15.4 },
  // South Asian countries - Focus region
  { code: 'LKA', rank: 56, year: 2024, score: 13.3 },
  { code: 'NPL', rank: 68, year: 2024, score: 17.1 },
  { code: 'BGD', rank: 84, year: 2024, score: 23.0 },
  { code: 'IND', rank: 105, year: 2024, score: 27.3 },
  { code: 'PAK', rank: 109, year: 2024, score: 29.0 },
  // African nations
  { code: 'GHA', rank: 71, year: 2024, score: 17.8 },
  { code: 'KEN', rank: 88, year: 2024, score: 24.2 },
  { code: 'SEN', rank: 76, year: 2024, score: 19.5 },
  { code: 'RWA', rank: 94, year: 2024, score: 25.4 },
  { code: 'NGA', rank: 97, year: 2024, score: 25.9 },
  { code: 'UGA', rank: 98, year: 2024, score: 26.0 },
  { code: 'TZA', rank: 93, year: 2024, score: 25.1 },
  { code: 'ETH', rank: 108, year: 2024, score: 28.8 },
  { code: 'MOZ', rank: 116, year: 2024, score: 32.5 },
  { code: 'ZWE', rank: 112, year: 2024, score: 30.5 },
  { code: 'AFG', rank: 113, year: 2024, score: 31.2 },
  { code: 'SDN', rank: 117, year: 2024, score: 34.6 },
  // Bottom countries - Alarming levels
  { code: 'MDG', rank: 118, year: 2024, score: 36.4 },
  { code: 'YEM', rank: 125, year: 2024, score: 47.6 },
  { code: 'COD', rank: 120, year: 2024, score: 40.1 },
]

export const totalCountries = 127
