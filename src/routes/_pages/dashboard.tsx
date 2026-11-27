import { createFileRoute } from '@tanstack/react-router'
import { Alert02Icon, ClipboardIcon, PackageIcon, PackageRemoveIcon } from '@hugeicons/core-free-icons'
import { withMockStatisticsHistory } from '@/views/dashboards/statistics/StatisticsData'
import StatisticsGrid from '@/views/dashboards/statistics/StatisticsGrid'
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
const statistics = withMockStatisticsHistory([
  { icon: PackageIcon, label: 'Total Products', value: summary.totalProducts },
  { icon: Alert02Icon, label: 'Low Stock Items', value: summary.lowStockItems, trend: 'down' },
  { icon: PackageRemoveIcon, label: 'Out of Stock', value: summary.outOfStock, trend: 'down' },
  { icon: ClipboardIcon, label: 'Pending Purchase Orders', value: summary.pendingPurchaseOrders }
])

function InventoryDashboard() {
  return (
    <section aria-labelledby='inventory-dashboard-title' className='borderline min-w-0 space-y-6 p-4 sm:p-6'>
      <header className='space-y-1'>
        <h1 id='inventory-dashboard-title' className='text-3xl font-semibold'>
          Inventory dashboard
        </h1>
        <p className='text-muted-foreground text-sm'>Mock data · Snapshot 10 Nov 2026</p>
      </header>
      <StatisticsGrid label='Inventory statistics' statistics={statistics} className='sm:grid-cols-2 xl:grid-cols-4' />
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
