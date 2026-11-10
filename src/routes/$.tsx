import { createFileRoute } from '@tanstack/react-router'
import NotFound from '@/components/NotFound'

// Catch-all route. Every URL that does not match a real route lands here, so
// the 404 page is a route like any other instead of a fallback the router
// renders inside the page it failed to match.
export const Route = createFileRoute('/$')({
  component: NotFound
})
