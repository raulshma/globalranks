/**
 * Global Entrepreneurship Index Data
 * Source: Global Entrepreneurship and Development Institute (GEDI) 2023
 * https://thegedi.org/global-entrepreneurship-and-development-index/
 */

export const entrepreneurshipIndex = {
  id: 'ri-gei',
  name: 'Global Entrepreneurship Index',
  shortName: 'GEI',
  domainId: 'd-economy',
  source: 'Global Entrepreneurship and Development Institute (GEDI)',
  sourceUrl: 'https://thegedi.org/global-entrepreneurship-and-development-index/',
  methodology: 'Measures the health of entrepreneurship ecosystems across 137 countries based on entrepreneurial attitudes, abilities, and aspirations.',
  updateFrequency: 'annual',
  scoreMin: 0,
  scoreMax: 100,
  higherIsBetter: true,
  lastUpdated: new Date('2023-12-01'),
}

export const entrepreneurshipRankings = [
  { code: 'USA', rank: 1, year: 2023, score: 83.6 }, // United States
  { code: 'CHE', rank: 2, year: 2023, score: 80.4 }, // Switzerland
  { code: 'CAN', rank: 3, year: 2023, score: 79.2 }, // Canada
  { code: 'GBR', rank: 4, year: 2023, score: 77.8 }, // United Kingdom
  { code: 'AUS', rank: 5, year: 2023, score: 75.5 }, // Australia
  { code: 'DNK', rank: 6, year: 2023, score: 74.3 }, // Denmark
  { code: 'ISL', rank: 7, year: 2023, score: 74.2 }, // Iceland
  { code: 'IRL', rank: 8, year: 2023, score: 73.7 }, // Ireland
  { code: 'SWE', rank: 9, year: 2023, score: 73.1 }, // Sweden
  { code: 'FRA', rank: 10, year: 2023, score: 68.5 }, // France
  { code: 'NLD', rank: 11, year: 2023, score: 68.1 }, // Netherlands
  { code: 'FIN', rank: 12, year: 2023, score: 67.9 }, // Finland
  { code: 'DEU', rank: 13, year: 2023, score: 66.4 }, // Germany
  { code: 'AUT', rank: 14, year: 2023, score: 66.0 }, // Austria
  { code: 'ISR', rank: 15, year: 2023, score: 65.4 }, // Israel
  { code: 'BEL', rank: 16, year: 2023, score: 63.7 }, // Belgium
  { code: 'NOR', rank: 17, year: 2023, score: 63.4 }, // Norway
  { code: 'SGP', rank: 18, year: 2023, score: 62.7 }, // Singapore
  { code: 'KOR', rank: 19, year: 2023, score: 55.0 }, // South Korea
  { code: 'JPN', rank: 20, year: 2023, score: 51.5 }, // Japan
  { code: 'ARE', rank: 21, year: 2023, score: 50.8 }, // UAE
  { code: 'EST', rank: 22, year: 2023, score: 50.5 }, // Estonia
  { code: 'CHL', rank: 23, year: 2023, score: 48.2 }, // Chile
  { code: 'POL', rank: 24, year: 2023, score: 46.5 }, // Poland
  { code: 'CHN', rank: 25, year: 2023, score: 45.3 }, // China
  { code: 'MYS', rank: 30, year: 2023, score: 40.5 }, // Malaysia
  { code: 'SAU', rank: 35, year: 2023, score: 37.2 }, // Saudi Arabia
  { code: 'TUR', rank: 40, year: 2023, score: 34.8 }, // Turkey
  { code: 'MEX', rank: 45, year: 2023, score: 32.5 }, // Mexico
  { code: 'THA', rank: 50, year: 2023, score: 30.2 }, // Thailand
  { code: 'BRA', rank: 55, year: 2023, score: 28.5 }, // Brazil
  { code: 'COL', rank: 60, year: 2023, score: 26.8 }, // Colombia
  { code: 'IND', rank: 68, year: 2023, score: 25.5 }, // India
  { code: 'ZAF', rank: 70, year: 2023, score: 24.8 }, // South Africa
  { code: 'IDN', rank: 75, year: 2023, score: 23.5 }, // Indonesia
  { code: 'PHL', rank: 80, year: 2023, score: 22.2 }, // Philippines
  { code: 'VNM', rank: 85, year: 2023, score: 21.0 }, // Vietnam
  { code: 'EGY', rank: 90, year: 2023, score: 19.8 }, // Egypt
  { code: 'NGA', rank: 95, year: 2023, score: 18.5 }, // Nigeria
  { code: 'PAK', rank: 100, year: 2023, score: 17.2 }, // Pakistan
  { code: 'BGD', rank: 105, year: 2023, score: 16.0 }, // Bangladesh
]

export const totalCountries = 137
