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
import { humanCapitalIndex, humanCapitalRankings, totalCountries as humanCapitalTotal } from './human-capital-index'
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

import { sdgIndex, sdgRankings, totalCountries as sdgTotal } from './sdg-index'
import { logisticsPerformanceIndex, logisticsPerformanceRankings, totalCountries as logisticsTotal } from './logistics-performance'
import { travelTourismIndex, travelTourismRankings, totalCountries as travelTourismTotal } from './travel-tourism'
import { worldCompetitivenessIndex, worldCompetitivenessRankings, totalCountries as worldCompetitivenessTotal } from './world-competitiveness'
import { fragileStatesIndex, fragileStatesRankings, totalCountries as fragileStatesTotal } from './fragile-states'
import { airQualityIndex, airQualityRankings, totalCountries as airQualityTotal } from './air-quality'
import { socialProgressIndex, socialProgressRankings, totalCountries as socialProgressTotal } from './social-progress'
import { energyTransitionIndex, energyTransitionRankings, totalCountries as energyTransitionTotal } from './energy-transition'
import { goodCountryIndex, goodCountryRankings, totalCountries as goodCountryTotal } from './good-country'

// New indices - December 2025
import { cybersecurityIndex, cybersecurityRankings, totalCountries as cybersecurityTotal } from './cybersecurity'
import { foodSecurityIndex, foodSecurityRankings, totalCountries as foodSecurityTotal } from './food-security'
import { povertyMpiIndex, povertyMpiRankings, totalCountries as povertyMpiTotal } from './poverty-mpi'
import { inequalityCriIndex, inequalityCriRankings, totalCountries as inequalityCriTotal } from './inequality-cri'
import { openBudgetIndex, openBudgetRankings, totalCountries as openBudgetTotal } from './open-budget'
import { talentRankingIndex, talentRankingRankings, totalCountries as talentRankingTotal } from './talent-ranking'
import { givingIndex, givingIndexRankings, totalCountries as givingTotal } from './giving-index'
import { liveabilityIndex, liveabilityRankings, totalCountries as liveabilityTotal } from './liveability'

// More new indices - December 2025
import { prosperityIndex, prosperityRankings, totalCountries as prosperityTotal } from './prosperity-index'
import { qualityOfLifeIndex, qualityOfLifeRankings, totalCountries as qualityOfLifeTotal } from './quality-of-life'
import { ipIndex, ipIndexRankings, totalCountries as ipTotal } from './ip-index'
import { digitalQualityOfLifeIndex, digitalQualityOfLifeRankings, totalCountries as digitalQualityOfLifeTotal } from './digital-quality-of-life'
import { modernSlaveryIndex, modernSlaveryRankings, totalCountries as modernSlaveryTotal } from './modern-slavery'

// Re-export individual index data
export { populationIndex, populationRankings } from './population'
export { giiIndex, giiRankings } from './gii'
export { hdiIndex, hdiRankings } from './hdi'
export { humanCapitalIndex, humanCapitalRankings } from './human-capital-index'
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

export { sdgIndex, sdgRankings } from './sdg-index'
export { logisticsPerformanceIndex, logisticsPerformanceRankings } from './logistics-performance'
export { travelTourismIndex, travelTourismRankings } from './travel-tourism'
export { worldCompetitivenessIndex, worldCompetitivenessRankings } from './world-competitiveness'
export { fragileStatesIndex, fragileStatesRankings } from './fragile-states'
export { airQualityIndex, airQualityRankings } from './air-quality'
export { socialProgressIndex, socialProgressRankings } from './social-progress'
export { energyTransitionIndex, energyTransitionRankings } from './energy-transition'
export { goodCountryIndex, goodCountryRankings } from './good-country'

// New exports - December 2025
export { cybersecurityIndex, cybersecurityRankings } from './cybersecurity'
export { foodSecurityIndex, foodSecurityRankings } from './food-security'
export { povertyMpiIndex, povertyMpiRankings } from './poverty-mpi'
export { inequalityCriIndex, inequalityCriRankings } from './inequality-cri'
export { openBudgetIndex, openBudgetRankings } from './open-budget'
export { talentRankingIndex, talentRankingRankings } from './talent-ranking'
export { givingIndex, givingIndexRankings } from './giving-index'
export { liveabilityIndex, liveabilityRankings } from './liveability'

// More new exports - December 2025
export { prosperityIndex, prosperityRankings } from './prosperity-index'
export { qualityOfLifeIndex, qualityOfLifeRankings } from './quality-of-life'
export { ipIndex, ipIndexRankings } from './ip-index'
export { digitalQualityOfLifeIndex, digitalQualityOfLifeRankings } from './digital-quality-of-life'
export { modernSlaveryIndex, modernSlaveryRankings } from './modern-slavery'

// All index metadata
export const allIndices = [
  populationIndex,
  giiIndex,
  hdiIndex,
  humanCapitalIndex,
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
  // Additional indices
  sdgIndex,
  logisticsPerformanceIndex,
  travelTourismIndex,
  worldCompetitivenessIndex,
  fragileStatesIndex,
  // Air Quality and sustainability indices
  airQualityIndex,
  socialProgressIndex,
  energyTransitionIndex,
  goodCountryIndex,
  // New indices - December 2025
  cybersecurityIndex,
  foodSecurityIndex,
  povertyMpiIndex,
  inequalityCriIndex,
  openBudgetIndex,
  talentRankingIndex,
  givingIndex,
  liveabilityIndex,
  // More new indices - December 2025
  prosperityIndex,
  qualityOfLifeIndex,
  ipIndex,
  digitalQualityOfLifeIndex,
  modernSlaveryIndex,
]

// All rankings data with their index info
export const allRankingsData = [
  { index: populationIndex, rankings: populationRankings, totalCountries: populationTotal, valueField: 'value' as const },
  { index: giiIndex, rankings: giiRankings, totalCountries: giiTotal, valueField: 'score' as const },
  { index: hdiIndex, rankings: hdiRankings, totalCountries: hdiTotal, valueField: 'score' as const },
  { index: humanCapitalIndex, rankings: humanCapitalRankings, totalCountries: humanCapitalTotal, valueField: 'score' as const },
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
  // Additional indices data
  { index: sdgIndex, rankings: sdgRankings, totalCountries: sdgTotal, valueField: 'score' as const },
  { index: logisticsPerformanceIndex, rankings: logisticsPerformanceRankings, totalCountries: logisticsTotal, valueField: 'score' as const },
  { index: travelTourismIndex, rankings: travelTourismRankings, totalCountries: travelTourismTotal, valueField: 'score' as const },
  { index: worldCompetitivenessIndex, rankings: worldCompetitivenessRankings, totalCountries: worldCompetitivenessTotal, valueField: 'score' as const },
  { index: fragileStatesIndex, rankings: fragileStatesRankings, totalCountries: fragileStatesTotal, valueField: 'score' as const },
  // Air Quality and sustainability indices
  { index: airQualityIndex, rankings: airQualityRankings, totalCountries: airQualityTotal, valueField: 'score' as const },
  { index: socialProgressIndex, rankings: socialProgressRankings, totalCountries: socialProgressTotal, valueField: 'score' as const },
  { index: energyTransitionIndex, rankings: energyTransitionRankings, totalCountries: energyTransitionTotal, valueField: 'score' as const },
  { index: goodCountryIndex, rankings: goodCountryRankings, totalCountries: goodCountryTotal, valueField: 'score' as const },
  // New indices data - December 2025
  { index: cybersecurityIndex, rankings: cybersecurityRankings, totalCountries: cybersecurityTotal, valueField: 'score' as const },
  { index: foodSecurityIndex, rankings: foodSecurityRankings, totalCountries: foodSecurityTotal, valueField: 'score' as const },
  { index: povertyMpiIndex, rankings: povertyMpiRankings, totalCountries: povertyMpiTotal, valueField: 'score' as const },
  { index: inequalityCriIndex, rankings: inequalityCriRankings, totalCountries: inequalityCriTotal, valueField: 'score' as const },
  { index: openBudgetIndex, rankings: openBudgetRankings, totalCountries: openBudgetTotal, valueField: 'score' as const },
  { index: talentRankingIndex, rankings: talentRankingRankings, totalCountries: talentRankingTotal, valueField: 'score' as const },
  { index: givingIndex, rankings: givingIndexRankings, totalCountries: givingTotal, valueField: 'score' as const },
  { index: liveabilityIndex, rankings: liveabilityRankings, totalCountries: liveabilityTotal, valueField: 'score' as const },
  // More new indices data - December 2025
  { index: prosperityIndex, rankings: prosperityRankings, totalCountries: prosperityTotal, valueField: 'score' as const },
  { index: qualityOfLifeIndex, rankings: qualityOfLifeRankings, totalCountries: qualityOfLifeTotal, valueField: 'score' as const },
  { index: ipIndex, rankings: ipIndexRankings, totalCountries: ipTotal, valueField: 'score' as const },
  { index: digitalQualityOfLifeIndex, rankings: digitalQualityOfLifeRankings, totalCountries: digitalQualityOfLifeTotal, valueField: 'score' as const },
  { index: modernSlaveryIndex, rankings: modernSlaveryRankings, totalCountries: modernSlaveryTotal, valueField: 'score' as const },
]
