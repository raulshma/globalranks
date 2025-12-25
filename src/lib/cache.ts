/**
 * Cache utilities for Redis-based server-side caching
 * Provides typed helpers for get/set operations with TTL
 */

import { getRedisClient } from './redis'

/**
 * Cache TTL constants (in seconds)
 * Aligned with CDN_CACHE settings in cache-config.ts
 */
export const CACHE_TTL = {
  /** Static data: countries, peer groups (1 day) */
  STATIC: 86400,
  /** Reference data: domains, indices metadata (6 hour) */
  REFERENCE: 21600,
  /** Dynamic data: dashboard, rankings by country (1 hour) */
  DYNAMIC: 3600,
} as const

export type CacheTTLType = keyof typeof CACHE_TTL

/**
 * Generate a cache key from prefix and parts
 * @example cacheKey('dashboard', 'IND') => 'dashboard:IND'
 */
export function cacheKey(prefix: string, ...parts: (string | number)[]): string {
  return [prefix, ...parts].join(':')
}

/**
 * Get cached value from Redis
 * Returns null if not found or Redis unavailable
 */
export async function getCache<T>(key: string): Promise<T | null> {
  const redis = getRedisClient()
  if (!redis) return null

  try {
    const cached = await redis.get(key)
    if (cached) {
      return JSON.parse(cached) as T
    }
    return null
  } catch (error) {
    console.error(`[Cache] Error getting key ${key}:`, error)
    return null
  }
}

/**
 * Set cached value in Redis with TTL
 */
export async function setCache<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  const redis = getRedisClient()
  if (!redis) return

  try {
    await redis.setex(key, ttlSeconds, JSON.stringify(value))
  } catch (error) {
    console.error(`[Cache] Error setting key ${key}:`, error)
  }
}

/**
 * Execute a function with caching
 * Returns cached value if available, otherwise executes fetcher and caches result
 * 
 * @param key - Cache key
 * @param ttl - Time to live in seconds
 * @param fetcher - Function to execute if cache miss
 * @returns Cached or fetched value
 * 
 * @example
 * const data = await withCache(
 *   cacheKey('countries', 'all'),
 *   CACHE_TTL.STATIC,
 *   () => db.query.countries.findMany()
 * )
 */
export async function withCache<T>(
  key: string,
  ttl: number,
  fetcher: () => Promise<T>
): Promise<T> {
  // Try to get from cache first
  const cached = await getCache<T>(key)
  if (cached !== null) {
    return cached
  }

  // Cache miss - execute fetcher
  const result = await fetcher()

  // Store in cache (don't await to avoid blocking)
  setCache(key, result, ttl).catch(() => {
    // Error already logged in setCache
  })

  return result
}

/**
 * Delete a specific key from cache
 */
export async function deleteCache(key: string): Promise<void> {
  const redis = getRedisClient()
  if (!redis) return

  try {
    await redis.del(key)
  } catch (error) {
    console.error(`[Cache] Error deleting key ${key}:`, error)
  }
}

/**
 * Invalidate cache keys matching a pattern
 * Use sparingly as SCAN can be slow on large datasets
 * 
 * @param pattern - Redis pattern (e.g., 'dashboard:*')
 */
export async function invalidateCachePattern(pattern: string): Promise<void> {
  const redis = getRedisClient()
  if (!redis) return

  try {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (error) {
    console.error(`[Cache] Error invalidating pattern ${pattern}:`, error)
  }
}
