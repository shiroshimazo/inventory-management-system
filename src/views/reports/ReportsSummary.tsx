import type { InventorySummary, SalesSummary } from '@/views/reports/ReportsData'
import { formatCentavos, formatCount } from '@/views/reports/ReportsFormat'
import ReportsState from '@/views/reports/ReportsStates'
import type { SectionState } from '@/views/reports/ReportsStates'
import {
  Alert02Icon,
  ClipboardIcon,
  PackageIcon,
  PackageRemoveIcon,
  ShoppingCart01Icon
} from '@hugeicons/core-free-icons'
import { withMockStatisticsHistory } from '@/views/dashboards/statistics/StatisticsData'
import StatisticsGrid from '@/views/dashboards/statistics/StatisticsGrid'

export default function ReportsSummary({
  sales,
  inventory,
  poSpendCentavos,
  onClearFilters,
  state
}: {
  sales: SalesSummary
  inventory: InventorySummary
  poSpendCentavos: number
  onClearFilters: () => void
  state: SectionState
}) {
  if (state !== 'ready') {
    return <ReportsState state={state} onClearFilters={onClearFilters} />
  }

  const statistics = withMockStatisticsHistory([
    {
      icon: ShoppingCart01Icon,
      label: 'Sales',
      value: sales.revenueCentavos,
      kind: 'area',
      formatValue: formatCentavos
    },
    { icon: ClipboardIcon, label: 'Orders', value: sales.orderCount, formatValue: formatCount },
    {
      icon: ShoppingCart01Icon,
      label: 'Avg order',
      value: sales.averageOrderCentavos,
      kind: 'line',
      formatValue: formatCentavos
    },
    {
      icon: PackageIcon,
      label: 'Stock value',
      value: inventory.inventoryValueCentavos,
      kind: 'area',
      formatValue: formatCentavos
    },
    { icon: PackageIcon, label: 'Units', value: inventory.totalUnits, formatValue: formatCount },
    { icon: Alert02Icon, label: 'Low stock', value: inventory.lowStockCount, formatValue: formatCount, trend: 'down' },
    {
      icon: PackageRemoveIcon,
      label: 'Out of stock',
      value: inventory.outOfStockCount,
      formatValue: formatCount,
      trend: 'down'
    },
    { icon: ClipboardIcon, label: 'PO spend', value: poSpendCentavos, kind: 'area', formatValue: formatCentavos }
  ])

  return <StatisticsGrid label='Report statistics' statistics={statistics} className='sm:grid-cols-2 xl:grid-cols-4' />
}
