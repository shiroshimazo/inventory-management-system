// React Imports
import type { ReactNode } from 'react'

// Component Imports
import { ThemeProvider } from './ThemeProvider'
import { AnimatedSidebarProvider } from './motion/animated-sidebar'
import { TooltipProvider } from './ui/tooltip'

type Props = {
  children: ReactNode
  sidebarDefaultOpen?: boolean
}

const Providers = ({ children, sidebarDefaultOpen }: Props) => {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem={true}>
      <TooltipProvider>
        <AnimatedSidebarProvider
          defaultOpen={sidebarDefaultOpen}
          onOpenChange={open => {
            document.cookie = `sidebar_state=${open}; path=/; max-age=604800`
          }}
        >
          {children}
        </AnimatedSidebarProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default Providers
