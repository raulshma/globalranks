/**
 * Server functions for data reporting (incorrect data reports)
 * Allows anonymous users to report incorrect data for indices
 */

import { and, eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { createServerFn } from '@tanstack/react-start'
import { db } from '../db'
import { dataReports, rankingIndices } from '../db/schema'
import { createRateLimitError, createRateLimiter } from '../rate-limit'

// Rate limiter for reports: 5 reports per 10 minutes
const reportRateLimiter = createRateLimiter({
  limit: 5,
  windowMs: 10 * 60 * 1000, // 10 minutes
})

/**
 * Submit an incorrect data report for an index/year
 * Anonymous users can report issues with ranking data
 * 
 * Spam prevention:
 * - Rate limited to 5 reports per 10 minutes per fingerprint
 * - Same fingerprint cannot report the same index/year twice
 * - Duplicate reports increment the count instead of creating new entries
 * 
 * The fingerprint is generated client-side using a combination of
 * browser characteristics and passed to this function.
 */
export const submitDataReport = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      indexId: z.string().min(1, 'Index ID is required'),
      year: z.number().int().min(1900).max(2100),
      reason: z.string().max(500).optional(),
      // Fingerprint generated client-side for spam prevention
      fingerprint: z.string().min(8).max(64),
    })
  )
  .handler(async ({ data }) => {
    const { indexId, year, reason, fingerprint: clientFingerprint } = data

    // precise request-based fingerprinting
    let ip = "unknown"
    try {
      const { getRequest } = await import("@tanstack/react-start/server"); 
      const req = getRequest();
      ip = req.headers.get('x-forwarded-for') || "unknown"
    } catch (e) {
      console.error("Failed to get request IP", e)
    }
    const fingerprint = `${clientFingerprint}|${ip}`

    // Check rate limit
    const rateLimitResult = reportRateLimiter(fingerprint)
    if (!rateLimitResult.allowed) {
      throw new Error(
        JSON.stringify(createRateLimitError(rateLimitResult))
      )
    }

    // Verify the index exists
    const indexExists = await db.query.rankingIndices.findFirst({
      where: eq(rankingIndices.id, indexId),
      columns: { id: true },
    })

    if (!indexExists) {
      throw new Error('Index not found')
    }

    // Check if a report already exists for this index/year
    const existingReport = await db.query.dataReports.findFirst({
      where: and(
        eq(dataReports.indexId, indexId),
        eq(dataReports.year, year)
      ),
    })

    if (existingReport) {
      // Check if this fingerprint already reported this index/year
      if (existingReport.lastReporterFingerprint === fingerprint) {
        return {
          success: true,
          message: 'You have already reported this data',
          alreadyReported: true,
          reportCount: existingReport.reportCount,
        }
      }

      // Update the existing report: increment count and update fingerprint
      await db
        .update(dataReports)
        .set({
          reportCount: sql`${dataReports.reportCount} + 1`,
          lastReporterFingerprint: fingerprint,
          reason: reason || existingReport.reason, // Keep new reason if provided
          updatedAt: new Date(),
        })
        .where(eq(dataReports.id, existingReport.id))

      return {
        success: true,
        message: 'Report submitted successfully',
        alreadyReported: false,
        reportCount: existingReport.reportCount + 1,
      }
    }

    // Create a new report
    const reportId = `report_${indexId}_${year}_${Date.now()}`
    await db.insert(dataReports).values({
      id: reportId,
      indexId,
      year,
      reportCount: 1,
      lastReporterFingerprint: fingerprint,
      reason: reason || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return {
      success: true,
      message: 'Report submitted successfully',
      alreadyReported: false,
      reportCount: 1,
    }
  })

/**
 * Get report count for an index/year (used for displaying report badge)
 */
export const getReportCount = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      indexId: z.string().min(1),
      year: z.number().int(),
    })
  )
  .handler(async ({ data }) => {
    const { indexId, year } = data

    const report = await db.query.dataReports.findFirst({
      where: and(
        eq(dataReports.indexId, indexId),
        eq(dataReports.year, year)
      ),
      columns: {
        reportCount: true,
      },
    })

    return {
      reportCount: report?.reportCount ?? 0,
    }
  })
