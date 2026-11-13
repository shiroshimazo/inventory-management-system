import { createFileRoute } from '@tanstack/react-router'
import { HugeiconsIcon } from '@/components/ui/hugeicons'
import { Alert02Icon, ClipboardIcon, PackageIcon, PackageRemoveIcon } from '@hugeicons/core-free-icons'
import StatisticsCard from '@/views/dashboards/statistics/statistics-card-01'
import LowStockAlerts from '@/views/dashboards/widgets/LowStockAlerts'
import StockMovementChart from '@/views/dashboards/charts/StockMovementChart'
import RecentStockMovements from '@/views/dashboards/RecentStockMovements'
import {
  getInventorySummary,
  inventoryProducts,
  movementDates,
  purchaseOrders,
  stockMovements
} from '@/views/dashboards/InventoryMockData'

const summary = getInventorySummary(inventoryProducts, purchaseOrders)
const statistics = [
  { icon: PackageIcon, title: 'Total Products', value: summary.totalProducts },
  { icon: Alert02Icon, title: 'Low Stock Items', value: summary.lowStockItems },
  { icon: PackageRemoveIcon, title: 'Out of Stock', value: summary.outOfStock },
  { icon: ClipboardIcon, title: 'Pending Purchase Orders', value: summary.pendingPurchaseOrders }
]

function InventoryDashboard() {
  return (
    <section aria-labelledby='inventory-dashboard-title' className='min-w-0 space-y-6'>
      <header className='space-y-1'>
        <h1 id='inventory-dashboard-title' className='text-xl font-semibold'>
          Inventory dashboard
        </h1>
        <p className='text-muted-foreground text-sm'>Mock data · Snapshot 10 Nov 2026</p>
      </header>
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {statistics.map(statistic => (
          <StatisticsCard
            key={statistic.title}
            icon={<HugeiconsIcon icon={statistic.icon} className='size-4' />}
            title={statistic.title}
            value={String(statistic.value)}
            className='shadow-none ring-0'
          />
        ))}
      </div>
      <div className='grid items-stretch gap-6 xl:grid-cols-3'>
        <LowStockAlerts products={inventoryProducts} />
        <div className='min-w-0 xl:col-span-2'>
          <StockMovementChart movements={stockMovements} dates={movementDates} />
        </div>
      </div>
      <RecentStockMovements movements={stockMovements} products={inventoryProducts} />
    </section>
  )
}

export const Route = createFileRoute('/_pages/dashboard')({
  component: InventoryDashboard
})
