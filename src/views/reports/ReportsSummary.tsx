import type { InventorySummary, SalesSummary } from '@/views/reports/ReportsData'
import { formatCentavos, formatCount } from '@/views/reports/ReportsFormat'
import ReportsState from '@/views/reports/ReportsStates'
import type { SectionState } from '@/views/reports/ReportsStates'
import { HugeiconsIcon } from '@/components/ui/hugeicons'
import {
  Alert02Icon,
  ClipboardIcon,
  PackageIcon,
  PackageRemoveIcon,
  ShoppingCart01Icon
} from '@hugeicons/core-free-icons'
import StatisticsCard from '@/views/dashboards/statistics/statistics-card-01'

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
    return (
      <ReportsState state={state} onClearFilters={onClearFilters} />
    )
  }

  const statistics = [
    { icon: ShoppingCart01Icon, title: 'Sales', value: formatCentavos(sales.revenueCentavos) },
    { icon: ClipboardIcon, title: 'Orders', value: formatCount(sales.orderCount) },
    { icon: ShoppingCart01Icon, title: 'Avg order', value: formatCentavos(sales.averageOrderCentavos) },
    { icon: PackageIcon, title: 'Stock value', value: formatCentavos(inventory.inventoryValueCentavos) },
    { icon: PackageIcon, title: 'Units', value: formatCount(inventory.totalUnits) },
    { icon: Alert02Icon, title: 'Low stock', value: formatCount(inventory.lowStockCount) },
    { icon: PackageRemoveIcon, title: 'Out of stock', value: formatCount(inventory.outOfStockCount) },
    { icon: ClipboardIcon, title: 'PO spend', value: formatCentavos(poSpendCentavos) }
  ]

  return (
    <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      {statistics.map(statistic => (
        <StatisticsCard
          key={statistic.title}
          icon={<HugeiconsIcon icon={statistic.icon} className='size-4' />}
          title={statistic.title}
          value={statistic.value}
          className='borderline-surface'
        />
      ))}
    </div>
  )
}
