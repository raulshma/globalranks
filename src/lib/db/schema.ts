import {
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

// Countries table - stores all countries for the selector and comparisons
export const countries = sqliteTable(
  'countries',
  {
    id: text('id').primaryKey(),
    code: text('code').notNull().unique(), // ISO 3166-1 alpha-3
    name: text('name').notNull(),
    region: text('region').notNull(),
    incomeLevel: text('income_level').notNull(), // 'low' | 'lower-middle' | 'upper-middle' | 'high'
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    index('countries_region_idx').on(table.region),
    index('countries_income_level_idx').on(table.incomeLevel),
  ]
)

// Peer groups for comparison (BRICS, G20, etc.)
export const peerGroups = sqliteTable('peer_groups', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  countryCodes: text('country_codes').notNull(), // JSON array of country codes
})

// Domains categorizing indices
export const domains = sqliteTable('domains', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description').notNull(),
  icon: text('icon').notNull(),
})


// Ranking indices with source citations
export const rankingIndices = sqliteTable(
  'ranking_indices',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    shortName: text('short_name').notNull(),
    domainId: text('domain_id')
      .notNull()
      .references(() => domains.id),
    source: text('source').notNull(), // Publishing organization
    sourceUrl: text('source_url').notNull(), // Official URL for citation
    methodology: text('methodology').notNull(),
    updateFrequency: text('update_frequency').notNull(), // 'annual' | 'biannual' | 'quarterly'
    scoreMin: real('score_min').notNull(),
    scoreMax: real('score_max').notNull(),
    higherIsBetter: integer('higher_is_better', { mode: 'boolean' })
      .notNull()
      .default(true),
    lastUpdated: integer('last_updated', { mode: 'timestamp' }).notNull(),
  },
  (table) => [index('ranking_indices_domain_idx').on(table.domainId)]
)

// Ranking entries - stores ALL countries for each index/year
export const rankingEntries = sqliteTable(
  'ranking_entries',
  {
    id: text('id').primaryKey(),
    indexId: text('index_id')
      .notNull()
      .references(() => rankingIndices.id),
    countryCode: text('country_code')
      .notNull()
      .references(() => countries.code),
    year: integer('year').notNull(),
    rank: integer('rank').notNull(),
    totalCountries: integer('total_countries').notNull(),
    score: real('score'), // Original score (nullable)
    normalizedScore: real('normalized_score'), // 0-100 normalized
    percentile: real('percentile').notNull(),
    confidence: text('confidence').notNull().default('medium'), // 'high' | 'medium' | 'low'
    subMetrics: text('sub_metrics'), // JSON for sub-metric breakdown
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    uniqueIndex('ranking_entries_unique_idx').on(
      table.indexId,
      table.countryCode,
      table.year
    ),
    index('ranking_entries_country_year_idx').on(table.countryCode, table.year),
    index('ranking_entries_index_year_idx').on(table.indexId, table.year),
  ]
)


// Milestones for time-series annotations
export const milestones = sqliteTable(
  'milestones',
  {
    id: text('id').primaryKey(),
    indexId: text('index_id')
      .notNull()
      .references(() => rankingIndices.id),
    year: integer('year').notNull(),
    event: text('event').notNull(),
    impact: text('impact').notNull(), // 'positive' | 'negative' | 'neutral'
    source: text('source'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [index('milestones_index_year_idx').on(table.indexId, table.year)]
)

// Custom indices created by users
export const customIndices = sqliteTable(
  'custom_indices',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    userId: text('user_id').notNull(),
    components: text('components').notNull(), // JSON array of {indexId, weight}
    isPublic: integer('is_public', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [index('custom_indices_user_idx').on(table.userId)]
)

// Alerts for tracking
export const alerts = sqliteTable(
  'alerts',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    indexId: text('index_id'),
    domainId: text('domain_id'),
    threshold: real('threshold'),
    notifyEmail: integer('notify_email', { mode: 'boolean' })
      .notNull()
      .default(true),
    notifyApp: integer('notify_app', { mode: 'boolean' })
      .notNull()
      .default(true),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [index('alerts_user_idx').on(table.userId)]
)


// Relations for Drizzle query builder
export const countriesRelations = relations(countries, ({ many }) => ({
  rankings: many(rankingEntries),
}))

export const domainsRelations = relations(domains, ({ many }) => ({
  indices: many(rankingIndices),
}))

export const rankingIndicesRelations = relations(
  rankingIndices,
  ({ one, many }) => ({
    domain: one(domains, {
      fields: [rankingIndices.domainId],
      references: [domains.id],
    }),
    entries: many(rankingEntries),
    milestones: many(milestones),
  })
)

export const rankingEntriesRelations = relations(rankingEntries, ({ one }) => ({
  index: one(rankingIndices, {
    fields: [rankingEntries.indexId],
    references: [rankingIndices.id],
  }),
  country: one(countries, {
    fields: [rankingEntries.countryCode],
    references: [countries.code],
  }),
}))

export const milestonesRelations = relations(milestones, ({ one }) => ({
  index: one(rankingIndices, {
    fields: [milestones.indexId],
    references: [rankingIndices.id],
  }),
}))

export const customIndicesRelations = relations(customIndices, () => ({}))

export const alertsRelations = relations(alerts, () => ({}))

export const peerGroupsRelations = relations(peerGroups, () => ({}))
