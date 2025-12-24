/**
 * World Risk Index Data
 * Source: Bündnis Entwicklung Hilft & IFHV - WorldRiskReport
 * https://weltrisikobericht.de/
 * Higher score = higher disaster risk. Rankings are 1 (highest risk) to 193 (lowest risk)
 */

import { worldRiskRankings2023 } from './2023'
import { worldRiskRankings2024 } from './2024'
import { worldRiskRankings2025 } from './2025'

export const worldRiskIndex = {
  id: 'ri-world-risk',
  name: 'World Risk Index',
  shortName: 'WRI',
  domainId: 'd-environment',
  source: 'Bündnis Entwicklung Hilft & Institute for International Law of Peace and Armed Conflict (IFHV)',
  sourceUrl: 'https://weltrisikobericht.de/',
  methodology:
    'Assesses disaster risk for 193 countries based on exposure to climate-related hazards, susceptibility of the population, and coping and adaptive capacities of communities. Calculated from 25+ indicators covering natural hazard exposure, vulnerability, lack of coping capacity, and lack of adaptive capacities.',
  updateFrequency: 'annual',
  scoreMin: 0,
  scoreMax: 100,
  higherIsBetter: false,
  lastUpdated: new Date('2025-01-01'),
}

// Combined rankings for seeding
export const worldRiskRankings = [...worldRiskRankings2025, ...worldRiskRankings2024, ...worldRiskRankings2023]

export const totalCountries = 193

// Re-export year-specific data for direct access
export { worldRiskRankings2023 } from './2023'
export { worldRiskRankings2024 } from './2024'
export { worldRiskRankings2025 } from './2025'
