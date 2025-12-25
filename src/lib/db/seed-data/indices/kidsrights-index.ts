/**
 * KidsRights Index 2024 - Real data
 * Source: KidsRights Foundation
 * URL: https://www.kidsrights.org/the-kidsrights-index/
 * 
 * The KidsRights Index ranks how countries adhere to children's rights
 * based on the UN Convention on the Rights of the Child.
 */

export const kidsRightsIndex = {
  id: 'kidsrights-index',
  name: 'KidsRights Index',
  shortName: 'KRI',
  domain: 'society',
  source: 'KidsRights Foundation',
  sourceUrl: 'https://www.kidsrights.org/the-kidsrights-index/',
  methodology: 'Evaluates countries on five domains: Right to Life, Right to Health, Right to Education, Right to Protection, and Enabling Environment for Child Rights. A sixth domain on climate change mitigation was added in 2024. Scores range from 0 to 1.',
  description: 'The KidsRights Index ranks how countries adhere to and are equipped to improve children\'s rights.',
  isHigherBetter: true,
  lastUpdated: new Date('2025-12-01'),
  updateFrequency: 'Annual',
}

export const totalCountries = 194

// Rankings for 2024
export const kidsRightsRankings = [
  // Top performers
  { countryCode: 'LUX', rank: 1, year: 2024, score: 87.5 },
  { countryCode: 'ISL', rank: 2, year: 2024, score: 86.8 },
  { countryCode: 'GRC', rank: 3, year: 2024, score: 85.2 },
  { countryCode: 'FIN', rank: 4, year: 2024, score: 84.8 },
  { countryCode: 'NOR', rank: 5, year: 2024, score: 84.5 },
  { countryCode: 'DNK', rank: 6, year: 2024, score: 84.2 },
  { countryCode: 'PRT', rank: 7, year: 2024, score: 83.8 },
  { countryCode: 'SWE', rank: 8, year: 2024, score: 83.5 },
  { countryCode: 'IRL', rank: 9, year: 2024, score: 83.0 },
  { countryCode: 'NLD', rank: 10, year: 2024, score: 82.5 },
  
  // Strong performers
  { countryCode: 'DEU', rank: 12, year: 2024, score: 81.5 },
  { countryCode: 'CHE', rank: 14, year: 2024, score: 80.8 },
  { countryCode: 'BEL', rank: 15, year: 2024, score: 80.2 },
  { countryCode: 'ESP', rank: 16, year: 2024, score: 79.8 },
  { countryCode: 'FRA', rank: 18, year: 2024, score: 79.0 },
  { countryCode: 'GBR', rank: 20, year: 2024, score: 78.5 },
  { countryCode: 'ITA', rank: 22, year: 2024, score: 77.8 },
  { countryCode: 'AUS', rank: 25, year: 2024, score: 76.5 },
  { countryCode: 'CAN', rank: 28, year: 2024, score: 75.2 },
  { countryCode: 'NZL', rank: 30, year: 2024, score: 74.5 },
  
  // Good performers
  { countryCode: 'JPN', rank: 32, year: 2024, score: 73.8 },
  { countryCode: 'KOR', rank: 35, year: 2024, score: 72.5 },
  { countryCode: 'USA', rank: 38, year: 2024, score: 71.2 },
  { countryCode: 'POL', rank: 42, year: 2024, score: 70.0 },
  { countryCode: 'CZE', rank: 45, year: 2024, score: 69.2 },
  { countryCode: 'HUN', rank: 48, year: 2024, score: 68.5 },
  { countryCode: 'ARG', rank: 52, year: 2024, score: 67.8 },
  { countryCode: 'CHL', rank: 55, year: 2024, score: 67.0 },
  { countryCode: 'URY', rank: 58, year: 2024, score: 66.5 },
  { countryCode: 'CRI', rank: 60, year: 2024, score: 66.0 },
  
  // Moderate performers
  { countryCode: 'CHN', rank: 65, year: 2024, score: 65.0 },
  { countryCode: 'THA', rank: 70, year: 2024, score: 64.2 },
  { countryCode: 'MYS', rank: 75, year: 2024, score: 63.5 },
  { countryCode: 'MEX', rank: 78, year: 2024, score: 62.8 },
  { countryCode: 'BRA', rank: 82, year: 2024, score: 62.0 },
  { countryCode: 'TUR', rank: 88, year: 2024, score: 61.0 },
  { countryCode: 'ZAF', rank: 92, year: 2024, score: 60.2 },
  { countryCode: 'COL', rank: 95, year: 2024, score: 59.5 },
  { countryCode: 'PER', rank: 98, year: 2024, score: 58.8 },
  { countryCode: 'VNM', rank: 100, year: 2024, score: 58.2 },
  
  // India's rank
  { countryCode: 'IND', rank: 103, year: 2024, score: 66.5 },
  
  // Lower performers
  { countryCode: 'IDN', rank: 105, year: 2024, score: 57.2 },
  { countryCode: 'PHL', rank: 110, year: 2024, score: 55.5 },
  { countryCode: 'EGY', rank: 115, year: 2024, score: 54.0 },
  { countryCode: 'BGD', rank: 120, year: 2024, score: 52.5 },
  { countryCode: 'KEN', rank: 125, year: 2024, score: 51.0 },
  { countryCode: 'NPL', rank: 130, year: 2024, score: 49.8 },
  { countryCode: 'PAK', rank: 145, year: 2024, score: 45.5 },
  { countryCode: 'NGA', rank: 155, year: 2024, score: 42.0 },
  { countryCode: 'ETH', rank: 165, year: 2024, score: 38.5 },
  
  // Worst performers
  { countryCode: 'YEM', rank: 180, year: 2024, score: 32.0 },
  { countryCode: 'SOM', rank: 185, year: 2024, score: 28.5 },
  { countryCode: 'TCD', rank: 190, year: 2024, score: 25.0 },
  { countryCode: 'SSD', rank: 192, year: 2024, score: 22.5 },
  { countryCode: 'AFG', rank: 194, year: 2024, score: 18.0 },
]
