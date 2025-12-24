/**
 * Global Slavery Index Data
 * Source: Walk Free Foundation - 2023
 * https://www.walkfree.org/global-slavery-index/
 */

export const modernSlaveryIndex = {
  id: 'ri-slavery',
  name: 'Global Slavery Index',
  shortName: 'GSI',
  domainId: 'd-social',
  source: 'Walk Free Foundation',
  sourceUrl: 'https://www.walkfree.org/global-slavery-index/',
  methodology: 'Measures the estimated prevalence of modern slavery (forced labor, forced marriage, etc.) per 1,000 population. Based on 2021 estimates. Lower prevalence indicates less modern slavery. Countries ranked from highest to lowest prevalence.',
  updateFrequency: 'periodic',
  scoreMin: 0,
  scoreMax: 50,
  higherIsBetter: false,
  lastUpdated: new Date('2023-05-24'),
}

// 2023 Global Slavery Index rankings (by prevalence per 1,000 population - lower is better)
// Note: Rank 1 = highest prevalence (worst), higher ranks = lower prevalence (better)
export const modernSlaveryRankings = [
  // Highest prevalence (worst performing)
  { code: 'PRK', rank: 1, year: 2023, score: 104.6 }, // North Korea
  { code: 'ERI', rank: 2, year: 2023, score: 90.3 }, // Eritrea
  { code: 'MRT', rank: 3, year: 2023, score: 32.0 }, // Mauritania
  { code: 'SAU', rank: 4, year: 2023, score: 21.3 }, // Saudi Arabia
  { code: 'TUR', rank: 5, year: 2023, score: 15.6 }, // Turkey
  { code: 'TJK', rank: 6, year: 2023, score: 14.0 }, // Tajikistan
  { code: 'ARE', rank: 7, year: 2023, score: 13.5 }, // UAE
  { code: 'RUS', rank: 8, year: 2023, score: 13.0 }, // Russia
  { code: 'AFG', rank: 9, year: 2023, score: 12.2 }, // Afghanistan
  { code: 'KWT', rank: 10, year: 2023, score: 11.8 }, // Kuwait
  // 11-40
  { code: 'BLR', rank: 11, year: 2023, score: 10.5 },
  { code: 'MMR', rank: 12, year: 2023, score: 10.2 }, // Myanmar
  { code: 'QAT', rank: 13, year: 2023, score: 9.8 },
  { code: 'IRQ', rank: 14, year: 2023, score: 9.5 },
  { code: 'OMN', rank: 15, year: 2023, score: 9.2 },
  { code: 'SYR', rank: 16, year: 2023, score: 8.9 },
  { code: 'YEM', rank: 17, year: 2023, score: 8.6 },
  { code: 'BHR', rank: 18, year: 2023, score: 8.4 },
  { code: 'TKM', rank: 19, year: 2023, score: 8.2 },
  { code: 'UZB', rank: 20, year: 2023, score: 8.1 },
  { code: 'LBY', rank: 21, year: 2023, score: 8.0 },
  { code: 'KAZ', rank: 22, year: 2023, score: 7.9 },
  { code: 'JOR', rank: 23, year: 2023, score: 7.8 },
  { code: 'CAF', rank: 24, year: 2023, score: 7.6 }, // Central African Republic
  { code: 'COD', rank: 25, year: 2023, score: 7.5 }, // Dem. Rep. Congo
  { code: 'LBN', rank: 26, year: 2023, score: 7.4 },
  { code: 'ZWE', rank: 27, year: 2023, score: 7.3 },
  { code: 'SDN', rank: 28, year: 2023, score: 7.2 },
  { code: 'VEN', rank: 29, year: 2023, score: 7.1 },
  { code: 'PRY', rank: 30, year: 2023, score: 7.0 },
  { code: 'PAK', rank: 31, year: 2023, score: 6.9 },
  { code: 'BGD', rank: 32, year: 2023, score: 6.8 },
  { code: 'NPL', rank: 33, year: 2023, score: 6.7 },
  { code: 'IND', rank: 34, year: 2023, score: 8.0 },
  { code: 'NGA', rank: 35, year: 2023, score: 6.5 },
  { code: 'MDA', rank: 36, year: 2023, score: 6.4 },
  { code: 'UKR', rank: 37, year: 2023, score: 6.3 },
  { code: 'PHL', rank: 38, year: 2023, score: 6.2 },
  { code: 'THA', rank: 39, year: 2023, score: 6.1 },
  { code: 'EGY', rank: 40, year: 2023, score: 6.0 },
  // 41-80
  { code: 'GTM', rank: 41, year: 2023, score: 5.9 },
  { code: 'HND', rank: 42, year: 2023, score: 5.8 },
  { code: 'NIC', rank: 43, year: 2023, score: 5.7 },
  { code: 'DOM', rank: 44, year: 2023, score: 5.6 },
  { code: 'PER', rank: 45, year: 2023, score: 5.5 },
  { code: 'COL', rank: 46, year: 2023, score: 5.4 },
  { code: 'BOL', rank: 47, year: 2023, score: 5.3 },
  { code: 'ECU', rank: 48, year: 2023, score: 5.2 },
  { code: 'MAR', rank: 49, year: 2023, score: 5.1 },
  { code: 'ZAF', rank: 50, year: 2023, score: 5.0 },
  { code: 'BRA', rank: 51, year: 2023, score: 5.0 },
  { code: 'MYS', rank: 52, year: 2023, score: 4.9 },
  { code: 'MEX', rank: 53, year: 2023, score: 4.8 },
  { code: 'ARG', rank: 54, year: 2023, score: 4.7 },
  { code: 'VNM', rank: 55, year: 2023, score: 4.6 },
  { code: 'IDN', rank: 62, year: 2023, score: 6.7 },
  { code: 'CHL', rank: 57, year: 2023, score: 4.4 },
  { code: 'URY', rank: 58, year: 2023, score: 4.3 },
  { code: 'CRI', rank: 59, year: 2023, score: 4.2 },
  { code: 'PAN', rank: 60, year: 2023, score: 4.1 },
  // 100-160 (Better performing countries - lower prevalence)
  { code: 'GRC', rank: 80, year: 2023, score: 3.6 },
  { code: 'ITA', rank: 85, year: 2023, score: 3.4 },
  { code: 'ESP', rank: 90, year: 2023, score: 3.2 },
  { code: 'PRT', rank: 95, year: 2023, score: 3.0 },
  { code: 'POL', rank: 100, year: 2023, score: 2.8 },
  { code: 'FRA', rank: 105, year: 2023, score: 2.6 },
  { code: 'CHN', rank: 111, year: 2023, score: 4.0 },
  { code: 'USA', rank: 130, year: 2023, score: 2.0 },
  { code: 'AUS', rank: 135, year: 2023, score: 1.8 },
  { code: 'GBR', rank: 140, year: 2023, score: 1.6 },
  { code: 'CAN', rank: 145, year: 2023, score: 1.4 },
  { code: 'DEU', rank: 148, year: 2023, score: 1.3 },
  { code: 'NZL', rank: 150, year: 2023, score: 1.2 },
  { code: 'JPN', rank: 152, year: 2023, score: 1.1 },
  { code: 'NOR', rank: 155, year: 2023, score: 1.0 },
  { code: 'CHE', rank: 158, year: 2023, score: 0.9 }, // Switzerland - best
]

export const totalCountries = 160
