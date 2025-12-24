/**
 * Seed script for India Global Rankings Intelligence Platform
 * Creates comprehensive ranking data with 50+ indices across all domains
 * Includes historical data from 2010-2025 for time-series testing
 */

import {
  countries,
  domains,
  milestones,
  peerGroups,
  rankingEntries,
  rankingIndices,
} from './schema'
import { db } from './index'

// ============================================================================
// COUNTRIES DATA - Comprehensive list of countries with ISO codes
// ============================================================================

const countriesData = [
  // South Asia
  { id: 'c-ind', code: 'IND', name: 'India', region: 'South Asia', incomeLevel: 'lower-middle' },
  { id: 'c-pak', code: 'PAK', name: 'Pakistan', region: 'South Asia', incomeLevel: 'lower-middle' },
  { id: 'c-bgd', code: 'BGD', name: 'Bangladesh', region: 'South Asia', incomeLevel: 'lower-middle' },
  { id: 'c-lka', code: 'LKA', name: 'Sri Lanka', region: 'South Asia', incomeLevel: 'lower-middle' },
  { id: 'c-npl', code: 'NPL', name: 'Nepal', region: 'South Asia', incomeLevel: 'lower-middle' },
  { id: 'c-btn', code: 'BTN', name: 'Bhutan', region: 'South Asia', incomeLevel: 'lower-middle' },
  { id: 'c-mdv', code: 'MDV', name: 'Maldives', region: 'South Asia', incomeLevel: 'upper-middle' },
  { id: 'c-afg', code: 'AFG', name: 'Afghanistan', region: 'South Asia', incomeLevel: 'low' },
  
  // East Asia
  { id: 'c-chn', code: 'CHN', name: 'China', region: 'East Asia', incomeLevel: 'upper-middle' },
  { id: 'c-jpn', code: 'JPN', name: 'Japan', region: 'East Asia', incomeLevel: 'high' },
  { id: 'c-kor', code: 'KOR', name: 'South Korea', region: 'East Asia', incomeLevel: 'high' },
  { id: 'c-twn', code: 'TWN', name: 'Taiwan', region: 'East Asia', incomeLevel: 'high' },
  { id: 'c-mng', code: 'MNG', name: 'Mongolia', region: 'East Asia', incomeLevel: 'lower-middle' },
  { id: 'c-prk', code: 'PRK', name: 'North Korea', region: 'East Asia', incomeLevel: 'low' },
  
  // Southeast Asia
  { id: 'c-idn', code: 'IDN', name: 'Indonesia', region: 'Southeast Asia', incomeLevel: 'upper-middle' },
  { id: 'c-tha', code: 'THA', name: 'Thailand', region: 'Southeast Asia', incomeLevel: 'upper-middle' },
  { id: 'c-vnm', code: 'VNM', name: 'Vietnam', region: 'Southeast Asia', incomeLevel: 'lower-middle' },
  { id: 'c-mys', code: 'MYS', name: 'Malaysia', region: 'Southeast Asia', incomeLevel: 'upper-middle' },
  { id: 'c-sgp', code: 'SGP', name: 'Singapore', region: 'Southeast Asia', incomeLevel: 'high' },
  { id: 'c-phl', code: 'PHL', name: 'Philippines', region: 'Southeast Asia', incomeLevel: 'lower-middle' },
  { id: 'c-mmr', code: 'MMR', name: 'Myanmar', region: 'Southeast Asia', incomeLevel: 'lower-middle' },
  { id: 'c-khm', code: 'KHM', name: 'Cambodia', region: 'Southeast Asia', incomeLevel: 'lower-middle' },
  { id: 'c-lao', code: 'LAO', name: 'Laos', region: 'Southeast Asia', incomeLevel: 'lower-middle' },
  { id: 'c-brn', code: 'BRN', name: 'Brunei', region: 'Southeast Asia', incomeLevel: 'high' },
  
  // Europe - Western
  { id: 'c-deu', code: 'DEU', name: 'Germany', region: 'Europe', incomeLevel: 'high' },
  { id: 'c-fra', code: 'FRA', name: 'France', region: 'Europe', incomeLevel: 'high' },
  { id: 'c-gbr', code: 'GBR', name: 'United Kingdom', region: 'Europe', incomeLevel: 'high' },
  { id: 'c-ita', code: 'ITA', name: 'Italy', region: 'Europe', incomeLevel: 'high' },
  { id: 'c-esp', code: 'ESP', name: 'Spain', region: 'Europe', incomeLevel: 'high' },
  { id: 'c-nld', code: 'NLD', name: 'Netherlands', region: 'Europe', incomeLevel: 'high' },
  { id: 'c-bel', code: 'BEL', name: 'Belgium', region: 'Europe', incomeLevel: 'high' },
  { id: 'c-che', code: 'CHE', name: 'Switzerland', region: 'Europe', incomeLevel: 'high' },
  { id: 'c-aut', code: 'AUT', name: 'Austria', region: 'Europe', incomeLevel: 'high' },
  { id: 'c-prt', code: 'PRT', name: 'Portugal', region: 'Europe', incomeLevel: 'high' },
  { id: 'c-irl', code: 'IRL', name: 'Ireland', region: 'Europe', incomeLevel: 'high' },
  { id: 'c-lux', code: 'LUX', name: 'Luxembourg', region: 'Europe', incomeLevel: 'high' },
  
  // Europe - Nordic
  { id: 'c-swe', code: 'SWE', name: 'Sweden', region: 'Europe', incomeLevel: 'high' },
  { id: 'c-nor', code: 'NOR', name: 'Norway', region: 'Europe', incomeLevel: 'high' },
  { id: 'c-dnk', code: 'DNK', name: 'Denmark', region: 'Europe', incomeLevel: 'high' },
  { id: 'c-fin', code: 'FIN', name: 'Finland', region: 'Europe', incomeLevel: 'high' },
  { id: 'c-isl', code: 'ISL', name: 'Iceland', region: 'Europe', incomeLevel: 'high' },
  
  // Europe - Eastern
  { id: 'c-rus', code: 'RUS', name: 'Russia', region: 'Europe', incomeLevel: 'upper-middle' },
  { id: 'c-pol', code: 'POL', name: 'Poland', region: 'Europe', incomeLevel: 'high' },
  { id: 'c-ukr', code: 'UKR', name: 'Ukraine', region: 'Europe', incomeLevel: 'lower-middle' },
  { id: 'c-cze', code: 'CZE', name: 'Czech Republic', region: 'Europe', incomeLevel: 'high' },
  { id: 'c-rou', code: 'ROU', name: 'Romania', region: 'Europe', incomeLevel: 'upper-middle' },
  { id: 'c-hun', code: 'HUN', name: 'Hungary', region: 'Europe', incomeLevel: 'high' },
  { id: 'c-grc', code: 'GRC', name: 'Greece', region: 'Europe', incomeLevel: 'high' },
  { id: 'c-bgr', code: 'BGR', name: 'Bulgaria', region: 'Europe', incomeLevel: 'upper-middle' },
  { id: 'c-srb', code: 'SRB', name: 'Serbia', region: 'Europe', incomeLevel: 'upper-middle' },
  { id: 'c-hrv', code: 'HRV', name: 'Croatia', region: 'Europe', incomeLevel: 'high' },

  // North America
  { id: 'c-usa', code: 'USA', name: 'United States', region: 'North America', incomeLevel: 'high' },
  { id: 'c-can', code: 'CAN', name: 'Canada', region: 'North America', incomeLevel: 'high' },
  { id: 'c-mex', code: 'MEX', name: 'Mexico', region: 'North America', incomeLevel: 'upper-middle' },
  
  // Central America & Caribbean
  { id: 'c-gtm', code: 'GTM', name: 'Guatemala', region: 'Central America', incomeLevel: 'upper-middle' },
  { id: 'c-cri', code: 'CRI', name: 'Costa Rica', region: 'Central America', incomeLevel: 'upper-middle' },
  { id: 'c-pan', code: 'PAN', name: 'Panama', region: 'Central America', incomeLevel: 'high' },
  { id: 'c-cub', code: 'CUB', name: 'Cuba', region: 'Caribbean', incomeLevel: 'upper-middle' },
  { id: 'c-dom', code: 'DOM', name: 'Dominican Republic', region: 'Caribbean', incomeLevel: 'upper-middle' },
  { id: 'c-jam', code: 'JAM', name: 'Jamaica', region: 'Caribbean', incomeLevel: 'upper-middle' },
  
  // South America
  { id: 'c-bra', code: 'BRA', name: 'Brazil', region: 'South America', incomeLevel: 'upper-middle' },
  { id: 'c-arg', code: 'ARG', name: 'Argentina', region: 'South America', incomeLevel: 'upper-middle' },
  { id: 'c-col', code: 'COL', name: 'Colombia', region: 'South America', incomeLevel: 'upper-middle' },
  { id: 'c-chl', code: 'CHL', name: 'Chile', region: 'South America', incomeLevel: 'high' },
  { id: 'c-per', code: 'PER', name: 'Peru', region: 'South America', incomeLevel: 'upper-middle' },
  { id: 'c-ven', code: 'VEN', name: 'Venezuela', region: 'South America', incomeLevel: 'upper-middle' },
  { id: 'c-ecu', code: 'ECU', name: 'Ecuador', region: 'South America', incomeLevel: 'upper-middle' },
  { id: 'c-ury', code: 'URY', name: 'Uruguay', region: 'South America', incomeLevel: 'high' },
  { id: 'c-pry', code: 'PRY', name: 'Paraguay', region: 'South America', incomeLevel: 'upper-middle' },
  { id: 'c-bol', code: 'BOL', name: 'Bolivia', region: 'South America', incomeLevel: 'lower-middle' },
  
  // Middle East
  { id: 'c-sau', code: 'SAU', name: 'Saudi Arabia', region: 'Middle East', incomeLevel: 'high' },
  { id: 'c-are', code: 'ARE', name: 'United Arab Emirates', region: 'Middle East', incomeLevel: 'high' },
  { id: 'c-isr', code: 'ISR', name: 'Israel', region: 'Middle East', incomeLevel: 'high' },
  { id: 'c-tur', code: 'TUR', name: 'Turkey', region: 'Middle East', incomeLevel: 'upper-middle' },
  { id: 'c-irn', code: 'IRN', name: 'Iran', region: 'Middle East', incomeLevel: 'lower-middle' },
  { id: 'c-irq', code: 'IRQ', name: 'Iraq', region: 'Middle East', incomeLevel: 'upper-middle' },
  { id: 'c-qat', code: 'QAT', name: 'Qatar', region: 'Middle East', incomeLevel: 'high' },
  { id: 'c-kwt', code: 'KWT', name: 'Kuwait', region: 'Middle East', incomeLevel: 'high' },
  { id: 'c-omn', code: 'OMN', name: 'Oman', region: 'Middle East', incomeLevel: 'high' },
  { id: 'c-bhr', code: 'BHR', name: 'Bahrain', region: 'Middle East', incomeLevel: 'high' },
  { id: 'c-jor', code: 'JOR', name: 'Jordan', region: 'Middle East', incomeLevel: 'upper-middle' },
  { id: 'c-lbn', code: 'LBN', name: 'Lebanon', region: 'Middle East', incomeLevel: 'lower-middle' },
  
  // Africa - North
  { id: 'c-egy', code: 'EGY', name: 'Egypt', region: 'Africa', incomeLevel: 'lower-middle' },
  { id: 'c-mar', code: 'MAR', name: 'Morocco', region: 'Africa', incomeLevel: 'lower-middle' },
  { id: 'c-dza', code: 'DZA', name: 'Algeria', region: 'Africa', incomeLevel: 'lower-middle' },
  { id: 'c-tun', code: 'TUN', name: 'Tunisia', region: 'Africa', incomeLevel: 'lower-middle' },
  { id: 'c-lby', code: 'LBY', name: 'Libya', region: 'Africa', incomeLevel: 'upper-middle' },
  
  // Africa - Sub-Saharan
  { id: 'c-zaf', code: 'ZAF', name: 'South Africa', region: 'Africa', incomeLevel: 'upper-middle' },
  { id: 'c-nga', code: 'NGA', name: 'Nigeria', region: 'Africa', incomeLevel: 'lower-middle' },
  { id: 'c-ken', code: 'KEN', name: 'Kenya', region: 'Africa', incomeLevel: 'lower-middle' },
  { id: 'c-eth', code: 'ETH', name: 'Ethiopia', region: 'Africa', incomeLevel: 'low' },
  { id: 'c-gha', code: 'GHA', name: 'Ghana', region: 'Africa', incomeLevel: 'lower-middle' },
  { id: 'c-tza', code: 'TZA', name: 'Tanzania', region: 'Africa', incomeLevel: 'lower-middle' },
  { id: 'c-uga', code: 'UGA', name: 'Uganda', region: 'Africa', incomeLevel: 'low' },
  { id: 'c-rwa', code: 'RWA', name: 'Rwanda', region: 'Africa', incomeLevel: 'low' },
  { id: 'c-sen', code: 'SEN', name: 'Senegal', region: 'Africa', incomeLevel: 'lower-middle' },
  { id: 'c-civ', code: 'CIV', name: 'Ivory Coast', region: 'Africa', incomeLevel: 'lower-middle' },
  { id: 'c-cmr', code: 'CMR', name: 'Cameroon', region: 'Africa', incomeLevel: 'lower-middle' },
  { id: 'c-ago', code: 'AGO', name: 'Angola', region: 'Africa', incomeLevel: 'lower-middle' },
  { id: 'c-moz', code: 'MOZ', name: 'Mozambique', region: 'Africa', incomeLevel: 'low' },
  { id: 'c-zmb', code: 'ZMB', name: 'Zambia', region: 'Africa', incomeLevel: 'lower-middle' },
  { id: 'c-zwe', code: 'ZWE', name: 'Zimbabwe', region: 'Africa', incomeLevel: 'lower-middle' },
  { id: 'c-bwa', code: 'BWA', name: 'Botswana', region: 'Africa', incomeLevel: 'upper-middle' },
  { id: 'c-nam', code: 'NAM', name: 'Namibia', region: 'Africa', incomeLevel: 'upper-middle' },
  { id: 'c-mus', code: 'MUS', name: 'Mauritius', region: 'Africa', incomeLevel: 'upper-middle' },
  
  // Oceania
  { id: 'c-aus', code: 'AUS', name: 'Australia', region: 'Oceania', incomeLevel: 'high' },
  { id: 'c-nzl', code: 'NZL', name: 'New Zealand', region: 'Oceania', incomeLevel: 'high' },
  { id: 'c-fji', code: 'FJI', name: 'Fiji', region: 'Oceania', incomeLevel: 'upper-middle' },
  { id: 'c-png', code: 'PNG', name: 'Papua New Guinea', region: 'Oceania', incomeLevel: 'lower-middle' },
  
  // Central Asia
  { id: 'c-kaz', code: 'KAZ', name: 'Kazakhstan', region: 'Central Asia', incomeLevel: 'upper-middle' },
  { id: 'c-uzb', code: 'UZB', name: 'Uzbekistan', region: 'Central Asia', incomeLevel: 'lower-middle' },
  { id: 'c-tkm', code: 'TKM', name: 'Turkmenistan', region: 'Central Asia', incomeLevel: 'upper-middle' },
  { id: 'c-kgz', code: 'KGZ', name: 'Kyrgyzstan', region: 'Central Asia', incomeLevel: 'lower-middle' },
  { id: 'c-tjk', code: 'TJK', name: 'Tajikistan', region: 'Central Asia', incomeLevel: 'lower-middle' },
  
  // Caucasus
  { id: 'c-geo', code: 'GEO', name: 'Georgia', region: 'Caucasus', incomeLevel: 'upper-middle' },
  { id: 'c-arm', code: 'ARM', name: 'Armenia', region: 'Caucasus', incomeLevel: 'upper-middle' },
  { id: 'c-aze', code: 'AZE', name: 'Azerbaijan', region: 'Caucasus', incomeLevel: 'upper-middle' },
]

// ============================================================================
// PEER GROUPS DATA
// ============================================================================

const peerGroupsData = [
  { id: 'pg-brics', name: 'BRICS', countryCodes: JSON.stringify(['BRA', 'RUS', 'IND', 'CHN', 'ZAF']) },
  { id: 'pg-g20', name: 'G20', countryCodes: JSON.stringify(['ARG', 'AUS', 'BRA', 'CAN', 'CHN', 'FRA', 'DEU', 'IND', 'IDN', 'ITA', 'JPN', 'MEX', 'RUS', 'SAU', 'ZAF', 'KOR', 'TUR', 'GBR', 'USA']) },
  { id: 'pg-south-asia', name: 'South Asian', countryCodes: JSON.stringify(['IND', 'PAK', 'BGD', 'LKA', 'NPL', 'BTN', 'MDV', 'AFG']) },
  { id: 'pg-asean', name: 'ASEAN', countryCodes: JSON.stringify(['IDN', 'THA', 'VNM', 'MYS', 'SGP', 'PHL', 'MMR', 'KHM', 'LAO', 'BRN']) },
  { id: 'pg-eu', name: 'European Union', countryCodes: JSON.stringify(['DEU', 'FRA', 'ITA', 'ESP', 'NLD', 'BEL', 'AUT', 'PRT', 'IRL', 'SWE', 'DNK', 'FIN', 'POL', 'CZE', 'ROU', 'HUN', 'GRC', 'BGR', 'HRV']) },
  { id: 'pg-high-income', name: 'High Income', countryCodes: JSON.stringify(['USA', 'GBR', 'DEU', 'FRA', 'JPN', 'CAN', 'AUS', 'KOR', 'SGP', 'CHE', 'NOR', 'SWE', 'DNK', 'NLD', 'ISR', 'ARE', 'QAT', 'SAU']) },
  { id: 'pg-lower-middle', name: 'Lower Middle Income', countryCodes: JSON.stringify(['IND', 'PAK', 'BGD', 'VNM', 'PHL', 'EGY', 'NGA', 'KEN', 'UKR', 'IRN']) },
]

// ============================================================================
// DOMAINS DATA
// ============================================================================

const domainsData = [
  { id: 'd-economy', name: 'Economy', description: 'Economic performance, competitiveness, and business environment indices', icon: '💰' },
  { id: 'd-education', name: 'Education', description: 'Educational quality, literacy, and academic performance indices', icon: '📚' },
  { id: 'd-healthcare', name: 'Healthcare', description: 'Health system quality, access, and outcomes indices', icon: '🏥' },
  { id: 'd-innovation', name: 'Innovation', description: 'Technology, research, and digital competitiveness indices', icon: '💡' },
  { id: 'd-governance', name: 'Governance', description: 'Government effectiveness, democracy, and rule of law indices', icon: '🏛️' },
  { id: 'd-environment', name: 'Environment', description: 'Environmental performance and sustainability indices', icon: '🌍' },
  { id: 'd-infrastructure', name: 'Infrastructure', description: 'Physical and digital infrastructure quality indices', icon: '🏗️' },
  { id: 'd-military', name: 'Military Strength', description: 'Defense capabilities and military power indices', icon: '🛡️' },
  { id: 'd-sports', name: 'Sports', description: 'Sports performance and athletic achievement indices', icon: '🏆' },
  { id: 'd-happiness', name: 'Happiness', description: 'Well-being, life satisfaction, and quality of life indices', icon: '😊' },
  { id: 'd-social', name: 'Social Development', description: 'Human development, equality, and social progress indices', icon: '👥' },
]


// ============================================================================
// RANKING INDICES DATA - 50+ indices from Wikipedia's International Rankings
// ============================================================================

const rankingIndicesData = [
  // ECONOMY DOMAIN (15 indices)
  {
    id: 'ri-gdp-nominal',
    name: 'GDP (Nominal)',
    shortName: 'GDP',
    domainId: 'd-economy',
    source: 'International Monetary Fund',
    sourceUrl: 'https://www.imf.org/en/Publications/WEO',
    methodology: 'Gross Domestic Product at current prices in USD. Measures total economic output.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 30000000,
    higherIsBetter: true,
    lastUpdated: new Date('2024-10-01'),
  },
  {
    id: 'ri-gdp-ppp',
    name: 'GDP (PPP)',
    shortName: 'GDP PPP',
    domainId: 'd-economy',
    source: 'International Monetary Fund',
    sourceUrl: 'https://www.imf.org/en/Publications/WEO',
    methodology: 'GDP adjusted for purchasing power parity. Better reflects living standards.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 35000000,
    higherIsBetter: true,
    lastUpdated: new Date('2024-10-01'),
  },
  {
    id: 'ri-gdp-per-capita',
    name: 'GDP Per Capita (PPP)',
    shortName: 'GDP/Capita',
    domainId: 'd-economy',
    source: 'International Monetary Fund',
    sourceUrl: 'https://www.imf.org/en/Publications/WEO',
    methodology: 'GDP PPP divided by population. Measures average economic output per person.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 150000,
    higherIsBetter: true,
    lastUpdated: new Date('2024-10-01'),
  },
  {
    id: 'ri-ease-business',
    name: 'Ease of Doing Business Index',
    shortName: 'EoDB',
    domainId: 'd-economy',
    source: 'World Bank',
    sourceUrl: 'https://www.doingbusiness.org/',
    methodology: 'Measures business regulations and their enforcement. Discontinued in 2021.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 100,
    higherIsBetter: true,
    lastUpdated: new Date('2020-01-01'),
  },
  {
    id: 'ri-corruption',
    name: 'Corruption Perceptions Index',
    shortName: 'CPI',
    domainId: 'd-economy',
    source: 'Transparency International',
    sourceUrl: 'https://www.transparency.org/en/cpi',
    methodology: 'Measures perceived levels of public sector corruption. Scale 0-100.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 100,
    higherIsBetter: true,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    id: 'ri-competitiveness',
    name: 'Global Competitiveness Index',
    shortName: 'GCI',
    domainId: 'd-economy',
    source: 'World Economic Forum',
    sourceUrl: 'https://www.weforum.org/reports/global-competitiveness-report',
    methodology: 'Measures national competitiveness based on institutions, infrastructure, ICT, etc.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 100,
    higherIsBetter: true,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    id: 'ri-economic-freedom',
    name: 'Index of Economic Freedom',
    shortName: 'IEF',
    domainId: 'd-economy',
    source: 'Heritage Foundation',
    sourceUrl: 'https://www.heritage.org/index/',
    methodology: 'Measures economic freedom based on rule of law, government size, regulatory efficiency.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 100,
    higherIsBetter: true,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    id: 'ri-economic-complexity',
    name: 'Economic Complexity Index',
    shortName: 'ECI',
    domainId: 'd-economy',
    source: 'Harvard Growth Lab',
    sourceUrl: 'https://atlas.cid.harvard.edu/',
    methodology: 'Measures productive capabilities based on export diversity and sophistication.',
    updateFrequency: 'annual',
    scoreMin: -3,
    scoreMax: 3,
    higherIsBetter: true,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    id: 'ri-financial-centres',
    name: 'Global Financial Centres Index',
    shortName: 'GFCI',
    domainId: 'd-economy',
    source: 'Z/Yen Partners',
    sourceUrl: 'https://www.longfinance.net/programmes/financial-centre-futures/global-financial-centres-index/',
    methodology: 'Ranks financial centers based on business environment, human capital, infrastructure.',
    updateFrequency: 'biannual',
    scoreMin: 0,
    scoreMax: 1000,
    higherIsBetter: true,
    lastUpdated: new Date('2024-09-01'),
  },
  {
    id: 'ri-fdi-confidence',
    name: 'FDI Confidence Index',
    shortName: 'FDI',
    domainId: 'd-economy',
    source: 'Kearney',
    sourceUrl: 'https://www.kearney.com/foreign-direct-investment-confidence-index',
    methodology: 'Measures investor confidence for foreign direct investment.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 3,
    higherIsBetter: true,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    id: 'ri-logistics',
    name: 'Logistics Performance Index',
    shortName: 'LPI',
    domainId: 'd-economy',
    source: 'World Bank',
    sourceUrl: 'https://lpi.worldbank.org/',
    methodology: 'Measures trade logistics efficiency including customs, infrastructure, tracking.',
    updateFrequency: 'biannual',
    scoreMin: 1,
    scoreMax: 5,
    higherIsBetter: true,
    lastUpdated: new Date('2023-01-01'),
  },
  {
    id: 'ri-trade-enabling',
    name: 'Global Trade Enabling Index',
    shortName: 'GTEI',
    domainId: 'd-economy',
    source: 'World Economic Forum',
    sourceUrl: 'https://www.weforum.org/reports/the-global-enabling-trade-report',
    methodology: 'Measures factors enabling trade including market access, border administration.',
    updateFrequency: 'biannual',
    scoreMin: 1,
    scoreMax: 7,
    higherIsBetter: true,
    lastUpdated: new Date('2023-01-01'),
  },
  {
    id: 'ri-prosperity',
    name: 'Legatum Prosperity Index',
    shortName: 'LPI',
    domainId: 'd-economy',
    source: 'Legatum Institute',
    sourceUrl: 'https://www.prosperity.com/',
    methodology: 'Measures prosperity based on economic quality, business environment, governance.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 100,
    higherIsBetter: true,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    id: 'ri-inclusive-development',
    name: 'Inclusive Development Index',
    shortName: 'IDI',
    domainId: 'd-economy',
    source: 'World Economic Forum',
    sourceUrl: 'https://www.weforum.org/reports/the-inclusive-development-index',
    methodology: 'Measures economic development including growth, inclusion, intergenerational equity.',
    updateFrequency: 'annual',
    scoreMin: 1,
    scoreMax: 7,
    higherIsBetter: true,
    lastUpdated: new Date('2023-01-01'),
  },
  {
    id: 'ri-global-wealth',
    name: 'Global Wealth Report',
    shortName: 'GWR',
    domainId: 'd-economy',
    source: 'Credit Suisse',
    sourceUrl: 'https://www.credit-suisse.com/about-us/en/reports-research/global-wealth-report.html',
    methodology: 'Measures total wealth and wealth per adult by country.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 150000000,
    higherIsBetter: true,
    lastUpdated: new Date('2024-01-01'),
  },

  // EDUCATION DOMAIN (6 indices)
  {
    id: 'ri-pisa',
    name: 'PISA Education Rankings',
    shortName: 'PISA',
    domainId: 'd-education',
    source: 'OECD',
    sourceUrl: 'https://www.oecd.org/pisa/',
    methodology: 'Programme for International Student Assessment. Tests 15-year-olds in reading, math, science.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 700,
    higherIsBetter: true,
    lastUpdated: new Date('2023-12-01'),
  },
  {
    id: 'ri-qs-university',
    name: 'QS World University Rankings',
    shortName: 'QS',
    domainId: 'd-education',
    source: 'Quacquarelli Symonds',
    sourceUrl: 'https://www.topuniversities.com/university-rankings',
    methodology: 'Ranks universities based on academic reputation, employer reputation, citations.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 100,
    higherIsBetter: true,
    lastUpdated: new Date('2024-06-01'),
  },
  {
    id: 'ri-times-university',
    name: 'Times Higher Education Rankings',
    shortName: 'THE',
    domainId: 'd-education',
    source: 'Times Higher Education',
    sourceUrl: 'https://www.timeshighereducation.com/world-university-rankings',
    methodology: 'Ranks universities based on teaching, research, citations, industry income.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 100,
    higherIsBetter: true,
    lastUpdated: new Date('2024-09-01'),
  },
  {
    id: 'ri-global-knowledge',
    name: 'Global Knowledge Index',
    shortName: 'GKI',
    domainId: 'd-education',
    source: 'UNDP',
    sourceUrl: 'https://www.undp.org/arab-states/publications/global-knowledge-index',
    methodology: 'Measures knowledge across pre-university, higher education, R&D, ICT, economy.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 100,
    higherIsBetter: true,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    id: 'ri-education-index',
    name: 'Education Index',
    shortName: 'EI',
    domainId: 'd-education',
    source: 'UNDP',
    sourceUrl: 'https://hdr.undp.org/',
    methodology: 'Component of HDI measuring mean and expected years of schooling.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 1,
    higherIsBetter: true,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    id: 'ri-english-proficiency',
    name: 'English Proficiency Index',
    shortName: 'EPI',
    domainId: 'd-education',
    source: 'EF Education First',
    sourceUrl: 'https://www.ef.com/wwen/epi/',
    methodology: 'Measures English language skills of non-native speakers.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 800,
    higherIsBetter: true,
    lastUpdated: new Date('2024-01-01'),
  },

  // HEALTHCARE DOMAIN (6 indices)
  {
    id: 'ri-healthcare-access',
    name: 'Healthcare Access and Quality Index',
    shortName: 'HAQ',
    domainId: 'd-healthcare',
    source: 'The Lancet',
    sourceUrl: 'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(18)30994-2/fulltext',
    methodology: 'Measures healthcare access and quality based on mortality from treatable causes.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 100,
    higherIsBetter: true,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    id: 'ri-health-security',
    name: 'Global Health Security Index',
    shortName: 'GHSI',
    domainId: 'd-healthcare',
    source: 'Nuclear Threat Initiative',
    sourceUrl: 'https://www.ghsindex.org/',
    methodology: 'Measures health security capabilities including prevention, detection, response.',
    updateFrequency: 'biannual',
    scoreMin: 0,
    scoreMax: 100,
    higherIsBetter: true,
    lastUpdated: new Date('2021-01-01'),
  },
  {
    id: 'ri-uhc',
    name: 'Universal Health Coverage Index',
    shortName: 'UHC',
    domainId: 'd-healthcare',
    source: 'World Health Organization',
    sourceUrl: 'https://www.who.int/data/gho/data/themes/topics/service-coverage',
    methodology: 'Measures coverage of essential health services.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 100,
    higherIsBetter: true,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    id: 'ri-life-expectancy',
    name: 'Life Expectancy at Birth',
    shortName: 'LE',
    domainId: 'd-healthcare',
    source: 'World Bank',
    sourceUrl: 'https://data.worldbank.org/indicator/SP.DYN.LE00.IN',
    methodology: 'Average number of years a newborn is expected to live.',
    updateFrequency: 'annual',
    scoreMin: 40,
    scoreMax: 90,
    higherIsBetter: true,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    id: 'ri-infant-mortality',
    name: 'Infant Mortality Rate',
    shortName: 'IMR',
    domainId: 'd-healthcare',
    source: 'World Bank',
    sourceUrl: 'https://data.worldbank.org/indicator/SP.DYN.IMRT.IN',
    methodology: 'Deaths of infants under one year per 1,000 live births.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 100,
    higherIsBetter: false,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    id: 'ri-health-expenditure',
    name: 'Health Expenditure per Capita',
    shortName: 'HE',
    domainId: 'd-healthcare',
    source: 'World Health Organization',
    sourceUrl: 'https://www.who.int/data/gho/data/indicators/indicator-details/GHO/current-health-expenditure-(che)-per-capita-in-us$',
    methodology: 'Current health expenditure per capita in USD.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 15000,
    higherIsBetter: true,
    lastUpdated: new Date('2024-01-01'),
  },

  // INNOVATION DOMAIN (7 indices)
  {
    id: 'ri-innovation',
    name: 'Global Innovation Index',
    shortName: 'GII',
    domainId: 'd-innovation',
    source: 'WIPO',
    sourceUrl: 'https://www.wipo.int/global_innovation_index/en/',
    methodology: 'Measures innovation ecosystem including institutions, human capital, infrastructure.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 100,
    higherIsBetter: true,
    lastUpdated: new Date('2024-09-01'),
  },
  {
    id: 'ri-digital-competitiveness',
    name: 'World Digital Competitiveness Ranking',
    shortName: 'WDCR',
    domainId: 'd-innovation',
    source: 'IMD',
    sourceUrl: 'https://www.imd.org/centers/wcc/world-competitiveness-center/rankings/world-digital-competitiveness-ranking/',
    methodology: 'Measures capacity to adopt and explore digital technologies.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 100,
    higherIsBetter: true,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    id: 'ri-ai-readiness',
    name: 'Government AI Readiness Index',
    shortName: 'GAIRI',
    domainId: 'd-innovation',
    source: 'Oxford Insights',
    sourceUrl: 'https://www.oxfordinsights.com/government-ai-readiness-index',
    methodology: 'Measures government preparedness to implement AI in public services.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 100,
    higherIsBetter: true,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    id: 'ri-cyber-security',
    name: 'Global Cybersecurity Index',
    shortName: 'GCI',
    domainId: 'd-innovation',
    source: 'ITU',
    sourceUrl: 'https://www.itu.int/en/ITU-D/Cybersecurity/Pages/global-cybersecurity-index.aspx',
    methodology: 'Measures commitment to cybersecurity across legal, technical, organizational measures.',
    updateFrequency: 'biannual',
    scoreMin: 0,
    scoreMax: 100,
    higherIsBetter: true,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    id: 'ri-network-readiness',
    name: 'Network Readiness Index',
    shortName: 'NRI',
    domainId: 'd-innovation',
    source: 'Portulans Institute',
    sourceUrl: 'https://networkreadinessindex.org/',
    methodology: 'Measures how well economies leverage ICT for competitiveness and well-being.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 100,
    higherIsBetter: true,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    id: 'ri-startup-ecosystem',
    name: 'Global Startup Ecosystem Index',
    shortName: 'GSEI',
    domainId: 'd-innovation',
    source: 'StartupBlink',
    sourceUrl: 'https://www.startupblink.com/',
    methodology: 'Ranks startup ecosystems based on quantity, quality, and business environment.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 300,
    higherIsBetter: true,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    id: 'ri-rd-expenditure',
    name: 'R&D Expenditure (% of GDP)',
    shortName: 'R&D',
    domainId: 'd-innovation',
    source: 'World Bank',
    sourceUrl: 'https://data.worldbank.org/indicator/GB.XPD.RSDV.GD.ZS',
    methodology: 'Gross domestic expenditure on research and development as percentage of GDP.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 5,
    higherIsBetter: true,
    lastUpdated: new Date('2024-01-01'),
  },

  // GOVERNANCE DOMAIN (7 indices)
  {
    id: 'ri-press-freedom',
    name: 'World Press Freedom Index',
    shortName: 'WPFI',
    domainId: 'd-governance',
    source: 'Reporters Without Borders',
    sourceUrl: 'https://rsf.org/en/index',
    methodology: 'Measures press freedom based on pluralism, independence, environment, self-censorship.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 100,
    higherIsBetter: true,
    lastUpdated: new Date('2024-05-01'),
  },
  {
    id: 'ri-democracy',
    name: 'Democracy Index',
    shortName: 'DI',
    domainId: 'd-governance',
    source: 'Economist Intelligence Unit',
    sourceUrl: 'https://www.eiu.com/n/campaigns/democracy-index/',
    methodology: 'Measures democracy based on electoral process, civil liberties, political participation.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 10,
    higherIsBetter: true,
    lastUpdated: new Date('2024-02-01'),
  },
  {
    id: 'ri-rule-of-law',
    name: 'Rule of Law Index',
    shortName: 'RLI',
    domainId: 'd-governance',
    source: 'World Justice Project',
    sourceUrl: 'https://worldjusticeproject.org/rule-of-law-index/',
    methodology: 'Measures rule of law based on constraints on government, absence of corruption, rights.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 1,
    higherIsBetter: true,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    id: 'ri-govt-effectiveness',
    name: 'Government Effectiveness Index',
    shortName: 'GEI',
    domainId: 'd-governance',
    source: 'World Bank',
    sourceUrl: 'https://info.worldbank.org/governance/wgi/',
    methodology: 'Measures quality of public services, civil service, policy formulation.',
    updateFrequency: 'annual',
    scoreMin: -2.5,
    scoreMax: 2.5,
    higherIsBetter: true,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    id: 'ri-fragile-states',
    name: 'Fragile States Index',
    shortName: 'FSI',
    domainId: 'd-governance',
    source: 'Fund for Peace',
    sourceUrl: 'https://fragilestatesindex.org/',
    methodology: 'Measures state fragility based on cohesion, economic, political, social indicators.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 120,
    higherIsBetter: false,
    lastUpdated: new Date('2024-05-01'),
  },
  {
    id: 'ri-political-stability',
    name: 'Political Stability Index',
    shortName: 'PSI',
    domainId: 'd-governance',
    source: 'World Bank',
    sourceUrl: 'https://info.worldbank.org/governance/wgi/',
    methodology: 'Measures likelihood of political instability and violence.',
    updateFrequency: 'annual',
    scoreMin: -2.5,
    scoreMax: 2.5,
    higherIsBetter: true,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    id: 'ri-voice-accountability',
    name: 'Voice and Accountability Index',
    shortName: 'VAI',
    domainId: 'd-governance',
    source: 'World Bank',
    sourceUrl: 'https://info.worldbank.org/governance/wgi/',
    methodology: 'Measures citizen participation in government selection, freedom of expression.',
    updateFrequency: 'annual',
    scoreMin: -2.5,
    scoreMax: 2.5,
    higherIsBetter: true,
    lastUpdated: new Date('2024-01-01'),
  },

  // ENVIRONMENT DOMAIN (5 indices)
  {
    id: 'ri-epi',
    name: 'Environmental Performance Index',
    shortName: 'EPI',
    domainId: 'd-environment',
    source: 'Yale University',
    sourceUrl: 'https://epi.yale.edu/',
    methodology: 'Measures environmental health and ecosystem vitality across 40 indicators.',
    updateFrequency: 'biannual',
    scoreMin: 0,
    scoreMax: 100,
    higherIsBetter: true,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    id: 'ri-climate-change',
    name: 'Climate Change Performance Index',
    shortName: 'CCPI',
    domainId: 'd-environment',
    source: 'Germanwatch',
    sourceUrl: 'https://ccpi.org/',
    methodology: 'Measures climate protection performance based on emissions, renewables, policy.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 100,
    higherIsBetter: true,
    lastUpdated: new Date('2024-12-01'),
  },
  {
    id: 'ri-sdg',
    name: 'Sustainable Development Goals Index',
    shortName: 'SDG',
    domainId: 'd-environment',
    source: 'Sustainable Development Solutions Network',
    sourceUrl: 'https://dashboards.sdgindex.org/',
    methodology: 'Measures progress towards UN Sustainable Development Goals.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 100,
    higherIsBetter: true,
    lastUpdated: new Date('2024-06-01'),
  },
  {
    id: 'ri-renewable-energy',
    name: 'Renewable Energy Country Attractiveness Index',
    shortName: 'RECAI',
    domainId: 'd-environment',
    source: 'EY',
    sourceUrl: 'https://www.ey.com/en_gl/recai',
    methodology: 'Ranks countries on attractiveness for renewable energy investment.',
    updateFrequency: 'biannual',
    scoreMin: 0,
    scoreMax: 100,
    higherIsBetter: true,
    lastUpdated: new Date('2024-05-01'),
  },
  {
    id: 'ri-air-quality',
    name: 'Air Quality Index',
    shortName: 'AQI',
    domainId: 'd-environment',
    source: 'IQAir',
    sourceUrl: 'https://www.iqair.com/world-air-quality-ranking',
    methodology: 'Measures air pollution levels based on PM2.5 concentration.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 500,
    higherIsBetter: false,
    lastUpdated: new Date('2024-01-01'),
  },

  // INFRASTRUCTURE DOMAIN (4 indices)
  {
    id: 'ri-infrastructure',
    name: 'Global Infrastructure Index',
    shortName: 'GII',
    domainId: 'd-infrastructure',
    source: 'World Economic Forum',
    sourceUrl: 'https://www.weforum.org/reports/global-competitiveness-report',
    methodology: 'Measures quality of transport, utility, and digital infrastructure.',
    updateFrequency: 'annual',
    scoreMin: 1,
    scoreMax: 7,
    higherIsBetter: true,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    id: 'ri-road-quality',
    name: 'Road Quality Index',
    shortName: 'RQI',
    domainId: 'd-infrastructure',
    source: 'World Economic Forum',
    sourceUrl: 'https://www.weforum.org/reports/global-competitiveness-report',
    methodology: 'Measures quality of road infrastructure.',
    updateFrequency: 'annual',
    scoreMin: 1,
    scoreMax: 7,
    higherIsBetter: true,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    id: 'ri-passport',
    name: 'Henley Passport Index',
    shortName: 'HPI',
    domainId: 'd-infrastructure',
    source: 'Henley & Partners',
    sourceUrl: 'https://www.henleyglobal.com/passport-index',
    methodology: 'Ranks passports by number of visa-free destinations.',
    updateFrequency: 'quarterly',
    scoreMin: 0,
    scoreMax: 200,
    higherIsBetter: true,
    lastUpdated: new Date('2024-10-01'),
  },
  {
    id: 'ri-internet-speed',
    name: 'Global Internet Speed Index',
    shortName: 'GISI',
    domainId: 'd-infrastructure',
    source: 'Speedtest by Ookla',
    sourceUrl: 'https://www.speedtest.net/global-index',
    methodology: 'Measures average fixed broadband and mobile internet speeds.',
    updateFrequency: 'quarterly',
    scoreMin: 0,
    scoreMax: 300,
    higherIsBetter: true,
    lastUpdated: new Date('2024-10-01'),
  },

  // MILITARY DOMAIN (3 indices)
  {
    id: 'ri-military-strength',
    name: 'Global Firepower Index',
    shortName: 'GFP',
    domainId: 'd-military',
    source: 'Global Firepower',
    sourceUrl: 'https://www.globalfirepower.com/',
    methodology: 'Measures military strength based on manpower, equipment, finances, geography.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 1,
    higherIsBetter: false,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    id: 'ri-defense-budget',
    name: 'Defense Budget Ranking',
    shortName: 'DBR',
    domainId: 'd-military',
    source: 'SIPRI',
    sourceUrl: 'https://www.sipri.org/databases/milex',
    methodology: 'Ranks countries by military expenditure in USD.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 1000000,
    higherIsBetter: true,
    lastUpdated: new Date('2024-04-01'),
  },
  {
    id: 'ri-peace',
    name: 'Global Peace Index',
    shortName: 'GPI',
    domainId: 'd-military',
    source: 'Institute for Economics and Peace',
    sourceUrl: 'https://www.visionofhumanity.org/maps/',
    methodology: 'Measures peacefulness based on safety, conflict, militarization.',
    updateFrequency: 'annual',
    scoreMin: 1,
    scoreMax: 5,
    higherIsBetter: false,
    lastUpdated: new Date('2024-06-01'),
  },

  // SPORTS DOMAIN (4 indices)
  {
    id: 'ri-fifa',
    name: 'FIFA World Ranking',
    shortName: 'FIFA',
    domainId: 'd-sports',
    source: 'FIFA',
    sourceUrl: 'https://www.fifa.com/fifa-world-ranking',
    methodology: 'Ranks national football teams based on match results.',
    updateFrequency: 'quarterly',
    scoreMin: 0,
    scoreMax: 2000,
    higherIsBetter: true,
    lastUpdated: new Date('2024-10-01'),
  },
  {
    id: 'ri-olympics',
    name: 'Olympic Medal Tally',
    shortName: 'OMT',
    domainId: 'd-sports',
    source: 'International Olympic Committee',
    sourceUrl: 'https://olympics.com/en/olympic-games/olympic-results',
    methodology: 'Ranks countries by total Olympic medals won.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 3000,
    higherIsBetter: true,
    lastUpdated: new Date('2024-08-01'),
  },
  {
    id: 'ri-cricket',
    name: 'ICC Cricket Rankings',
    shortName: 'ICC',
    domainId: 'd-sports',
    source: 'International Cricket Council',
    sourceUrl: 'https://www.icc-cricket.com/rankings/mens/team-rankings',
    methodology: 'Ranks national cricket teams based on match results.',
    updateFrequency: 'quarterly',
    scoreMin: 0,
    scoreMax: 150,
    higherIsBetter: true,
    lastUpdated: new Date('2024-10-01'),
  },
  {
    id: 'ri-sports-nation',
    name: 'Greatest Sporting Nations',
    shortName: 'GSN',
    domainId: 'd-sports',
    source: 'ESPN',
    sourceUrl: 'https://www.espn.com/espn/story/_/id/10875542/espn-greatest-sporting-nations',
    methodology: 'Composite ranking based on performance across multiple sports.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 100,
    higherIsBetter: true,
    lastUpdated: new Date('2024-01-01'),
  },

  // HAPPINESS DOMAIN (3 indices)
  {
    id: 'ri-happiness',
    name: 'World Happiness Report',
    shortName: 'WHR',
    domainId: 'd-happiness',
    source: 'Sustainable Development Solutions Network',
    sourceUrl: 'https://worldhappiness.report/',
    methodology: 'Measures happiness based on GDP, social support, life expectancy, freedom.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 10,
    higherIsBetter: true,
    lastUpdated: new Date('2024-03-01'),
  },
  {
    id: 'ri-quality-of-life',
    name: 'Quality of Life Index',
    shortName: 'QLI',
    domainId: 'd-happiness',
    source: 'Numbeo',
    sourceUrl: 'https://www.numbeo.com/quality-of-life/rankings_by_country.jsp',
    methodology: 'Measures quality of life based on purchasing power, safety, healthcare, climate.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 250,
    higherIsBetter: true,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    id: 'ri-better-life',
    name: 'Better Life Index',
    shortName: 'BLI',
    domainId: 'd-happiness',
    source: 'OECD',
    sourceUrl: 'https://www.oecdbetterlifeindex.org/',
    methodology: 'Measures well-being across housing, income, jobs, community, education, environment.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 10,
    higherIsBetter: true,
    lastUpdated: new Date('2024-01-01'),
  },

  // SOCIAL DEVELOPMENT DOMAIN (6 indices)
  {
    id: 'ri-hdi',
    name: 'Human Development Index',
    shortName: 'HDI',
    domainId: 'd-social',
    source: 'UNDP',
    sourceUrl: 'https://hdr.undp.org/',
    methodology: 'Measures human development based on life expectancy, education, income.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 1,
    higherIsBetter: true,
    lastUpdated: new Date('2024-09-01'),
  },
  {
    id: 'ri-hunger',
    name: 'Global Hunger Index',
    shortName: 'GHI',
    domainId: 'd-social',
    source: 'Concern Worldwide',
    sourceUrl: 'https://www.globalhungerindex.org/',
    methodology: 'Measures hunger based on undernourishment, child wasting, stunting, mortality.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 100,
    higherIsBetter: false,
    lastUpdated: new Date('2024-10-01'),
  },
  {
    id: 'ri-gender-inequality',
    name: 'Gender Inequality Index',
    shortName: 'GII',
    domainId: 'd-social',
    source: 'UNDP',
    sourceUrl: 'https://hdr.undp.org/',
    methodology: 'Measures gender inequality in reproductive health, empowerment, labor market.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 1,
    higherIsBetter: false,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    id: 'ri-social-progress',
    name: 'Social Progress Index',
    shortName: 'SPI',
    domainId: 'd-social',
    source: 'Social Progress Imperative',
    sourceUrl: 'https://www.socialprogress.org/',
    methodology: 'Measures social progress based on basic needs, foundations of well-being, opportunity.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 100,
    higherIsBetter: true,
    lastUpdated: new Date('2024-09-01'),
  },
  {
    id: 'ri-gini',
    name: 'Gini Coefficient',
    shortName: 'GINI',
    domainId: 'd-social',
    source: 'World Bank',
    sourceUrl: 'https://data.worldbank.org/indicator/SI.POV.GINI',
    methodology: 'Measures income inequality. 0 = perfect equality, 100 = perfect inequality.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 100,
    higherIsBetter: false,
    lastUpdated: new Date('2024-01-01'),
  },
  {
    id: 'ri-poverty',
    name: 'Multidimensional Poverty Index',
    shortName: 'MPI',
    domainId: 'd-social',
    source: 'UNDP',
    sourceUrl: 'https://hdr.undp.org/content/2023-global-multidimensional-poverty-index-mpi',
    methodology: 'Measures poverty across health, education, and living standards.',
    updateFrequency: 'annual',
    scoreMin: 0,
    scoreMax: 1,
    higherIsBetter: false,
    lastUpdated: new Date('2024-01-01'),
  },
]


// ============================================================================
// HELPER FUNCTIONS FOR GENERATING RANKING ENTRIES
// ============================================================================

/**
 * Generate a deterministic but realistic rank for a country in an index
 * Uses country characteristics to create consistent rankings
 */
function generateRank(
  countryCode: string,
  indexId: string,
  year: number,
  totalCountries: number,
  _higherIsBetter: boolean
): number {
  // Base rank influenced by country development level
  const countryData = countriesData.find(c => c.code === countryCode)
  if (!countryData) return Math.floor(totalCountries / 2)
  
  // Income level base ranking (higher income = better rank for most indices)
  const incomeLevelBase: Record<string, number> = {
    'high': 0.15,
    'upper-middle': 0.35,
    'lower-middle': 0.55,
    'low': 0.75,
  }
  
  // Special adjustments for specific countries and indices
  const countryStrengths: Record<string, Record<string, number>> = {
    'IND': {
      'ri-gdp-nominal': 0.05, 'ri-gdp-ppp': 0.03, 'ri-cricket': 0.02,
      'ri-military-strength': 0.05, 'ri-startup-ecosystem': 0.15,
      'ri-innovation': 0.35, 'ri-hdi': 0.55, 'ri-hunger': 0.65,
    },
    'USA': {
      'ri-gdp-nominal': 0.01, 'ri-gdp-ppp': 0.01, 'ri-innovation': 0.05,
      'ri-military-strength': 0.01, 'ri-olympics': 0.01,
    },
    'CHN': {
      'ri-gdp-nominal': 0.02, 'ri-gdp-ppp': 0.01, 'ri-military-strength': 0.03,
      'ri-olympics': 0.02, 'ri-innovation': 0.12,
    },
    'DEU': {
      'ri-innovation': 0.08, 'ri-competitiveness': 0.08, 'ri-epi': 0.10,
    },
    'JPN': {
      'ri-innovation': 0.06, 'ri-life-expectancy': 0.02, 'ri-hdi': 0.08,
    },
    'SGP': {
      'ri-ease-business': 0.01, 'ri-competitiveness': 0.02, 'ri-corruption': 0.03,
    },
    'NOR': {
      'ri-hdi': 0.01, 'ri-happiness': 0.03, 'ri-democracy': 0.02,
    },
    'CHE': {
      'ri-innovation': 0.01, 'ri-competitiveness': 0.03, 'ri-happiness': 0.05,
    },
  }
  
  // Calculate base position
  let basePosition = incomeLevelBase[countryData.incomeLevel] || 0.5
  
  // Apply country-specific adjustments
  const countryAdjustments = countryStrengths[countryCode] as Record<string, number> | undefined
  if (countryAdjustments !== undefined && indexId in countryAdjustments) {
    basePosition = countryAdjustments[indexId]
  }
  
  // Add year-based trend (slight improvement over time for developing countries)
  const yearFactor = (year - 2010) * 0.005
  if (countryData.incomeLevel === 'lower-middle' || countryData.incomeLevel === 'low') {
    basePosition = Math.max(0.05, basePosition - yearFactor)
  }
  
  // Add some deterministic variation based on index and country
  const hash = (countryCode.charCodeAt(0) + indexId.charCodeAt(3) + year) % 20
  const variation = (hash - 10) * 0.02
  
  basePosition = Math.max(0.01, Math.min(0.99, basePosition + variation))
  
  // Convert to rank
  let rank = Math.ceil(basePosition * totalCountries)
  rank = Math.max(1, Math.min(totalCountries, rank))
  
  return rank
}

/**
 * Generate a score based on rank and index characteristics
 */
function generateScore(
  rank: number,
  totalCountries: number,
  scoreMin: number,
  scoreMax: number,
  higherIsBetter: boolean
): number {
  const percentile = (totalCountries - rank + 1) / totalCountries
  
  if (higherIsBetter) {
    return scoreMin + (scoreMax - scoreMin) * percentile
  } else {
    return scoreMax - (scoreMax - scoreMin) * percentile
  }
}

/**
 * Normalize score to 0-100 range
 */
function normalizeScore(
  score: number,
  scoreMin: number,
  scoreMax: number,
  higherIsBetter: boolean
): number {
  const normalized = ((score - scoreMin) / (scoreMax - scoreMin)) * 100
  return higherIsBetter ? normalized : 100 - normalized
}

/**
 * Calculate percentile from rank
 */
function calculatePercentile(rank: number, totalCountries: number): number {
  return ((totalCountries - rank + 1) / totalCountries) * 100
}

/**
 * Generate unique ID
 */
function generateId(prefix: string, ...parts: Array<string | number>): string {
  return `${prefix}-${parts.join('-')}`
}


// ============================================================================
// MILESTONES DATA - Key events affecting India's rankings
// ============================================================================

const milestonesData = [
  // Economic milestones
  { indexId: 'ri-gdp-nominal', year: 2014, event: 'Make in India initiative launched', impact: 'positive' },
  { indexId: 'ri-gdp-nominal', year: 2016, event: 'Demonetization policy implemented', impact: 'negative' },
  { indexId: 'ri-gdp-nominal', year: 2017, event: 'GST implementation', impact: 'neutral' },
  { indexId: 'ri-gdp-nominal', year: 2020, event: 'COVID-19 pandemic impact', impact: 'negative' },
  { indexId: 'ri-gdp-nominal', year: 2023, event: 'India becomes 5th largest economy', impact: 'positive' },
  
  { indexId: 'ri-ease-business', year: 2014, event: 'Ease of Doing Business reforms initiated', impact: 'positive' },
  { indexId: 'ri-ease-business', year: 2017, event: 'Insolvency and Bankruptcy Code enacted', impact: 'positive' },
  { indexId: 'ri-ease-business', year: 2019, event: 'India jumps to 63rd rank', impact: 'positive' },
  
  // Innovation milestones
  { indexId: 'ri-innovation', year: 2015, event: 'Digital India initiative launched', impact: 'positive' },
  { indexId: 'ri-innovation', year: 2016, event: 'Startup India program launched', impact: 'positive' },
  { indexId: 'ri-innovation', year: 2022, event: 'India enters top 40 in GII', impact: 'positive' },
  
  { indexId: 'ri-startup-ecosystem', year: 2016, event: 'Startup India Action Plan', impact: 'positive' },
  { indexId: 'ri-startup-ecosystem', year: 2021, event: 'India becomes 3rd largest startup ecosystem', impact: 'positive' },
  
  // Healthcare milestones
  { indexId: 'ri-healthcare-access', year: 2018, event: 'Ayushman Bharat launched', impact: 'positive' },
  { indexId: 'ri-healthcare-access', year: 2020, event: 'COVID-19 healthcare strain', impact: 'negative' },
  { indexId: 'ri-healthcare-access', year: 2021, event: 'Vaccination drive success', impact: 'positive' },
  
  // Social development milestones
  { indexId: 'ri-hdi', year: 2015, event: 'Swachh Bharat Mission launched', impact: 'positive' },
  { indexId: 'ri-hdi', year: 2019, event: 'India moves to medium HDI category', impact: 'positive' },
  
  { indexId: 'ri-hunger', year: 2013, event: 'National Food Security Act', impact: 'positive' },
  { indexId: 'ri-hunger', year: 2020, event: 'PM Garib Kalyan Anna Yojana', impact: 'positive' },
  
  // Governance milestones
  { indexId: 'ri-corruption', year: 2016, event: 'Demonetization anti-corruption measure', impact: 'neutral' },
  { indexId: 'ri-democracy', year: 2019, event: 'Largest democratic election conducted', impact: 'positive' },
  
  // Environment milestones
  { indexId: 'ri-epi', year: 2015, event: 'Paris Agreement commitment', impact: 'positive' },
  { indexId: 'ri-renewable-energy', year: 2022, event: 'India reaches 100GW renewable capacity', impact: 'positive' },
  { indexId: 'ri-climate-change', year: 2021, event: 'Net Zero 2070 commitment', impact: 'positive' },
  
  // Sports milestones
  { indexId: 'ri-cricket', year: 2011, event: 'Cricket World Cup victory', impact: 'positive' },
  { indexId: 'ri-olympics', year: 2021, event: 'Best ever Olympic performance (7 medals)', impact: 'positive' },
  
  // Infrastructure milestones
  { indexId: 'ri-internet-speed', year: 2016, event: 'Jio launches affordable 4G', impact: 'positive' },
  { indexId: 'ri-passport', year: 2023, event: 'Visa-free access expansion', impact: 'positive' },
]


// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

async function seed() {
  console.log('🌱 Starting database seed...')
  
  try {
    // Clear existing data in reverse order of dependencies
    console.log('🗑️  Clearing existing data...')
    await db.delete(rankingEntries)
    await db.delete(milestones)
    await db.delete(rankingIndices)
    await db.delete(domains)
    await db.delete(peerGroups)
    await db.delete(countries)
    
    // Seed countries
    console.log('🌍 Seeding countries...')
    await db.insert(countries).values(countriesData)
    console.log(`   ✓ Inserted ${countriesData.length} countries`)
    
    // Seed peer groups
    console.log('👥 Seeding peer groups...')
    await db.insert(peerGroups).values(peerGroupsData)
    console.log(`   ✓ Inserted ${peerGroupsData.length} peer groups`)
    
    // Seed domains
    console.log('📁 Seeding domains...')
    await db.insert(domains).values(domainsData)
    console.log(`   ✓ Inserted ${domainsData.length} domains`)
    
    // Seed ranking indices
    console.log('📊 Seeding ranking indices...')
    await db.insert(rankingIndices).values(rankingIndicesData)
    console.log(`   ✓ Inserted ${rankingIndicesData.length} ranking indices`)
    
    // Seed milestones
    console.log('🏁 Seeding milestones...')
    const milestonesWithIds = milestonesData.map((m, i) => ({
      id: `ms-${i + 1}`,
      ...m,
    }))
    await db.insert(milestones).values(milestonesWithIds)
    console.log(`   ✓ Inserted ${milestonesWithIds.length} milestones`)
    
    // Generate and seed ranking entries
    console.log('📈 Generating ranking entries...')
    const years = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]
    const countryCodes = countriesData.map(c => c.code)
    
    let totalEntries = 0
    const batchSize = 500
    let batch: Array<typeof rankingEntries.$inferInsert> = []
    
    for (const index of rankingIndicesData) {
      // Determine which years have data for this index
      const indexYears = years.filter(y => {
        const lastUpdatedYear = index.lastUpdated.getFullYear()
        // Most indices have data from 2010, some start later
        const startYear = index.id === 'ri-ease-business' ? 2010 : 
                         index.id === 'ri-ai-readiness' ? 2017 :
                         index.id === 'ri-cyber-security' ? 2014 : 2010
        return y >= startYear && y <= lastUpdatedYear
      })
      
      // Determine total countries for this index (varies by index)
      const totalCountriesForIndex = index.id.includes('cricket') ? 12 :
                                     index.id.includes('fifa') ? 211 :
                                     index.id.includes('olympics') ? 80 :
                                     index.id.includes('pisa') ? 80 :
                                     Math.min(countryCodes.length, 180)
      
      // Select countries for this index
      const indexCountries = countryCodes.slice(0, totalCountriesForIndex)
      
      for (const year of indexYears) {
        for (const countryCode of indexCountries) {
          const rank = generateRank(
            countryCode,
            index.id,
            year,
            totalCountriesForIndex,
            index.higherIsBetter
          )
          
          const score = generateScore(
            rank,
            totalCountriesForIndex,
            index.scoreMin,
            index.scoreMax,
            index.higherIsBetter
          )
          
          const normalized = normalizeScore(
            score,
            index.scoreMin,
            index.scoreMax,
            index.higherIsBetter
          )
          
          const percentile = calculatePercentile(rank, totalCountriesForIndex)
          
          batch.push({
            id: generateId('re', index.id, countryCode, year),
            indexId: index.id,
            countryCode,
            year,
            rank,
            totalCountries: totalCountriesForIndex,
            score: Math.round(score * 100) / 100,
            normalizedScore: Math.round(normalized * 100) / 100,
            percentile: Math.round(percentile * 100) / 100,
            confidence: 'high',
          })
          
          totalEntries++
          
          // Insert in batches
          if (batch.length >= batchSize) {
            await db.insert(rankingEntries).values(batch)
            process.stdout.write(`\r   📊 Inserted ${totalEntries} ranking entries...`)
            batch = []
          }
        }
      }
    }
    
    // Insert remaining entries
    if (batch.length > 0) {
      await db.insert(rankingEntries).values(batch)
    }
    
    console.log(`\n   ✓ Inserted ${totalEntries} ranking entries`)
    
    console.log('\n✅ Database seed completed successfully!')
    console.log(`
Summary:
  - Countries: ${countriesData.length}
  - Peer Groups: ${peerGroupsData.length}
  - Domains: ${domainsData.length}
  - Ranking Indices: ${rankingIndicesData.length}
  - Milestones: ${milestonesWithIds.length}
  - Ranking Entries: ${totalEntries}
`)
    
  } catch (error) {
    console.error('❌ Seed failed:', error)
    throw error
  }
}

// Run seed
seed()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
