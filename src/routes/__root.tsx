import { Outlet, createRootRoute } from '@tanstack/react-router'
import Providers from '@/components/Providers'
import { Toaster } from '@/components/ui/sonner'
import ScrollToTop from '@/components/layout/ScrollToTop'
import NotFound from '@/components/NotFound'

export const Route = createRootRoute({
  notFoundComponent: NotFound,
  component: () => (
    <Providers sidebarDefaultOpen={document.cookie.split('; ').find(value => value.startsWith('sidebar_state=')) !== 'sidebar_state=false'}>
      <Outlet />
      <Toaster />
      <ScrollToTop />
    </Providers>
  ),
})
