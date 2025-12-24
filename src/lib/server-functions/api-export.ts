/**
 * Data Export Server Function
 * Requirements: 10.1, 10.3
 *
 * Provides data export functionality with:
 * - CSV, JSON, Excel formats
 * - Methodology and source citations included
 */

import { createServerFn } from '@tanstack/react-start'
import { and, asc, desc, eq, inArray, sql } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/lib/db'
import { countries, domains, rankingEntries, rankingIndices } from '@/lib/db/schema'
import { createRateLimitError, rateLimiters } from '@/lib/rate-limit'

// Export format types
export type ExportFormat = 'csv' | 'json' | 'excel'

// Validation schema for export request
const exportRequestSchema = z.object({
  format: z.enum(['csv', 'json', 'excel']),
  indices: z.array(z.string()).optional(),
  countries: z.array(z.string().length(3)).optional(),
  yearStart: z.number().optional(),
  yearEnd: z.number().optional(),
  includeMethodology: z.boolean().default(true),
  includeSourceCitations: z.boolean().default(true),
  clientId: z.string().optional(),
})

export type ExportRequest = z.infer<typeof exportRequestSchema>

// Export data row structure
interface ExportRow {
  countryCode: string
  countryName: string
  region: string
  incomeLevel: string
  indexId: string
  indexName: string
  indexShortName: string
  domain: string
  year: number
  rank: number
  totalCountries: number
  score: number | null
  normalizedScore: number | null
  percentile: number
  confidence: string
  source?: string
  sourceUrl?: string
  methodology?: string
}

/**
 * Convert data to CSV format
 */
function toCSV(
  data: Array<ExportRow>,
  includeMethodology: boolean,
  includeSourceCitations: boolean
): string {
  if (data.length === 0) return ''

  // Build headers based on options
  const baseHeaders = [
    'Country Code',
    'Country Name',
    'Region',
    'Income Level',
    'Index ID',
    'Index Name',
    'Index Short Name',
    'Domain',
    'Year',
    'Rank',
    'Total Countries',
    'Score',
    'Normalized Score',
    'Percentile',
    'Confidence',
  ]

  const headers = [...baseHeaders]
  if (includeSourceCitations) {
    headers.push('Source', 'Source URL')
  }
  if (includeMethodology) {
    headers.push('Methodology')
  }

  // Escape CSV values
  const escapeCSV = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined) return ''
    const str = String(value)
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  // Build rows
  const rows = data.map((row) => {
    const values: Array<string | number | null | undefined> = [
      row.countryCode,
      row.countryName,
      row.region,
      row.incomeLevel,
      row.indexId,
      row.indexName,
      row.indexShortName,
      row.domain,
      row.year,
      row.rank,
      row.totalCountries,
      row.score,
      row.normalizedScore,
      row.percentile,
      row.confidence,
    ]

    if (includeSourceCitations) {
      values.push(row.source || '', row.sourceUrl || '')
    }
    if (includeMethodology) {
      values.push(row.methodology || '')
    }

    return values.map(escapeCSV).join(',')
  })

  return [headers.join(','), ...rows].join('\n')
}

/**
 * Convert data to JSON format with metadata
 */
function toJSON(
  data: Array<ExportRow>,
  includeMethodology: boolean,
  includeSourceCitations: boolean,
  request: ExportRequest
): string {
  const exportData = {
    metadata: {
      exportedAt: new Date().toISOString(),
      totalRecords: data.length,
      filters: {
        indices: request.indices,
        countries: request.countries,
        yearRange:
          request.yearStart || request.yearEnd
            ? { start: request.yearStart, end: request.yearEnd }
            : null,
      },
      options: {
        includeMethodology,
        includeSourceCitations,
      },
    },
    data: data.map((row) => {
      const record: Record<string, unknown> = {
        country: {
          code: row.countryCode,
          name: row.countryName,
          region: row.region,
          incomeLevel: row.incomeLevel,
        },
        index: {
          id: row.indexId,
          name: row.indexName,
          shortName: row.indexShortName,
          domain: row.domain,
        },
        ranking: {
          year: row.year,
          rank: row.rank,
          totalCountries: row.totalCountries,
          score: row.score,
          normalizedScore: row.normalizedScore,
          percentile: row.percentile,
          confidence: row.confidence,
        },
      }

      if (includeSourceCitations) {
        ;(record.index as Record<string, unknown>).source = row.source
        ;(record.index as Record<string, unknown>).sourceUrl = row.sourceUrl
      }

      if (includeMethodology) {
        ;(record.index as Record<string, unknown>).methodology = row.methodology
      }

      return record
    }),
  }

  return JSON.stringify(exportData, null, 2)
}

/**
 * Convert data to Excel XML format (SpreadsheetML)
 * This creates a simple XML format that Excel can open
 */
function toExcelXML(
  data: Array<ExportRow>,
  includeMethodology: boolean,
  includeSourceCitations: boolean
): string {
  // Build headers
  const baseHeaders = [
    'Country Code',
    'Country Name',
    'Region',
    'Income Level',
    'Index ID',
    'Index Name',
    'Index Short Name',
    'Domain',
    'Year',
    'Rank',
    'Total Countries',
    'Score',
    'Normalized Score',
    'Percentile',
    'Confidence',
  ]

  const headers = [...baseHeaders]
  if (includeSourceCitations) {
    headers.push('Source', 'Source URL')
  }
  if (includeMethodology) {
    headers.push('Methodology')
  }

  // Escape XML values
  const escapeXML = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined) return ''
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
  }

  // Build XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<?mso-application progid="Excel.Sheet"?>\n'
  xml += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n'
  xml += '  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n'
  xml += '  <Worksheet ss:Name="Rankings Export">\n'
  xml += '    <Table>\n'

  // Header row
  xml += '      <Row>\n'
  for (const header of headers) {
    xml += `        <Cell><Data ss:Type="String">${escapeXML(header)}</Data></Cell>\n`
  }
  xml += '      </Row>\n'

  // Data rows
  for (const row of data) {
    xml += '      <Row>\n'

    const values: Array<{ value: string | number | null; type: 'String' | 'Number' }> = [
      { value: row.countryCode, type: 'String' },
      { value: row.countryName, type: 'String' },
      { value: row.region, type: 'String' },
      { value: row.incomeLevel, type: 'String' },
      { value: row.indexId, type: 'String' },
      { value: row.indexName, type: 'String' },
      { value: row.indexShortName, type: 'String' },
      { value: row.domain, type: 'String' },
      { value: row.year, type: 'Number' },
      { value: row.rank, type: 'Number' },
      { value: row.totalCountries, type: 'Number' },
      { value: row.score, type: 'Number' },
      { value: row.normalizedScore, type: 'Number' },
      { value: row.percentile, type: 'Number' },
      { value: row.confidence, type: 'String' },
    ]

    if (includeSourceCitations) {
      values.push({ value: row.source || '', type: 'String' })
      values.push({ value: row.sourceUrl || '', type: 'String' })
    }
    if (includeMethodology) {
      values.push({ value: row.methodology || '', type: 'String' })
    }

    for (const { value, type } of values) {
      const displayValue = value === null ? '' : value
      xml += `        <Cell><Data ss:Type="${type}">${escapeXML(displayValue)}</Data></Cell>\n`
    }

    xml += '      </Row>\n'
  }

  xml += '    </Table>\n'
  xml += '  </Worksheet>\n'
  xml += '</Workbook>'

  return xml
}

/**
 * Export ranking data in specified format
 * Requirement 10.1: Provide data export in CSV, JSON, and Excel formats
 * Requirement 10.3: Include methodology notes and source citations
 */
export const exportRankingsData = createServerFn({ method: 'GET' })
  .inputValidator(exportRequestSchema)
  .handler(async ({ data: request }) => {
    const {
      format,
      indices,
      countries: countryCodes,
      yearStart,
      yearEnd,
      includeMethodology,
      includeSourceCitations,
      clientId = 'anonymous',
    } = request

    // Rate limiting check using the export rate limiter (stricter limits)
    const rateCheck = rateLimiters.export(clientId)
    if (!rateCheck.allowed) {
      return createRateLimitError(rateCheck)
    }

    // Build query conditions
    const conditions = []

    if (indices && indices.length > 0) {
      conditions.push(inArray(rankingEntries.indexId, indices))
    }

    if (countryCodes && countryCodes.length > 0) {
      conditions.push(inArray(rankingEntries.countryCode, countryCodes))
    }

    if (yearStart) {
      conditions.push(sql`${rankingEntries.year} >= ${yearStart}`)
    }

    if (yearEnd) {
      conditions.push(sql`${rankingEntries.year} <= ${yearEnd}`)
    }

    // Fetch data with all relations
    const query = db
      .select({
        // Ranking entry fields
        countryCode: rankingEntries.countryCode,
        indexId: rankingEntries.indexId,
        year: rankingEntries.year,
        rank: rankingEntries.rank,
        totalCountries: rankingEntries.totalCountries,
        score: rankingEntries.score,
        normalizedScore: rankingEntries.normalizedScore,
        percentile: rankingEntries.percentile,
        confidence: rankingEntries.confidence,
        // Country fields
        countryName: countries.name,
        region: countries.region,
        incomeLevel: countries.incomeLevel,
        // Index fields
        indexName: rankingIndices.name,
        indexShortName: rankingIndices.shortName,
        source: rankingIndices.source,
        sourceUrl: rankingIndices.sourceUrl,
        methodology: rankingIndices.methodology,
        // Domain fields
        domainName: domains.name,
      })
      .from(rankingEntries)
      .innerJoin(countries, eq(rankingEntries.countryCode, countries.code))
      .innerJoin(rankingIndices, eq(rankingEntries.indexId, rankingIndices.id))
      .innerJoin(domains, eq(rankingIndices.domainId, domains.id))

    if (conditions.length > 0) {
      query.where(and(...conditions))
    }

    const results = await query.orderBy(
      asc(countries.name),
      asc(rankingIndices.name),
      desc(rankingEntries.year)
    )

    // Transform to export rows
    const exportRows: Array<ExportRow> = results.map((row) => ({
      countryCode: row.countryCode,
      countryName: row.countryName,
      region: row.region,
      incomeLevel: row.incomeLevel,
      indexId: row.indexId,
      indexName: row.indexName,
      indexShortName: row.indexShortName,
      domain: row.domainName,
      year: row.year,
      rank: row.rank,
      totalCountries: row.totalCountries,
      score: row.score,
      normalizedScore: row.normalizedScore,
      percentile: row.percentile,
      confidence: row.confidence,
      source: includeSourceCitations ? row.source : undefined,
      sourceUrl: includeSourceCitations ? row.sourceUrl : undefined,
      methodology: includeMethodology ? row.methodology : undefined,
    }))

    // Convert to requested format
    let content: string
    let contentType: string
    let filename: string

    switch (format) {
      case 'csv':
        content = toCSV(exportRows, includeMethodology, includeSourceCitations)
        contentType = 'text/csv'
        filename = 'rankings-export.csv'
        break
      case 'json':
        content = toJSON(exportRows, includeMethodology, includeSourceCitations, request)
        contentType = 'application/json'
        filename = 'rankings-export.json'
        break
      case 'excel':
        content = toExcelXML(exportRows, includeMethodology, includeSourceCitations)
        contentType = 'application/vnd.ms-excel'
        filename = 'rankings-export.xml'
        break
    }

    return {
      content,
      contentType,
      filename,
      recordCount: exportRows.length,
    }
  })

// Export types
export type ExportResponse = Awaited<ReturnType<typeof exportRankingsData>>
