import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { AnimatedSidebarInset } from '@/components/motion/animated-sidebar'

export const Route = createFileRoute('/_pages')({
  component: () => (
    <div className='flex h-full w-full min-w-0'>
      <Suspense>
        <Sidebar />
      </Suspense>
      <AnimatedSidebarInset className='flex flex-1 flex-col'>
        <Header />
        <div className='mx-auto size-full max-w-360 flex-1 px-4 py-6 sm:px-6'>
          <Outlet />
        </div>
        <Footer />
      </AnimatedSidebarInset>
    </div>
  )
})
