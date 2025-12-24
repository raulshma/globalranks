/**
 * Core TypeScript types for the India Rankings Platform
 * Requirements: 1.3, 1.7, 2.4
 */

// Income level classification for countries
export type IncomeLevel = 'low' | 'lower-middle' | 'upper-middle' | 'high'

// Update frequency for ranking indices
export type UpdateFrequency = 'annual' | 'biannual' | 'quarterly'

// Confidence level for ranking entries
export type Confidence = 'high' | 'medium' | 'low'

// Trend indicator for time series
export type TrendIndicator = 'improving' | 'declining' | 'stable'

// Impact type for milestones
export type MilestoneImpact = 'positive' | 'negative' | 'neutral'

// Country type
export interface Country {
  id: string
  code: string // ISO 3166-1 alpha-3
  name: string
  region: string
  incomeLevel: IncomeLevel
  peerGroups?: Array<PeerGroup>
}

// Peer group for comparisons (BRICS, G20, etc.)
export interface PeerGroup {
  id: string
  name: string
  countryCodes: Array<string>
}

// Domain categorizing indices
export interface Domain {
  id: string
  name: string
  description: string
  icon: string
  indices?: Array<RankingIndex>
}

// Ranking index with source citations (Requirement 1.7)
export interface RankingIndex {
  id: string
  name: string
  shortName: string
  domainId: string
  source: string // Publishing organization name
  sourceUrl: string // Official source URL for citation
  methodology: string
  updateFrequency: UpdateFrequency
  scoreRange: { min: number; max: number }
  higherIsBetter: boolean
  lastUpdated: Date
  domain?: Domain
}

// Sub-metric breakdown within a ranking entry
export interface SubMetric {
  name: string
  value: number
  weight: number
  rank: number | null
}

// Ranking entry with all required fields (Requirement 1.3, 2.4)
export interface RankingEntry {
  id: string
  indexId: string
  countryCode: string
  year: number
  rank: number
  totalCountries: number
  score: number | null // Original score (nullable)
  normalizedScore: number | null // 0-100 normalized
  percentile: number // Calculated from rank and totalCountries
  confidence: Confidence
  subMetrics?: Array<SubMetric>
  index?: RankingIndex
  country?: Country
}

// Time series entry for a single year
export interface TimeSeriesEntry {
  year: number
  rank: number
  totalCountries: number
  score: number | null
  normalizedScore: number | null
  percentile: number
}

// Milestone for time-series annotations
export interface Milestone {
  id: string
  indexId: string
  year: number
  event: string
  impact: MilestoneImpact
  rankChange?: number
  source?: string
}


// Time series data with calculated metrics
export interface TimeSeriesData {
  indexId: string
  countryCode: string
  entries: Array<TimeSeriesEntry>
  trend: TrendIndicator
  velocity: number // Rate of rank change over time
  volatility: number // Standard deviation of year-over-year changes
  milestones: Array<Milestone>
}

// Custom index component with weight
export interface CustomIndexComponent {
  indexId: string
  weight: number // 0-100, must sum to 100
}

// Custom index created by users
export interface CustomIndex {
  id: string
  name: string
  userId: string
  components: Array<CustomIndexComponent>
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

// Gap analysis between countries
export interface GapAnalysis {
  indexId: string
  baseRank: number
  comparisonRank: number
  gap: number // base_rank - comparison_rank
  trend: 'converging' | 'diverging' | 'stable'
}

// Comparison data point for a single country-index combination
export interface ComparisonDataPoint {
  countryCode: string
  indexId: string
  rank: number
  score: number | null
  normalizedScore: number | null
  percentile: number
  year: number
}


// Comparison result for multiple countries
export interface ComparisonResult {
  baseCountry: string
  compareCountries: Array<string>
  indices: Array<string>
  data: Array<ComparisonDataPoint>
  gaps: Array<GapAnalysis>
}

// Filter state for rankings display
export interface FilterState {
  domain?: string
  year?: number
  yearRange?: { start: number; end: number }
  source?: string
  methodology?: string
  searchQuery?: string
}

// API response wrapper for rankings
export interface RankingsApiResponse {
  data: Array<RankingEntry>
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// API response for a single ranking with full details
export interface RankingDetailResponse {
  entry: RankingEntry
  index: RankingIndex
  country: Country
  timeSeries: TimeSeriesData
  methodology: string
  sourceCitation: {
    organization: string
    url: string
  }
}

// API response for domain overview
export interface DomainOverviewResponse {
  domain: Domain
  indices: Array<RankingIndex>
  aggregateScore: number
  bestPerforming: RankingEntry
  worstPerforming: RankingEntry
  trend: TrendIndicator
}


// Alert configuration for tracking
export interface Alert {
  id: string
  userId: string
  indexId?: string
  domainId?: string
  threshold?: number
  notifyEmail: boolean
  notifyApp: boolean
  createdAt: Date
}

// Export format options
export type ExportFormat = 'csv' | 'json' | 'excel'

// Export request configuration
export interface ExportRequest {
  format: ExportFormat
  indices?: Array<string>
  countries?: Array<string>
  yearRange?: { start: number; end: number }
  includeMethodology: boolean
  includeSourceCitations: boolean
}
