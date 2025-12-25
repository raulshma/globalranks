/**
 * Rate Limiting Middleware
 * Requirement 10.4: Implement rate limiting and authentication for API access
 *
 * Provides in-memory rate limiting for server functions.
 * In production, this should be replaced with a distributed solution (Redis, etc.)
 */

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  limit: number
  /** Time window in milliseconds */
  windowMs: number
}

export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean
  /** Number of remaining requests in the current window */
  remaining: number
  /** Time in seconds until the rate limit resets */
  resetIn: number
  /** Retry-After header value in seconds (only set when rate limited) */
  retryAfter?: number
}

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory storage for rate limit data
// In production, use Redis or similar distributed cache
const rateLimitStore = new Map<string, RateLimitEntry>()

// Default configuration
const DEFAULT_CONFIG: RateLimitConfig = {
  limit: 100, // 100 requests
  windowMs: 60 * 1000, // per minute
}

// Cleanup old entries periodically (every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000

let cleanupTimer: ReturnType<typeof setInterval> | null = null

function startCleanup(): void {
  if (cleanupTimer) return

  cleanupTimer = setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now > entry.resetTime) {
        rateLimitStore.delete(key)
      }
    }
  }, CLEANUP_INTERVAL)

  // Don't prevent Node from exiting
  if (typeof cleanupTimer.unref === 'function') {
    cleanupTimer.unref()
  }
}

/**
 * Check rate limit for a client
 *
 * @param clientId - Unique identifier for the client (IP, API key, user ID, etc.)
 * @param config - Rate limit configuration (optional, uses defaults if not provided)
 * @returns Rate limit result with allowed status and metadata
 */
export function checkRateLimit(
  clientId: string,
  config: Partial<RateLimitConfig> = {}
): RateLimitResult {
  const { limit, windowMs } = { ...DEFAULT_CONFIG, ...config }
  const now = Date.now()

  // Start cleanup timer if not already running
  startCleanup()

  // Get or create entry for this client
  let entry = rateLimitStore.get(clientId)

  // If no entry or window has expired, create new entry
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 1,
      resetTime: now + windowMs,
    }
    rateLimitStore.set(clientId, entry)

    return {
      allowed: true,
      remaining: limit - 1,
      resetIn: Math.ceil(windowMs / 1000),
    }
  }

  // Check if limit exceeded
  if (entry.count >= limit) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000)
    return {
      allowed: false,
      remaining: 0,
      resetIn: retryAfter,
      retryAfter,
    }
  }

  // Increment count
  entry.count++

  return {
    allowed: true,
    remaining: limit - entry.count,
    resetIn: Math.ceil((entry.resetTime - now) / 1000),
  }
}

/**
 * Create a rate limiter with custom configuration
 *
 * @param config - Rate limit configuration
 * @returns A function that checks rate limit for a client ID
 */
export function createRateLimiter(config: Partial<RateLimitConfig> = {}) {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config }

  return (clientId: string): RateLimitResult => {
    return checkRateLimit(clientId, mergedConfig)
  }
}

/**
 * Rate limit configurations for different API endpoints
 */
export const rateLimitConfigs = {
  /** Standard API rate limit: 100 requests per minute */
  standard: { limit: 100, windowMs: 60 * 1000 },

  /** Strict rate limit for expensive operations: 20 requests per minute */
  strict: { limit: 20, windowMs: 60 * 1000 },

  /** Relaxed rate limit for read-only operations: 200 requests per minute */
  relaxed: { limit: 200, windowMs: 60 * 1000 },

  /** Export rate limit: 10 exports per minute */
  export: { limit: 10, windowMs: 60 * 1000 },

  /** Report rate limit: 5 reports per 10 minutes */
  report: { limit: 5, windowMs: 10 * 60 * 1000 },
} as const

/**
 * Pre-configured rate limiters
 */
export const rateLimiters = {
  standard: createRateLimiter(rateLimitConfigs.standard),
  strict: createRateLimiter(rateLimitConfigs.strict),
  relaxed: createRateLimiter(rateLimitConfigs.relaxed),
  export: createRateLimiter(rateLimitConfigs.export),
}

/**
 * Generate rate limit headers for HTTP responses
 *
 * @param result - Rate limit check result
 * @returns Headers object with rate limit information
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(result.resetIn),
  }

  if (!result.allowed && result.retryAfter) {
    headers['Retry-After'] = String(result.retryAfter)
  }

  return headers
}

/**
 * Create a rate-limited error response
 *
 * @param result - Rate limit check result
 * @returns Error object with rate limit information
 */
export function createRateLimitError(result: RateLimitResult) {
  return {
    error: 'Rate limit exceeded',
    message: `Too many requests. Please try again in ${result.retryAfter} seconds.`,
    retryAfter: result.retryAfter,
    status: 429,
  }
}

/**
 * Reset rate limit for a specific client (useful for testing)
 *
 * @param clientId - Client identifier to reset
 */
export function resetRateLimit(clientId: string): void {
  rateLimitStore.delete(clientId)
}

/**
 * Clear all rate limit data (useful for testing)
 */
export function clearAllRateLimits(): void {
  rateLimitStore.clear()
}
