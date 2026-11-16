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
      disabled?: false
      target?: '_blank' | '_self' | '_parent' | '_top'
    }
  | {
      href?: never
      badge?: string
      badgeClassName?: string
      childItems: MenuSubItem[]
      disabled?: false
    }
  | {
      href?: never
      childItems?: never
      disabled: true
      badge: 'Planned'
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
        href: '/dashboard'
      }
    ]
  },
  {
    groupLabel: 'Inventory',
    items: [
      { icon: 'products', label: 'Products', href: '/products' },
      { icon: 'categories', label: 'Categories', href: '/categories' }
    ]
  },
  {
    groupLabel: 'Sales',
    items: [{ icon: 'sales', label: 'Sales / Stock-Out', href: '/sales' }]
  },
  {
    groupLabel: 'Purchasing',
    items: [
      { icon: 'suppliers', label: 'Suppliers', href: '/suppliers' },
      { icon: 'purchaseOrders', label: 'Purchase Orders', disabled: true, badge: 'Planned' }
    ]
  },
  {
    groupLabel: 'Reports',
    items: [{ icon: 'reports', label: 'Reports', disabled: true, badge: 'Planned' }]
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
      { icon: 'userManagement', label: 'User Management', disabled: true, badge: 'Planned' }
    ]
  }
]
