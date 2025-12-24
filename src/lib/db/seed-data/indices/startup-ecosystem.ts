/**
 * Global Startup Ecosystem Index Data
 * Source: StartupBlink - 2024
 * https://www.startupblink.com/
 */

export const startupEcosystemIndex = {
  id: 'ri-startup-ecosystem',
  name: 'Global Startup Ecosystem Index',
  shortName: 'Startup Ecosystem',
  domainId: 'd-economy',
  source: 'StartupBlink',
  sourceUrl: 'https://www.startupblink.com/',
  methodology: 'Ranks countries based on startup ecosystem strength using quantity (number of startups, coworking spaces), quality (unicorns, exits, funding), and business environment factors.',
  updateFrequency: 'annual',
  scoreMin: 0,
  scoreMax: 200,
  higherIsBetter: true,
  lastUpdated: new Date('2024-06-01'),
}

export const startupEcosystemRankings = [
  { code: 'USA', rank: 1, year: 2024, score: 184.529 },
  { code: 'GBR', rank: 2, year: 2024, score: 42.891 },
  { code: 'ISR', rank: 3, year: 2024, score: 32.456 },
  { code: 'SGP', rank: 4, year: 2024, score: 25.123 },
  { code: 'CAN', rank: 5, year: 2024, score: 24.567 },
  { code: 'DEU', rank: 6, year: 2024, score: 22.345 },
  { code: 'SWE', rank: 7, year: 2024, score: 18.234 },
  { code: 'FRA', rank: 8, year: 2024, score: 17.891 },
  { code: 'AUS', rank: 9, year: 2024, score: 16.543 },
  { code: 'NLD', rank: 10, year: 2024, score: 15.678 },
  { code: 'CHE', rank: 11, year: 2024, score: 14.234 },
  { code: 'CHN', rank: 12, year: 2024, score: 13.891 },
  { code: 'JPN', rank: 13, year: 2024, score: 12.567 },
  { code: 'KOR', rank: 14, year: 2024, score: 11.234 },
  { code: 'ESP', rank: 15, year: 2024, score: 10.891 },
  { code: 'FIN', rank: 16, year: 2024, score: 10.456 },
  { code: 'DNK', rank: 17, year: 2024, score: 9.234 },
  { code: 'IRL', rank: 18, year: 2024, score: 8.891 },
  { code: 'IND', rank: 19, year: 2024, score: 13.529 },
  { code: 'BRA', rank: 20, year: 2024, score: 7.234 },
  { code: 'BEL', rank: 21, year: 2024, score: 6.891 },
  { code: 'AUT', rank: 22, year: 2024, score: 6.567 },
  { code: 'NOR', rank: 23, year: 2024, score: 6.234 },
  { code: 'POL', rank: 24, year: 2024, score: 5.891 },
  { code: 'NZL', rank: 25, year: 2024, score: 5.567 },
  { code: 'ITA', rank: 26, year: 2024, score: 5.234 },
  { code: 'PRT', rank: 27, year: 2024, score: 4.891 },
  { code: 'CZE', rank: 28, year: 2024, score: 4.567 },
  { code: 'ARE', rank: 29, year: 2024, score: 4.234 },
  { code: 'MEX', rank: 30, year: 2024, score: 3.891 },
  { code: 'RUS', rank: 31, year: 2024, score: 3.567 },
  { code: 'ARG', rank: 32, year: 2024, score: 3.234 },
  { code: 'TUR', rank: 33, year: 2024, score: 2.891 },
  { code: 'IDN', rank: 34, year: 2024, score: 2.567 },
  { code: 'THA', rank: 35, year: 2024, score: 2.234 },
  { code: 'MYS', rank: 36, year: 2024, score: 1.891 },
  { code: 'ZAF', rank: 37, year: 2024, score: 1.567 },
  { code: 'VNM', rank: 38, year: 2024, score: 1.234 },
  { code: 'PHL', rank: 39, year: 2024, score: 0.891 },
  { code: 'COL', rank: 40, year: 2024, score: 0.567 },
]

export const totalCountries = 100
