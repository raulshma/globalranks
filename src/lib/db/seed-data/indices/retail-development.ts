/**
 * Global Retail Development Index Data
 * Source: Kearney - GRDI 2023
 * https://www.kearney.com/global-retail-development-index
 */

export const retailDevelopmentIndex = {
  id: 'ri-grdi',
  name: 'Global Retail Development Index',
  shortName: 'GRDI',
  domainId: 'd-economy',
  source: 'Kearney',
  sourceUrl: 'https://www.kearney.com/global-retail-development-index',
  methodology: 'Ranks top 30 developing countries for retail investment based on market attractiveness, country risk, market saturation, and time pressure.',
  updateFrequency: 'annual',
  scoreMin: 0,
  scoreMax: 100,
  higherIsBetter: true,
  lastUpdated: new Date('2024-02-22'),
}

export const retailDevelopmentRankings = [
  { code: 'IND', rank: 1, year: 2023, score: 71.7 }, // India
  { code: 'CHN', rank: 2, year: 2023, score: 70.4 }, // China
  { code: 'MYS', rank: 3, year: 2023, score: 60.9 }, // Malaysia
  { code: 'TUR', rank: 4, year: 2023, score: 59.8 }, // Turkey
  { code: 'ARE', rank: 5, year: 2023, score: 59.4 }, // UAE
  { code: 'VNM', rank: 6, year: 2023, score: 56.1 }, // Vietnam
  { code: 'MAR', rank: 7, year: 2023, score: 56.1 }, // Morocco
  { code: 'IDN', rank: 8, year: 2023, score: 55.9 }, // Indonesia
  { code: 'PER', rank: 9, year: 2023, score: 54.0 }, // Peru
  { code: 'COL', rank: 10, year: 2023, score: 53.6 }, // Colombia
  { code: 'SAU', rank: 11, year: 2023, score: 53.6 }, // Saudi Arabia
  { code: 'LKA', rank: 12, year: 2023, score: 51.8 }, // Sri Lanka
  { code: 'DOM', rank: 13, year: 2023, score: 51.7 }, // Dominican Republic
  { code: 'DZA', rank: 14, year: 2023, score: 50.1 }, // Algeria
  { code: 'JOR', rank: 15, year: 2023, score: 49.0 }, // Jordan
  { code: 'KAZ', rank: 16, year: 2023, score: 48.4 }, // Kazakhstan
  { code: 'CIV', rank: 17, year: 2023, score: 48.4 }, // Côte d'Ivoire
  { code: 'PHL', rank: 18, year: 2023, score: 46.8 }, // Philippines
  { code: 'PRY', rank: 19, year: 2023, score: 45.7 }, // Paraguay
  { code: 'ROU', rank: 20, year: 2023, score: 45.6 }, // Romania
  { code: 'TZA', rank: 21, year: 2023, score: 45.4 }, // Tanzania
  { code: 'RUS', rank: 22, year: 2023, score: 43.2 }, // Russia
  { code: 'AZE', rank: 23, year: 2023, score: 42.9 }, // Azerbaijan
  { code: 'TUN', rank: 24, year: 2023, score: 42.7 }, // Tunisia
  { code: 'KEN', rank: 25, year: 2023, score: 41.3 }, // Kenya
  { code: 'ZAF', rank: 26, year: 2023, score: 40.2 }, // South Africa
  { code: 'NGA', rank: 27, year: 2023, score: 39.9 }, // Nigeria
  { code: 'BOL', rank: 28, year: 2023, score: 39.6 }, // Bolivia
  { code: 'BRA', rank: 29, year: 2023, score: 39.3 }, // Brazil
  { code: 'THA', rank: 30, year: 2023, score: 37.8 }, // Thailand
]

export const totalCountries = 30
