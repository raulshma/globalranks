/**
 * Global Remittances Inflow Index Data
 * Source: World Bank - 2024
 * https://www.worldbank.org/en/topic/migrationremittancesdiasporaissues
 */

export const remittancesIndex = {
  id: 'ri-remittances',
  name: 'Global Remittances Inflow',
  shortName: 'Remittances',
  domainId: 'd-economy',
  source: 'World Bank',
  sourceUrl: 'https://www.worldbank.org/en/topic/migrationremittancesdiasporaissues',
  methodology: 'Measures total remittance inflows received by countries from their diaspora abroad. Higher values indicate larger remittance receipts in billions USD.',
  updateFrequency: 'annual',
  scoreMin: 0,
  scoreMax: 200,
  higherIsBetter: true,
  lastUpdated: new Date('2024-12-01'),
}

export const remittancesRankings = [
  { code: 'IND', rank: 1, year: 2024, score: 129.0 },
  { code: 'MEX', rank: 2, year: 2024, score: 68.2 },
  { code: 'CHN', rank: 3, year: 2024, score: 48.0 },
  { code: 'PHL', rank: 4, year: 2024, score: 40.0 },
  { code: 'PAK', rank: 5, year: 2024, score: 33.0 },
  { code: 'FRA', rank: 6, year: 2024, score: 30.0 },
  { code: 'BGD', rank: 7, year: 2024, score: 26.6 },
  { code: 'DEU', rank: 8, year: 2024, score: 23.0 },
  { code: 'EGY', rank: 9, year: 2024, score: 22.7 },
  { code: 'NGA', rank: 10, year: 2024, score: 21.0 },
  { code: 'VNM', rank: 11, year: 2024, score: 18.5 },
  { code: 'GTM', rank: 12, year: 2024, score: 18.2 },
  { code: 'UKR', rank: 13, year: 2024, score: 16.8 },
  { code: 'UZB', rank: 14, year: 2024, score: 16.7 },
  { code: 'IDN', rank: 15, year: 2024, score: 14.2 },
  { code: 'BEL', rank: 16, year: 2024, score: 13.4 },
  { code: 'DOM', rank: 17, year: 2024, score: 11.8 },
  { code: 'NPL', rank: 18, year: 2024, score: 11.5 },
  { code: 'HND', rank: 19, year: 2024, score: 10.2 },
  { code: 'SLV', rank: 20, year: 2024, score: 8.8 },
  { code: 'LKA', rank: 21, year: 2024, score: 7.5 },
  { code: 'MAR', rank: 22, year: 2024, score: 7.2 },
  { code: 'JOR', rank: 23, year: 2024, score: 6.8 },
  { code: 'THA', rank: 24, year: 2024, score: 6.5 },
  { code: 'KEN', rank: 25, year: 2024, score: 4.2 },
  { code: 'GHA', rank: 26, year: 2024, score: 4.0 },
  { code: 'SEN', rank: 27, year: 2024, score: 3.8 },
  { code: 'TUN', rank: 28, year: 2024, score: 3.5 },
  { code: 'ZWE', rank: 29, year: 2024, score: 2.8 },
  { code: 'ETH', rank: 30, year: 2024, score: 2.5 },
]

export const totalCountries = 195
