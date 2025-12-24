import { createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { CACHE_CONFIG } from './lib/cache-config'
import type { RouterContext } from './routes/__root'

// Re-export for backwards compatibility
export { CACHE_CONFIG }

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
