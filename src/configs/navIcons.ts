// Third-party Imports
import {
  BadgeCheckIcon,
  ChartHistogramIcon,
  ClipboardIcon,
  LayoutDashboardIcon,
  LayoutTemplateIcon,
  LockKeyholeIcon,
  PackageIcon,
  ShoppingCart01Icon,
  TableIcon,
  Tag01Icon,
  TruckIcon,
  UserCogIcon,
  UserGroupIcon
} from '@hugeicons/core-free-icons'

// Icon data consumed by `<HugeiconsIcon icon={...} />`.
// Add new sidebar icons here first, then reference the key from navConfig.
export const navIcons = {
  dashboard: LayoutDashboardIcon,
  table: TableIcon,
  formLayout: LayoutTemplateIcon,
  formValidation: BadgeCheckIcon,
  userSettings: UserCogIcon,
  authentication: LockKeyholeIcon,
  products: PackageIcon,
  categories: Tag01Icon,
  sales: ShoppingCart01Icon,
  suppliers: TruckIcon,
  purchaseOrders: ClipboardIcon,
  reports: ChartHistogramIcon,
  userManagement: UserGroupIcon
} as const

export type NavIconName = keyof typeof navIcons
