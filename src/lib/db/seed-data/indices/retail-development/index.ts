/**
 * Global Retail Development Index Data
 * Source: Kearney (formerly A.T. Kearney) - GRDI
 * https://www.kearney.com/global-retail-development-index
 */

import { retailDevelopmentRankings2017 } from './2017'
import { retailDevelopmentRankings2019 } from './2019'
import { retailDevelopmentRankings2023 } from './2023'

export const retailDevelopmentIndex = {
  id: 'ri-grdi',
  name: 'Global Retail Development Index',
  shortName: 'GRDI',
  domainId: 'd-economy',
  source: 'Kearney',
  sourceUrl: 'https://www.kearney.com/global-retail-development-index',
  methodology:
    'Ranks top 30 developing countries for retail investment based on market attractiveness (25%), country risk (25%), market saturation (25%), and time pressure (25%). Evaluates retail market opportunities using economic indicators from EIU, IMF, Planet Retail, Euromoney, World Bank, and other sources.',
  updateFrequency: 'annual',
  scoreMin: 0,
  scoreMax: 100,
  higherIsBetter: true,
  lastUpdated: new Date('2024-02-22'),
}

// Combined rankings for seeding
export const retailDevelopmentRankings = [
  ...retailDevelopmentRankings2023,
  ...retailDevelopmentRankings2019,
  ...retailDevelopmentRankings2017,
]

export const totalCountries = 30

// Re-export year-specific data for direct access
export { retailDevelopmentRankings2017 } from './2017'
export { retailDevelopmentRankings2019 } from './2019'
export { retailDevelopmentRankings2023 } from './2023'
