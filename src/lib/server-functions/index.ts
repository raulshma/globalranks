/**
 * Server functions barrel export
 */

export {
  getRankingsByCountry,
  getRankingsByDomain,
  getRankingByIndex,
  getTimeSeriesData,
} from './rankings'

export {
  getFullRankingList,
  getAllCountries,
  getCountriesByPeerGroup,
  getAllPeerGroups,
} from './countries'

export {
  searchRankingIndices,
  getFilteredRankings,
  getFilterOptions,
} from './search'

export {
  getTimeSeriesWithMetrics,
  getMilestonesForIndex,
  getTimeSeriesWithMilestones,
  calculateVelocity,
  calculateVolatility,
  determineTrend,
  detectAnomalies,
  calculateMetrics,
} from './time-series'

export type {
  Anomaly,
  TimeSeriesMetrics,
  TimeSeriesWithMetrics,
  MilestoneWithContext,
} from './time-series'

export {
  compareCountries,
  compareWithPeerGroup,
  calculateGaps,
  calculateGapTrend,
  getIndexComparison,
  getCountriesByIncomeLevel,
} from './comparison'

export {
  saveCustomIndex,
  getCustomIndex,
  getUserCustomIndices,
  updateCustomIndex,
  deleteCustomIndex,
  calculateCustomIndexScore,
} from './custom-index'

export { getDashboardData } from './dashboard'

export { getAllDomainsWithStats, getDomainWithIndices } from './domains'

export { getIndexDetail } from './index-detail'

export { getRankingsApi } from './api-rankings'
export type { RankingsQueryParams, RankingsApiResponse } from './api-rankings'

export { exportRankingsData } from './api-export'
export type { ExportFormat, ExportRequest, ExportResponse } from './api-export'

export { getAllLatestRankingsForCountry } from './country-rankings'
export type {
  LatestIndexRanking,
  DomainRankingGroup,
  CountryRankingsPageData,
} from './country-rankings'

export { submitDataReport, getReportCount } from './data-reports'
