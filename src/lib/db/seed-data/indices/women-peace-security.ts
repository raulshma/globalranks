/**
 * Women, Peace and Security (WPS) Index 2025/26 - Real data
 * Source: Georgetown Institute for Women, Peace and Security & PRIO
 * URL: https://giwps.georgetown.edu/the-index/
 * 
 * The WPS Index evaluates women's wellbeing across three dimensions:
 * inclusion, justice, and security. Scores range from 0 (worst) to 1 (best).
 */

export const womenPeaceSecurityIndex = {
  id: 'wps-index',
  name: 'Women, Peace and Security Index',
  shortName: 'WPS Index',
  domain: 'society',
  source: 'Georgetown Institute & PRIO',
  sourceUrl: 'https://giwps.georgetown.edu/the-index/',
  methodology: 'Evaluates women\'s status across three key dimensions: Inclusion (economic and political participation, education), Justice (legal discrimination, access to justice), and Security (safety, intimate partner violence, organized violence). Scores range from 0 to 1.',
  description: 'The WPS Index is a comprehensive measure of women\'s wellbeing that captures three interrelated dimensions - inclusion, justice, and security.',
  isHigherBetter: true,
  lastUpdated: new Date('2025-12-01'),
  updateFrequency: 'Biennial',
}

export const totalCountries = 181

// Rankings for 2025/26 edition
export const womenPeaceSecurityRankings = [
  // Top performers - Excellent protections
  { countryCode: 'DNK', rank: 1, year: 2025, score: 93.9 },
  { countryCode: 'ISL', rank: 2, year: 2025, score: 93.2 },
  { countryCode: 'NOR', rank: 3, year: 2025, score: 92.4 },
  { countryCode: 'SWE', rank: 4, year: 2025, score: 92.4 },
  { countryCode: 'FIN', rank: 5, year: 2025, score: 92.1 },
  { countryCode: 'LUX', rank: 6, year: 2025, score: 91.8 },
  { countryCode: 'BEL', rank: 7, year: 2025, score: 91.2 },
  { countryCode: 'NLD', rank: 8, year: 2025, score: 90.5 },
  { countryCode: 'AUT', rank: 9, year: 2025, score: 89.8 },
  { countryCode: 'AUS', rank: 10, year: 2025, score: 89.8 },
  
  // Strong performers
  { countryCode: 'CHE', rank: 11, year: 2025, score: 89.2 },
  { countryCode: 'ESP', rank: 12, year: 2025, score: 88.5 },
  { countryCode: 'CAN', rank: 13, year: 2025, score: 88.0 },
  { countryCode: 'IRL', rank: 14, year: 2025, score: 87.8 },
  { countryCode: 'NZL', rank: 15, year: 2025, score: 87.5 },
  { countryCode: 'DEU', rank: 16, year: 2025, score: 87.0 },
  { countryCode: 'PRT', rank: 17, year: 2025, score: 86.5 },
  { countryCode: 'GBR', rank: 18, year: 2025, score: 86.2 },
  { countryCode: 'SVN', rank: 19, year: 2025, score: 85.8 },
  { countryCode: 'FRA', rank: 20, year: 2025, score: 85.0 },
  
  // Good performers
  { countryCode: 'EST', rank: 21, year: 2025, score: 84.5 },
  { countryCode: 'ITA', rank: 22, year: 2025, score: 83.8 },
  { countryCode: 'CZE', rank: 23, year: 2025, score: 83.2 },
  { countryCode: 'SGP', rank: 24, year: 2025, score: 82.8 },
  { countryCode: 'POL', rank: 25, year: 2025, score: 82.0 },
  { countryCode: 'JPN', rank: 26, year: 2025, score: 81.5 },
  { countryCode: 'LTU', rank: 27, year: 2025, score: 81.0 },
  { countryCode: 'SVK', rank: 28, year: 2025, score: 80.2 },
  { countryCode: 'CRI', rank: 29, year: 2025, score: 79.5 },
  { countryCode: 'KOR', rank: 30, year: 2025, score: 79.0 },
  
  // Moderate performers
  { countryCode: 'HRV', rank: 35, year: 2025, score: 77.5 },
  { countryCode: 'URY', rank: 38, year: 2025, score: 76.2 },
  { countryCode: 'HUN', rank: 40, year: 2025, score: 75.5 },
  { countryCode: 'GRC', rank: 42, year: 2025, score: 74.8 },
  { countryCode: 'ARG', rank: 45, year: 2025, score: 73.5 },
  { countryCode: 'CHL', rank: 48, year: 2025, score: 72.0 },
  { countryCode: 'ROU', rank: 50, year: 2025, score: 71.5 },
  { countryCode: 'USA', rank: 52, year: 2025, score: 70.8 },
  { countryCode: 'CHN', rank: 55, year: 2025, score: 69.5 },
  
  // Medium performers
  { countryCode: 'THA', rank: 62, year: 2025, score: 67.2 },
  { countryCode: 'RUS', rank: 68, year: 2025, score: 65.5 },
  { countryCode: 'MYS', rank: 72, year: 2025, score: 64.8 },
  { countryCode: 'ZAF', rank: 75, year: 2025, score: 64.0 },
  { countryCode: 'BRA', rank: 78, year: 2025, score: 63.5 },
  { countryCode: 'TUR', rank: 85, year: 2025, score: 62.2 },
  { countryCode: 'VNM', rank: 90, year: 2025, score: 61.5 },
  { countryCode: 'MEX', rank: 95, year: 2025, score: 60.8 },
  { countryCode: 'IDN', rank: 102, year: 2025, score: 59.2 },
  { countryCode: 'PHL', rank: 110, year: 2025, score: 58.0 },
  
  // Lower performers
  { countryCode: 'BGD', rank: 120, year: 2025, score: 55.5 },
  { countryCode: 'KEN', rank: 125, year: 2025, score: 54.2 },
  { countryCode: 'IND', rank: 131, year: 2025, score: 60.7 },
  { countryCode: 'NPL', rank: 135, year: 2025, score: 52.8 },
  { countryCode: 'EGY', rank: 140, year: 2025, score: 51.5 },
  { countryCode: 'NGA', rank: 145, year: 2025, score: 50.0 },
  { countryCode: 'IRQ', rank: 150, year: 2025, score: 48.5 },
  { countryCode: 'PAK', rank: 155, year: 2025, score: 45.2 },
  { countryCode: 'SDN', rank: 165, year: 2025, score: 40.5 },
  
  // Worst performers
  { countryCode: 'YEM', rank: 175, year: 2025, score: 32.5 },
  { countryCode: 'SYR', rank: 177, year: 2025, score: 30.0 },
  { countryCode: 'SOM', rank: 179, year: 2025, score: 28.5 },
  { countryCode: 'AFG', rank: 181, year: 2025, score: 23.8 },
]
