// Third-party Imports
import { useTheme } from 'next-themes'
import { HugeiconsIcon } from '@hugeicons/react'
import { MoonStarIcon, Sun01Icon } from '@hugeicons/core-free-icons'

// Component Imports
import { Button } from '@/components/ui/button'

const ModeToggle = () => {
  const { setTheme, resolvedTheme } = useTheme()

  const handleModeChange = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button variant='ghost' size='icon' className='relative' onClick={handleModeChange}>
      <HugeiconsIcon icon={MoonStarIcon} className='scale-100 dark:scale-0' />
      <HugeiconsIcon icon={Sun01Icon} className='absolute scale-0 dark:scale-100' />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  )
}

export default ModeToggle
