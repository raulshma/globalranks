/**
 * Redis client configuration for caching
 * Uses ioredis for Redis Cloud connection
 */

import Redis from 'ioredis'

// Singleton Redis client
let redisClient: Redis | null = null

/**
 * Get or create Redis client instance
 * Returns null if REDIS_URL is not configured
 */
export function getRedisClient(): Redis | null {
  if (redisClient) {
    return redisClient
  }

  const redisUrl = process.env.REDIS_URL

  if (!redisUrl) {
    console.warn('[Redis] REDIS_URL not configured, caching disabled')
    return null
  }

  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      // Don't block the app if Redis is unavailable
      enableOfflineQueue: false,
    })

    redisClient.on('connect', () => {
      console.log('[Redis] Connected successfully')
    })

    redisClient.on('error', (err) => {
      console.error('[Redis] Connection error:', err.message)
    })

    redisClient.on('close', () => {
      console.log('[Redis] Connection closed')
    })

    return redisClient
  } catch (error) {
    console.error('[Redis] Failed to create client:', error)
    return null
  }
}

/**
 * Gracefully disconnect Redis client
 */
export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit()
    redisClient = null
  }
}
