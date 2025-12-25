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

// Additional new indices - December 2025
import { softPowerIndex, softPowerRankings, totalCountries as softPowerTotal } from './soft-power'
import { worldRiskIndex, worldRiskRankings, totalCountries as worldRiskTotal } from './world-risk'
import { natureConservationIndex, natureConservationRankings, totalCountries as natureConservationTotal } from './nature-conservation'
import { futurePossibilitiesIndex, futurePossibilitiesRankings, totalCountries as futurePossibilitiesTotal } from './future-possibilities'
import { globalHealthIndex, globalHealthRankings, totalCountries as globalHealthTotal } from './global-health'
import { renewableEnergyIndex, renewableEnergyRankings, totalCountries as renewableEnergyTotal } from './renewable-energy'

// New indices - December 2025 (batch 2)
import { remittancesIndex, remittancesRankings, totalCountries as remittancesTotal } from './remittances'
import { financialCentresIndex, financialCentresRankings, totalCountries as financialCentresTotal } from './financial-centres'
import { futureSkillsIndex, futureSkillsRankings, totalCountries as futureSkillsTotal } from './future-skills'
import { worldTalentIndex, worldTalentRankings, totalCountries as worldTalentTotal } from './world-talent'
import { armsImportsIndex, armsImportsRankings, totalCountries as armsImportsTotal } from './arms-imports'
import { startupEcosystemIndex, startupEcosystemRankings, totalCountries as startupEcosystemTotal } from './startup-ecosystem'
import { internetFreedomIndex, internetFreedomRankings, totalCountries as internetFreedomTotal } from './internet-freedom'

// New indices - December 2025 (batch 3)
import { fdiConfidenceIndex, fdiConfidenceRankings, totalCountries as fdiConfidenceTotal } from './fdi-confidence'
import { patentFilingsIndex, patentFilingsRankings, totalCountries as patentFilingsTotal } from './patent-filings'
import { retailDevelopmentIndex, retailDevelopmentRankings, totalCountries as retailDevelopmentTotal } from './retail-development'
import { happyPlanetIndex, happyPlanetRankings, totalCountries as happyPlanetTotal } from './happy-planet'
import { digitalCompetitivenessIndex, digitalCompetitivenessRankings, totalCountries as digitalCompetitivenessTotal } from './digital-competitiveness'
import { entrepreneurshipIndex, entrepreneurshipRankings, totalCountries as entrepreneurshipTotal } from './entrepreneurship'

// New indices - December 2025 (batch 4)
import { englishProficiencyIndex, englishProficiencyRankings, totalCountries as englishProficiencyTotal } from './english-proficiency'
import { pensionIndex, pensionRankings, totalCountries as pensionTotal } from './pension-index'
import { womenPeaceSecurityIndex, womenPeaceSecurityRankings, totalCountries as wpsTotal } from './women-peace-security'
import { eliteSportIndex, eliteSportRankings, totalCountries as eliteSportTotal } from './elite-sport'
import { kidsRightsIndex, kidsRightsRankings, totalCountries as kidsRightsTotal } from './kidsrights-index'
import { childClimateRiskIndex, childClimateRiskRankings, totalCountries as childClimateRiskTotal } from './child-climate-risk'

// New indices - December 2025 (batch 5)
import { globalKnowledgeIndex, globalKnowledgeRankings, totalCountries as globalKnowledgeTotal } from './global-knowledge'
import { globalisationIndex, globalisationRankings, totalCountries as globalisationTotal } from './globalisation-index'
import { climateRiskIndex, climateRiskRankings, totalCountries as climateRiskTotal } from './climate-risk'
import { militaryExpenditureIndex, militaryExpenditureRankings, totalCountries as militaryExpenditureTotal } from './military-expenditure'
import { hockeyRankingsIndex, hockeyRankings, totalCountries as hockeyTotal } from './hockey-rankings'
import { cricketOdiRankingsIndex, cricketOdiRankings, totalCountries as cricketOdiTotal } from './cricket-odi-rankings'
import { cricketT20RankingsIndex, cricketT20Rankings, totalCountries as cricketT20Total } from './cricket-t20-rankings'
import { cricketTestRankingsIndex, cricketTestRankings, totalCountries as cricketTestTotal } from './cricket-test-rankings'
import { chessCountryRankingsIndex, chessCountryRankings, totalCountries as chessCountryTotal } from './chess-country-rankings'
import { lifeExpectancyIndex, lifeExpectancyRankings, totalCountries as lifeExpectancyTotal } from './life-expectancy'
import { realGdpGrowthIndex, realGdpGrowthRankings, totalCountries as realGdpGrowthTotal } from './real-gdp-growth'

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

// Additional new exports - December 2025
export { softPowerIndex, softPowerRankings } from './soft-power'
export { worldRiskIndex, worldRiskRankings } from './world-risk'
export { natureConservationIndex, natureConservationRankings } from './nature-conservation'
export { futurePossibilitiesIndex, futurePossibilitiesRankings } from './future-possibilities'
export { globalHealthIndex, globalHealthRankings } from './global-health'
export { renewableEnergyIndex, renewableEnergyRankings } from './renewable-energy'

// New exports - December 2025 (batch 2)
export { remittancesIndex, remittancesRankings } from './remittances'
export { financialCentresIndex, financialCentresRankings } from './financial-centres'
export { futureSkillsIndex, futureSkillsRankings } from './future-skills'
export { worldTalentIndex, worldTalentRankings } from './world-talent'
export { armsImportsIndex, armsImportsRankings } from './arms-imports'
export { startupEcosystemIndex, startupEcosystemRankings } from './startup-ecosystem'
export { internetFreedomIndex, internetFreedomRankings } from './internet-freedom'

// New exports - December 2025 (batch 3)
export { fdiConfidenceIndex, fdiConfidenceRankings } from './fdi-confidence'
export { patentFilingsIndex, patentFilingsRankings } from './patent-filings'
export { retailDevelopmentIndex, retailDevelopmentRankings, retailDevelopmentRankings2017, retailDevelopmentRankings2019, retailDevelopmentRankings2023 } from './retail-development'
export { happyPlanetIndex, happyPlanetRankings } from './happy-planet'
export { digitalCompetitivenessIndex, digitalCompetitivenessRankings } from './digital-competitiveness'
export { entrepreneurshipIndex, entrepreneurshipRankings } from './entrepreneurship'

// New exports - December 2025 (batch 4)
export { englishProficiencyIndex, englishProficiencyRankings } from './english-proficiency'
export { pensionIndex, pensionRankings } from './pension-index'
export { womenPeaceSecurityIndex, womenPeaceSecurityRankings } from './women-peace-security'
export { eliteSportIndex, eliteSportRankings } from './elite-sport'
export { kidsRightsIndex, kidsRightsRankings } from './kidsrights-index'
export { childClimateRiskIndex, childClimateRiskRankings } from './child-climate-risk'

// New exports - December 2025 (batch 5)
export { globalKnowledgeIndex, globalKnowledgeRankings } from './global-knowledge'
export { globalisationIndex, globalisationRankings } from './globalisation-index'
export { climateRiskIndex, climateRiskRankings } from './climate-risk'
export { militaryExpenditureIndex, militaryExpenditureRankings } from './military-expenditure'
export { hockeyRankingsIndex, hockeyRankings } from './hockey-rankings'
export { cricketOdiRankingsIndex, cricketOdiRankings } from './cricket-odi-rankings'
export { cricketT20RankingsIndex, cricketT20Rankings } from './cricket-t20-rankings'
export { cricketTestRankingsIndex, cricketTestRankings } from './cricket-test-rankings'
export { chessCountryRankingsIndex, chessCountryRankings } from './chess-country-rankings'
export { lifeExpectancyIndex, lifeExpectancyRankings } from './life-expectancy'
export { realGdpGrowthIndex, realGdpGrowthRankings } from './real-gdp-growth'

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
  // Additional new indices - December 2025
  softPowerIndex,
  worldRiskIndex,
  natureConservationIndex,
  futurePossibilitiesIndex,
  globalHealthIndex,
  renewableEnergyIndex,
  // New indices - December 2025 (batch 2)
  remittancesIndex,
  financialCentresIndex,
  futureSkillsIndex,
  worldTalentIndex,
  armsImportsIndex,
  startupEcosystemIndex,
  internetFreedomIndex,
  // New indices - December 2025 (batch 3)
  fdiConfidenceIndex,
  patentFilingsIndex,
  retailDevelopmentIndex,
  happyPlanetIndex,
  digitalCompetitivenessIndex,
  entrepreneurshipIndex,
  // New indices - December 2025 (batch 4)
  englishProficiencyIndex,
  pensionIndex,
  womenPeaceSecurityIndex,
  eliteSportIndex,
  kidsRightsIndex,
  childClimateRiskIndex,
  // New indices - December 2025 (batch 5)
  globalKnowledgeIndex,
  globalisationIndex,
  climateRiskIndex,
  militaryExpenditureIndex,
  hockeyRankingsIndex,
  cricketOdiRankingsIndex,
  cricketT20RankingsIndex,
  cricketTestRankingsIndex,
  chessCountryRankingsIndex,
  lifeExpectancyIndex,
  realGdpGrowthIndex,
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
  // Additional new indices data - December 2025
  { index: softPowerIndex, rankings: softPowerRankings, totalCountries: softPowerTotal, valueField: 'score' as const },
  { index: worldRiskIndex, rankings: worldRiskRankings, totalCountries: worldRiskTotal, valueField: 'score' as const },
  { index: natureConservationIndex, rankings: natureConservationRankings, totalCountries: natureConservationTotal, valueField: 'score' as const },
  { index: futurePossibilitiesIndex, rankings: futurePossibilitiesRankings, totalCountries: futurePossibilitiesTotal, valueField: 'score' as const },
  { index: globalHealthIndex, rankings: globalHealthRankings, totalCountries: globalHealthTotal, valueField: 'score' as const },
  { index: renewableEnergyIndex, rankings: renewableEnergyRankings, totalCountries: renewableEnergyTotal, valueField: 'score' as const },
  // New indices data - December 2025 (batch 2)
  { index: remittancesIndex, rankings: remittancesRankings, totalCountries: remittancesTotal, valueField: 'score' as const },
  { index: financialCentresIndex, rankings: financialCentresRankings, totalCountries: financialCentresTotal, valueField: 'score' as const },
  { index: futureSkillsIndex, rankings: futureSkillsRankings, totalCountries: futureSkillsTotal, valueField: 'score' as const },
  { index: worldTalentIndex, rankings: worldTalentRankings, totalCountries: worldTalentTotal, valueField: 'score' as const },
  { index: armsImportsIndex, rankings: armsImportsRankings, totalCountries: armsImportsTotal, valueField: 'score' as const },
  { index: startupEcosystemIndex, rankings: startupEcosystemRankings, totalCountries: startupEcosystemTotal, valueField: 'score' as const },
  { index: internetFreedomIndex, rankings: internetFreedomRankings, totalCountries: internetFreedomTotal, valueField: 'score' as const },
  // New indices data - December 2025 (batch 3)
  { index: fdiConfidenceIndex, rankings: fdiConfidenceRankings, totalCountries: fdiConfidenceTotal, valueField: 'score' as const },
  { index: patentFilingsIndex, rankings: patentFilingsRankings, totalCountries: patentFilingsTotal, valueField: 'score' as const },
  { index: retailDevelopmentIndex, rankings: retailDevelopmentRankings, totalCountries: retailDevelopmentTotal, valueField: 'score' as const },
  { index: happyPlanetIndex, rankings: happyPlanetRankings, totalCountries: happyPlanetTotal, valueField: 'score' as const },
  { index: digitalCompetitivenessIndex, rankings: digitalCompetitivenessRankings, totalCountries: digitalCompetitivenessTotal, valueField: 'score' as const },
  { index: entrepreneurshipIndex, rankings: entrepreneurshipRankings, totalCountries: entrepreneurshipTotal, valueField: 'score' as const },
  // New indices data - December 2025 (batch 4)
  { index: englishProficiencyIndex, rankings: englishProficiencyRankings, totalCountries: englishProficiencyTotal, valueField: 'score' as const },
  { index: pensionIndex, rankings: pensionRankings, totalCountries: pensionTotal, valueField: 'score' as const },
  { index: womenPeaceSecurityIndex, rankings: womenPeaceSecurityRankings, totalCountries: wpsTotal, valueField: 'score' as const },
  { index: eliteSportIndex, rankings: eliteSportRankings, totalCountries: eliteSportTotal, valueField: 'score' as const },
  { index: kidsRightsIndex, rankings: kidsRightsRankings, totalCountries: kidsRightsTotal, valueField: 'score' as const },
  { index: childClimateRiskIndex, rankings: childClimateRiskRankings, totalCountries: childClimateRiskTotal, valueField: 'score' as const },
  // New indices data - December 2025 (batch 5)
  { index: globalKnowledgeIndex, rankings: globalKnowledgeRankings, totalCountries: globalKnowledgeTotal, valueField: 'score' as const },
  { index: globalisationIndex, rankings: globalisationRankings, totalCountries: globalisationTotal, valueField: 'score' as const },
  { index: climateRiskIndex, rankings: climateRiskRankings, totalCountries: climateRiskTotal, valueField: 'score' as const },
  { index: militaryExpenditureIndex, rankings: militaryExpenditureRankings, totalCountries: militaryExpenditureTotal, valueField: 'score' as const },
  { index: hockeyRankingsIndex, rankings: hockeyRankings, totalCountries: hockeyTotal, valueField: 'score' as const },
  { index: cricketOdiRankingsIndex, rankings: cricketOdiRankings, totalCountries: cricketOdiTotal, valueField: 'score' as const },
  { index: cricketT20RankingsIndex, rankings: cricketT20Rankings, totalCountries: cricketT20Total, valueField: 'score' as const },
  { index: cricketTestRankingsIndex, rankings: cricketTestRankings, totalCountries: cricketTestTotal, valueField: 'score' as const },
  { index: chessCountryRankingsIndex, rankings: chessCountryRankings, totalCountries: chessCountryTotal, valueField: 'score' as const },
  { index: lifeExpectancyIndex, rankings: lifeExpectancyRankings, totalCountries: lifeExpectancyTotal, valueField: 'score' as const },
  { index: realGdpGrowthIndex, rankings: realGdpGrowthRankings, totalCountries: realGdpGrowthTotal, valueField: 'score' as const },
]
