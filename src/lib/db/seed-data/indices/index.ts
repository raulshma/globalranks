/**
 * Index exports for all ranking indices
 * Each index file contains:
 * - Index metadata (id, name, source, methodology, etc.)
 * - Rankings data (country code, rank, year, score/value)
 * - Total countries covered
 */

import { populationIndex, populationRankings, totalCountries as populationTotal } from './population'
import { giiIndex, giiRankings, totalCountries as giiTotal } from './gii'
import { hdiIndex, hdiRankings, totalCountries as hdiTotal } from './hdi'
import { cpiIndex, cpiRankings, totalCountries as cpiTotal } from './cpi'
import { gdpPerCapitaIndex, gdpPerCapitaRankings, totalCountries as gdpTotal } from './gdp-per-capita'
import { epiIndex, epiRankings, totalCountries as epiTotal } from './epi'
import { happinessIndex, happinessRankings, totalCountries as happinessTotal } from './happiness'
import { democracyIndex, democracyRankings, totalCountries as democracyTotal } from './democracy'
import { pressFreedomIndex, pressFreedomRankings, totalCountries as pressFreedomTotal } from './press-freedom'
import { gfpIndex, gfpRankings, totalCountries as gfpTotal } from './gfp'
import { fifaIndex, fifaRankings, totalCountries as fifaTotal } from './fifa'
import { gdpNominalIndex, gdpNominalRankings, totalCountries as gdpNominalTotal } from './gdp-nominal'
import { passportIndex, passportRankings, totalCountries as passportTotal } from './passport'
import { literacyIndex, literacyRankings, totalCountries as literacyTotal } from './literacy'
import { easeOfBusinessIndex, easeOfBusinessRankings, totalCountries as easeOfBusinessTotal } from './ease-of-business'
import { gciIndex, gciRankings, totalCountries as gciTotal } from './gci'
// New indices
import { globalPeaceIndex, globalPeaceRankings, totalCountries as globalPeaceTotal } from './global-peace'
import { globalHungerIndex, globalHungerRankings, totalCountries as globalHungerTotal } from './global-hunger'
import { genderGapIndex, genderGapRankings, totalCountries as genderGapTotal } from './gender-gap'
import { ruleOfLawIndex, ruleOfLawRankings, totalCountries as ruleOfLawTotal } from './rule-of-law'
import { eGovernmentIndex, eGovernmentRankings, totalCountries as eGovernmentTotal } from './e-government'
import { globalTerrorismIndex, globalTerrorismRankings, totalCountries as globalTerrorismTotal } from './global-terrorism'
import { climatePerformanceIndex, climatePerformanceRankings, totalCountries as climatePerformanceTotal } from './climate-performance'
import { networkReadinessIndex, networkReadinessRankings, totalCountries as networkReadinessTotal } from './network-readiness'
import { economicFreedomIndex, economicFreedomRankings, totalCountries as economicFreedomTotal } from './economic-freedom'
import { ictDevelopmentIndex, ictDevelopmentRankings, totalCountries as ictDevelopmentTotal } from './ict-development'

// Re-export individual index data
export { populationIndex, populationRankings } from './population'
export { giiIndex, giiRankings } from './gii'
export { hdiIndex, hdiRankings } from './hdi'
export { cpiIndex, cpiRankings } from './cpi'
export { gdpPerCapitaIndex, gdpPerCapitaRankings } from './gdp-per-capita'
export { epiIndex, epiRankings } from './epi'
export { happinessIndex, happinessRankings } from './happiness'
export { democracyIndex, democracyRankings } from './democracy'
export { pressFreedomIndex, pressFreedomRankings } from './press-freedom'
export { gfpIndex, gfpRankings } from './gfp'
export { fifaIndex, fifaRankings } from './fifa'
export { gdpNominalIndex, gdpNominalRankings } from './gdp-nominal'
export { passportIndex, passportRankings } from './passport'
export { literacyIndex, literacyRankings } from './literacy'
export { easeOfBusinessIndex, easeOfBusinessRankings } from './ease-of-business'
export { gciIndex, gciRankings } from './gci'
// New exports
export { globalPeaceIndex, globalPeaceRankings } from './global-peace'
export { globalHungerIndex, globalHungerRankings } from './global-hunger'
export { genderGapIndex, genderGapRankings } from './gender-gap'
export { ruleOfLawIndex, ruleOfLawRankings } from './rule-of-law'
export { eGovernmentIndex, eGovernmentRankings } from './e-government'
export { globalTerrorismIndex, globalTerrorismRankings } from './global-terrorism'
export { climatePerformanceIndex, climatePerformanceRankings } from './climate-performance'
export { networkReadinessIndex, networkReadinessRankings } from './network-readiness'
export { economicFreedomIndex, economicFreedomRankings } from './economic-freedom'
export { ictDevelopmentIndex, ictDevelopmentRankings } from './ict-development'

// All index metadata
export const allIndices = [
  populationIndex,
  giiIndex,
  hdiIndex,
  cpiIndex,
  gdpPerCapitaIndex,
  epiIndex,
  happinessIndex,
  democracyIndex,
  pressFreedomIndex,
  gfpIndex,
  fifaIndex,
  gdpNominalIndex,
  passportIndex,
  literacyIndex,
  easeOfBusinessIndex,
  gciIndex,
  // New indices
  globalPeaceIndex,
  globalHungerIndex,
  genderGapIndex,
  ruleOfLawIndex,
  eGovernmentIndex,
  globalTerrorismIndex,
  climatePerformanceIndex,
  networkReadinessIndex,
  economicFreedomIndex,
  ictDevelopmentIndex,
]

// All rankings data with their index info
export const allRankingsData = [
  { index: populationIndex, rankings: populationRankings, totalCountries: populationTotal, valueField: 'value' as const },
  { index: giiIndex, rankings: giiRankings, totalCountries: giiTotal, valueField: 'score' as const },
  { index: hdiIndex, rankings: hdiRankings, totalCountries: hdiTotal, valueField: 'score' as const },
  { index: cpiIndex, rankings: cpiRankings, totalCountries: cpiTotal, valueField: 'score' as const },
  { index: gdpPerCapitaIndex, rankings: gdpPerCapitaRankings, totalCountries: gdpTotal, valueField: 'value' as const },
  { index: epiIndex, rankings: epiRankings, totalCountries: epiTotal, valueField: 'score' as const },
  { index: happinessIndex, rankings: happinessRankings, totalCountries: happinessTotal, valueField: 'score' as const },
  { index: democracyIndex, rankings: democracyRankings, totalCountries: democracyTotal, valueField: 'score' as const },
  { index: pressFreedomIndex, rankings: pressFreedomRankings, totalCountries: pressFreedomTotal, valueField: 'score' as const },
  { index: gfpIndex, rankings: gfpRankings, totalCountries: gfpTotal, valueField: 'score' as const },
  { index: fifaIndex, rankings: fifaRankings, totalCountries: fifaTotal, valueField: 'score' as const },
  { index: gdpNominalIndex, rankings: gdpNominalRankings, totalCountries: gdpNominalTotal, valueField: 'value' as const },
  { index: passportIndex, rankings: passportRankings, totalCountries: passportTotal, valueField: 'score' as const },
  { index: literacyIndex, rankings: literacyRankings, totalCountries: literacyTotal, valueField: 'score' as const },
  { index: easeOfBusinessIndex, rankings: easeOfBusinessRankings, totalCountries: easeOfBusinessTotal, valueField: 'score' as const },
  { index: gciIndex, rankings: gciRankings, totalCountries: gciTotal, valueField: 'score' as const },
  // New indices data
  { index: globalPeaceIndex, rankings: globalPeaceRankings, totalCountries: globalPeaceTotal, valueField: 'score' as const },
  { index: globalHungerIndex, rankings: globalHungerRankings, totalCountries: globalHungerTotal, valueField: 'score' as const },
  { index: genderGapIndex, rankings: genderGapRankings, totalCountries: genderGapTotal, valueField: 'score' as const },
  { index: ruleOfLawIndex, rankings: ruleOfLawRankings, totalCountries: ruleOfLawTotal, valueField: 'score' as const },
  { index: eGovernmentIndex, rankings: eGovernmentRankings, totalCountries: eGovernmentTotal, valueField: 'score' as const },
  { index: globalTerrorismIndex, rankings: globalTerrorismRankings, totalCountries: globalTerrorismTotal, valueField: 'score' as const },
  { index: climatePerformanceIndex, rankings: climatePerformanceRankings, totalCountries: climatePerformanceTotal, valueField: 'score' as const },
  { index: networkReadinessIndex, rankings: networkReadinessRankings, totalCountries: networkReadinessTotal, valueField: 'score' as const },
  { index: economicFreedomIndex, rankings: economicFreedomRankings, totalCountries: economicFreedomTotal, valueField: 'score' as const },
  { index: ictDevelopmentIndex, rankings: ictDevelopmentRankings, totalCountries: ictDevelopmentTotal, valueField: 'score' as const },
]
