import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { QueryClient } from '@tanstack/react-query'
import NotFound from '@/components/NotFound'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  // The 404 page for every URL that does not match a route.
  defaultNotFoundComponent: NotFound,
  // Render the 404 at the root level. In the default 'fuzzy' mode the 404 is
  // rendered inside the page the URL half-matched, which keeps the sidebar and
  // a breadcrumb trail for a page that does not exist.
  notFoundMode: 'root'
})

