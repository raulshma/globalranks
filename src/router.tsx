import { createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import type { RouterContext } from './routes/__root'

// Cache configuration constants (in milliseconds)
export const CACHE_CONFIG = {
  // Stable data that rarely changes (domains, indices metadata)
  STABLE: {
    staleTime: 1000 * 60 * 60, // 1 hour - data considered fresh
    gcTime: 1000 * 60 * 60 * 24, // 24 hours - keep in cache
  },
  // Semi-stable data (rankings, comparisons)
  SEMI_STABLE: {
    staleTime: 1000 * 60 * 5, // 5 minutes - data considered fresh
    gcTime: 1000 * 60 * 30, // 30 minutes - keep in cache
  },
  // Dynamic data (dashboard, trends with user selections)
  DYNAMIC: {
    staleTime: 1000 * 60 * 2, // 2 minutes - data considered fresh
    gcTime: 1000 * 60 * 10, // 10 minutes - keep in cache
  },
} as const

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Default cache settings for all routes
    defaultStaleTime: CACHE_CONFIG.SEMI_STABLE.staleTime,
    defaultGcTime: CACHE_CONFIG.SEMI_STABLE.gcTime,
    context: {
      selectedCountry: 'IND',
    } satisfies RouterContext,
  })

  return router
}

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
