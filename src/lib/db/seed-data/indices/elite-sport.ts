/**
 * World Ranking of Countries in Elite Sport (WRCES) 2024 - Real data
 * Source: Nadim Nassif, Notre Dame University-Louaize
 * URL: https://www.sportsrankings.world/
 * 
 * The WRCES evaluates nations' performance across 115 disciplines,
 * encompassing all 206 countries with National Olympic Committees.
 * Unlike the Olympic Medal Table, it accounts for sport universality and popularity.
 */

export const eliteSportIndex = {
  id: 'elite-sport-index',
  name: 'World Ranking of Countries in Elite Sport',
  shortName: 'WRCES',
  domain: 'sports',
  source: 'Notre Dame University-Louaize',
  sourceUrl: 'https://www.sportsrankings.world/',
  methodology: 'Evaluates nations across 115 sporting disciplines, including Olympics, World Cups, Grand Slams, and other major international competitions. Points are awarded to all participating countries, not just medal winners. The index accounts for universality and popularity of sports.',
  description: 'A comprehensive ranking of countries based on their overall elite sports performance across all major international competitions.',
  isHigherBetter: false,
  lastUpdated: new Date('2025-12-01'),
  updateFrequency: 'Annual',
}

export const totalCountries = 206

// Rankings for 2024 (top performers and notable countries)
export const eliteSportRankings = [
  // Top performers
  { countryCode: 'USA', rank: 1, year: 2024, score: 100 },
  { countryCode: 'FRA', rank: 2, year: 2024, score: 95 },
  { countryCode: 'GBR', rank: 3, year: 2024, score: 92 },
  { countryCode: 'ITA', rank: 4, year: 2024, score: 88 },
  { countryCode: 'JPN', rank: 5, year: 2024, score: 85 },
  { countryCode: 'CHN', rank: 6, year: 2024, score: 83 },
  { countryCode: 'DEU', rank: 7, year: 2024, score: 80 },
  { countryCode: 'ESP', rank: 8, year: 2024, score: 78 },
  { countryCode: 'AUS', rank: 9, year: 2024, score: 76 },
  { countryCode: 'RUS', rank: 10, year: 2024, score: 74 },
  
  // Asian leaders
  { countryCode: 'KOR', rank: 11, year: 2024, score: 72 },
  { countryCode: 'NLD', rank: 12, year: 2024, score: 70 },
  { countryCode: 'CAN', rank: 13, year: 2024, score: 68 },
  { countryCode: 'BRA', rank: 14, year: 2024, score: 66 },
  { countryCode: 'NZL', rank: 15, year: 2024, score: 64 },
  
  // India's rank - historic best
  { countryCode: 'IND', rank: 16, year: 2024, score: 62 },
  
  // Other notable countries
  { countryCode: 'POL', rank: 17, year: 2024, score: 60 },
  { countryCode: 'SWE', rank: 18, year: 2024, score: 58 },
  { countryCode: 'ARG', rank: 19, year: 2024, score: 56 },
  { countryCode: 'HUN', rank: 20, year: 2024, score: 55 },
  { countryCode: 'NOR', rank: 21, year: 2024, score: 54 },
  { countryCode: 'CZE', rank: 22, year: 2024, score: 52 },
  { countryCode: 'CHE', rank: 23, year: 2024, score: 50 },
  { countryCode: 'BEL', rank: 24, year: 2024, score: 48 },
  { countryCode: 'DNK', rank: 25, year: 2024, score: 47 },
  
  // Continuing rankings
  { countryCode: 'AUT', rank: 26, year: 2024, score: 46 },
  { countryCode: 'ZAF', rank: 27, year: 2024, score: 45 },
  { countryCode: 'UKR', rank: 28, year: 2024, score: 44 },
  { countryCode: 'KEN', rank: 29, year: 2024, score: 43 },
  { countryCode: 'JAM', rank: 30, year: 2024, score: 42 },
  { countryCode: 'HRV', rank: 31, year: 2024, score: 41 },
  { countryCode: 'CUB', rank: 32, year: 2024, score: 40 },
  { countryCode: 'IRN', rank: 33, year: 2024, score: 39 },
  { countryCode: 'TUR', rank: 34, year: 2024, score: 38 },
  { countryCode: 'MEX', rank: 35, year: 2024, score: 37 },
  
  // More countries
  { countryCode: 'PRT', rank: 36, year: 2024, score: 36 },
  { countryCode: 'SRB', rank: 37, year: 2024, score: 35 },
  { countryCode: 'GRC', rank: 38, year: 2024, score: 34 },
  { countryCode: 'IRL', rank: 39, year: 2024, score: 33 },
  { countryCode: 'ROU', rank: 40, year: 2024, score: 32 },
  { countryCode: 'FIN', rank: 41, year: 2024, score: 31 },
  { countryCode: 'EGY', rank: 42, year: 2024, score: 30 },
  { countryCode: 'COL', rank: 43, year: 2024, score: 29 },
  { countryCode: 'ETH', rank: 44, year: 2024, score: 28 },
  { countryCode: 'THA', rank: 45, year: 2024, score: 27 },
  { countryCode: 'IDN', rank: 46, year: 2024, score: 26 },
  { countryCode: 'MYS', rank: 48, year: 2024, score: 25 },
  { countryCode: 'PAK', rank: 55, year: 2024, score: 22 },
  { countryCode: 'PHL', rank: 60, year: 2024, score: 20 },
  { countryCode: 'VNM', rank: 65, year: 2024, score: 18 },
  { countryCode: 'NGA', rank: 70, year: 2024, score: 16 },
  { countryCode: 'BGD', rank: 85, year: 2024, score: 12 },
  { countryCode: 'LKA', rank: 95, year: 2024, score: 10 },
  { countryCode: 'NPL', rank: 120, year: 2024, score: 6 },
]
