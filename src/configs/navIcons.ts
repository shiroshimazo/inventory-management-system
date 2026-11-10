// Third-party Imports
import {
  BadgeCheckIcon,
  LayoutDashboardIcon,
  LayoutTemplateIcon,
  LockKeyholeIcon,
  TableIcon,
  UserCogIcon
} from '@hugeicons/core-free-icons'

// Icon data consumed by `<HugeiconsIcon icon={...} />`.
// Add new sidebar icons here first, then reference the key from navConfig.
export const navIcons = {
  dashboard: LayoutDashboardIcon,
  table: TableIcon,
  formLayout: LayoutTemplateIcon,
  formValidation: BadgeCheckIcon,
  userSettings: UserCogIcon,
  authentication: LockKeyholeIcon
} as const

export type NavIconName = keyof typeof navIcons
