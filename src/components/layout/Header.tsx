// React Imports
import { Fragment } from 'react'

// Third-party Imports
import { HugeiconsIcon } from '@/components/ui/hugeicons'
import { LanguagesIcon, PanelLeftIcon } from '@hugeicons/core-free-icons'
import { createLink, useLocation } from '@tanstack/react-router'

// Component Imports
import LanguageDropdown from '@/components/shared/LanguageDropdown'
import ModeToggle from '@/components/layout/ModeToggle'
import ProfileDropdown from '@/components/shared/ProfileDropdown'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { AnimatedSidebarTrigger } from '@/components/motion/animated-sidebar'

const RouterBreadcrumbLink = createLink(BreadcrumbLink)

const Header = () => {
  const location = useLocation()
  const pathname = location.pathname

  const segments = pathname.split('/').filter(Boolean)

  return (
    <header className='bg-card sticky top-0 z-50 border-b'>
      <div className='mx-auto flex max-w-360 items-center justify-between gap-6 px-4 py-2 sm:px-6'>
        <div className='flex items-center gap-4'>
          <AnimatedSidebarTrigger className='hover:bg-muted'>
            <HugeiconsIcon icon={PanelLeftIcon} className='size-5' />
          </AnimatedSidebarTrigger>
          <Separator orientation='vertical' className='hidden h-4! data-vertical:self-center sm:block' />
          <Breadcrumb className='hidden sm:block'>
            <BreadcrumbList>
              {segments.map((segment, index) => {
                const isLast = index === segments.length - 1
                const label = segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                const href = '/' + segments.slice(0, index + 1).join('/')

                return (
                  <Fragment key={href}>
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{label}</BreadcrumbPage>
                      ) : (
                        <RouterBreadcrumbLink to={href}>{label}</RouterBreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className='flex items-center gap-1.5'>
          <ModeToggle />
          <LanguageDropdown
            trigger={
              <Button variant='ghost' size='icon-lg'>
                <HugeiconsIcon icon={LanguagesIcon} />
              </Button>
            }
          />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  )
}

export default Header
