/**
 * Global Financial Centres Index Data
 * Source: Z/Yen Partners & China Development Institute - GFCI 36 (September 2024)
 * https://www.longfinance.net/programmes/financial-centre-futures/global-financial-centres-index/
 */

export const financialCentresIndex = {
  id: 'ri-gfci',
  name: 'Global Financial Centres Index',
  shortName: 'GFCI',
  domainId: 'd-economy',
  source: 'Z/Yen Partners & China Development Institute',
  sourceUrl: 'https://www.longfinance.net/programmes/financial-centre-futures/global-financial-centres-index/',
  methodology: 'Ranks competitiveness of financial centres based on 143 instrumental factors from World Bank, OECD, UN, and 37,830 assessments from financial professionals.',
  updateFrequency: 'biannual',
  scoreMin: 0,
  scoreMax: 1000,
  higherIsBetter: true,
  lastUpdated: new Date('2024-09-24'),
}

export const financialCentresRankings = [
  { code: 'USA', rank: 1, year: 2024, score: 764 }, // New York (best US city)
  { code: 'GBR', rank: 2, year: 2024, score: 751 }, // London
  { code: 'HKG', rank: 3, year: 2024, score: 741 }, // Hong Kong
  { code: 'SGP', rank: 4, year: 2024, score: 740 }, // Singapore
  { code: 'CHN', rank: 8, year: 2024, score: 723 }, // Shanghai (best China city)
  { code: 'DEU', rank: 10, year: 2024, score: 719 }, // Frankfurt
  { code: 'KOR', rank: 11, year: 2024, score: 718 }, // Seoul
  { code: 'JPN', rank: 13, year: 2024, score: 714 }, // Tokyo
  { code: 'CHE', rank: 14, year: 2024, score: 712 }, // Zurich
  { code: 'FRA', rank: 15, year: 2024, score: 710 }, // Paris
  { code: 'ARE', rank: 16, year: 2024, score: 708 }, // Dubai
  { code: 'NLD', rank: 17, year: 2024, score: 706 }, // Amsterdam
  { code: 'IRL', rank: 18, year: 2024, score: 704 }, // Dublin
  { code: 'LUX', rank: 20, year: 2024, score: 700 }, // Luxembourg
  { code: 'CAN', rank: 21, year: 2024, score: 698 }, // Toronto
  { code: 'AUS', rank: 23, year: 2024, score: 694 }, // Sydney
  { code: 'ISR', rank: 29, year: 2024, score: 682 }, // Tel Aviv
  { code: 'IND', rank: 46, year: 2024, score: 658 }, // GIFT City (best India city)
  { code: 'BRA', rank: 85, year: 2024, score: 612 }, // Sao Paulo
  { code: 'MEX', rank: 92, year: 2024, score: 602 }, // Mexico City
  { code: 'ZAF', rank: 95, year: 2024, score: 598 }, // Johannesburg
  { code: 'RUS', rank: 98, year: 2024, score: 594 }, // Moscow
  { code: 'NGA', rank: 102, year: 2024, score: 588 }, // Lagos
]

export const totalCountries = 121
