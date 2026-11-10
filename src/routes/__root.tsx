import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router'
import { Agentation } from 'agentation'
import Providers from '@/components/Providers'
import { Toaster } from '@/components/ui/sonner'
import ScrollToTop from '@/components/layout/ScrollToTop'
import NotFound from '@/components/NotFound'

function AgentationToolbar() {
  // Keep annotation sessions in sync with client-side navigation.
  useLocation({ select: location => location.pathname })

  return <Agentation endpoint='http://localhost:4747' />
}

export const Route = createRootRoute({
  notFoundComponent: NotFound,
  component: () => (
    <Providers sidebarDefaultOpen={document.cookie.split('; ').find(value => value.startsWith('sidebar_state=')) !== 'sidebar_state=false'}>
      <Outlet />
      <Toaster />
      <ScrollToTop />
      {import.meta.env.DEV && <AgentationToolbar />}
    </Providers>
  ),
})
