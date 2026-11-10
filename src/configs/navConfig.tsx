// Type Imports
import type { NavIconName } from '@/configs/navIcons'

export type MenuLeafSubItem = {
  label: string
  href: string
  activePath?: string
  badge?: string
  badgeClassName?: string
  target?: '_blank' | '_self' | '_parent' | '_top'
}

export type MenuGroupSubItem = {
  label: string
  childItems: MenuLeafSubItem[]
}

export type MenuSubItem = MenuLeafSubItem | MenuGroupSubItem

export type MenuItem = {
  icon: NavIconName
  label: string
} & (
  | {
      href: string
      badge?: string
      badgeClassName?: string
      childItems?: never
      target?: '_blank' | '_self' | '_parent' | '_top'
    }
  | {
      href?: never
      badge?: string
      badgeClassName?: string
      childItems: MenuSubItem[]
    }
)

export type NavItem = {
  groupLabel?: string
  items: MenuItem[]
}

export const navItems: NavItem[] = [
  {
    groupLabel: 'Overview',
    items: [
      {
        icon: 'dashboard',
        label: 'Dashboard',
        href: '/dashboard/orders'
      },
      {
        icon: 'table',
        label: 'Data Table',
        href: '/datatable'
      }
    ]
  },
  {
    groupLabel: 'Forms',
    items: [
      {
        icon: 'formLayout',
        label: 'Form Layouts',
        childItems: [
          { label: 'Vertical Layout', href: '/forms/form-layouts/vertical' },
          { label: 'Horizontal Layout', href: '/forms/form-layouts/horizontal' }
        ]
      },
      {
        icon: 'formValidation',
        label: 'Form Validation',
        href: '/forms/form-validation'
      }
    ]
  },
  {
    groupLabel: 'Account',
    items: [
      {
        icon: 'userSettings',
        label: 'User Settings',
        childItems: [
          {
            label: 'General',
            href: '/pages/user-settings?setting=general'
          },
          {
            label: 'Workspace',
            href: '/pages/user-settings?setting=workspace'
          }
        ]
      },
      {
        icon: 'authentication',
        label: 'Authentication',
        childItems: [
          { label: 'Login', href: '/pages/auth/login' },
          { label: 'Register', href: '/pages/auth/register' },
          { label: 'Forgot Password', href: '/pages/auth/forgot-password' },
          { label: 'Verify Email', href: '/pages/auth/verify-email' },
          { label: 'Reset Password', href: '/pages/auth/reset-password' },
          { label: 'Two Steps', href: '/pages/auth/two-steps' }
        ]
      }
    ]
  }
]
