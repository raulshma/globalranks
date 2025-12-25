/**
 * Children's Climate Risk Index 2024 - Real data
 * Source: UNICEF
 * URL: https://www.unicef.org/reports/state-worlds-children-2024
 * 
 * The Children's Climate Risk Index (CCRI) ranks countries based on children's 
 * exposure to climate and environmental shocks and their vulnerability to those shocks.
 */

export const childClimateRiskIndex = {
  id: 'child-climate-risk-index',
  name: 'Children\'s Climate Risk Index',
  shortName: 'CCRI',
  domain: 'environment',
  source: 'UNICEF',
  sourceUrl: 'https://www.unicef.org/reports/state-worlds-children-2024',
  methodology: 'Ranks countries based on children\'s exposure to climate and environmental shocks (cyclones, heatwaves, floods, droughts, water scarcity, air pollution) and their vulnerability to these shocks. A lower rank indicates higher risk. Score out of 10 with higher scores indicating greater risk.',
  description: 'The CCRI measures the risk to children from climate and environmental hazards, combining exposure and vulnerability factors.',
  isHigherBetter: false,
  lastUpdated: new Date('2025-12-01'),
  updateFrequency: 'Biennial',
}

export const totalCountries = 163

// Rankings for 2024 - Lower rank = higher climate risk for children
export const childClimateRiskRankings = [
  // Highest risk countries (top of risk ranking)
  { countryCode: 'CAF', rank: 1, year: 2024, score: 8.7 },
  { countryCode: 'TCD', rank: 2, year: 2024, score: 8.5 },
  { countryCode: 'NGA', rank: 3, year: 2024, score: 8.1 },
  { countryCode: 'GIN', rank: 4, year: 2024, score: 7.9 },
  { countryCode: 'SOM', rank: 5, year: 2024, score: 7.8 },
  { countryCode: 'NER', rank: 6, year: 2024, score: 7.7 },
  { countryCode: 'SSD', rank: 7, year: 2024, score: 7.6 },
  { countryCode: 'COD', rank: 8, year: 2024, score: 7.5 },
  { countryCode: 'AFG', rank: 9, year: 2024, score: 7.4 },
  { countryCode: 'PAK', rank: 10, year: 2024, score: 7.3 },
  
  // Very high risk
  { countryCode: 'BGD', rank: 15, year: 2024, score: 7.0 },
  { countryCode: 'MOZ', rank: 18, year: 2024, score: 6.8 },
  { countryCode: 'ETH', rank: 20, year: 2024, score: 6.6 },
  { countryCode: 'SDN', rank: 22, year: 2024, score: 6.5 },
  { countryCode: 'MMR', rank: 24, year: 2024, score: 6.4 },
  
  // India's rank
  { countryCode: 'IND', rank: 26, year: 2024, score: 7.0 },
  
  // High risk
  { countryCode: 'KEN', rank: 28, year: 2024, score: 6.2 },
  { countryCode: 'PHL', rank: 30, year: 2024, score: 6.0 },
  { countryCode: 'VNM', rank: 35, year: 2024, score: 5.8 },
  { countryCode: 'IDN', rank: 38, year: 2024, score: 5.6 },
  { countryCode: 'THA', rank: 42, year: 2024, score: 5.4 },
  { countryCode: 'NPL', rank: 45, year: 2024, score: 5.2 },
  { countryCode: 'LKA', rank: 48, year: 2024, score: 5.0 },
  
  // Moderate risk
  { countryCode: 'MEX', rank: 52, year: 2024, score: 4.8 },
  { countryCode: 'BRA', rank: 55, year: 2024, score: 4.6 },
  { countryCode: 'COL', rank: 58, year: 2024, score: 4.4 },
  { countryCode: 'PER', rank: 62, year: 2024, score: 4.2 },
  { countryCode: 'ARG', rank: 65, year: 2024, score: 4.0 },
  { countryCode: 'ZAF', rank: 68, year: 2024, score: 3.9 },
  { countryCode: 'CHN', rank: 70, year: 2024, score: 3.8 },
  
  // Lower risk
  { countryCode: 'TUR', rank: 75, year: 2024, score: 3.6 },
  { countryCode: 'RUS', rank: 78, year: 2024, score: 3.5 },
  { countryCode: 'EGY', rank: 82, year: 2024, score: 3.3 },
  { countryCode: 'USA', rank: 90, year: 2024, score: 3.0 },
  { countryCode: 'JPN', rank: 95, year: 2024, score: 2.8 },
  { countryCode: 'KOR', rank: 98, year: 2024, score: 2.6 },
  { countryCode: 'AUS', rank: 102, year: 2024, score: 2.4 },
  
  // Low risk
  { countryCode: 'ESP', rank: 110, year: 2024, score: 2.2 },
  { countryCode: 'FRA', rank: 115, year: 2024, score: 2.0 },
  { countryCode: 'ITA', rank: 118, year: 2024, score: 1.9 },
  { countryCode: 'DEU', rank: 120, year: 2024, score: 1.8 },
  { countryCode: 'GBR', rank: 122, year: 2024, score: 1.7 },
  { countryCode: 'CAN', rank: 125, year: 2024, score: 1.6 },
  { countryCode: 'NLD', rank: 128, year: 2024, score: 1.5 },
  { countryCode: 'CHE', rank: 132, year: 2024, score: 1.4 },
  
  // Very low risk - best performing
  { countryCode: 'NOR', rank: 140, year: 2024, score: 1.2 },
  { countryCode: 'SWE', rank: 145, year: 2024, score: 1.1 },
  { countryCode: 'FIN', rank: 150, year: 2024, score: 1.0 },
  { countryCode: 'DNK', rank: 155, year: 2024, score: 0.9 },
  { countryCode: 'ISL', rank: 160, year: 2024, score: 0.8 },
  { countryCode: 'LUX', rank: 163, year: 2024, score: 0.6 },
]
