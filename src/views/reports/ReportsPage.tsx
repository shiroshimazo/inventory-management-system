import { useMemo, useState } from 'react'
import { fruitProducts } from '@/views/pages/products/FruitProductsData'
import { seedSales } from '@/views/pages/sales/SalesData'
import { purchaseOrdersSeed } from '@/views/pages/purchase-orders/PurchaseOrdersData'
import {
  stressSalesSeries,
  stressSalesByCategory,
  stressPoSpendByStatus,
  stressLowStockItems
} from '@/views/reports/charts/StressTestData'
import {
  ALL_CATEGORIES,
  DEFAULT_DATE_PRESET,
  DEFAULT_REPORT_FILTERS,
  filterProducts,
  filterPurchaseOrders,
  filterSales,
  getDatePresetLabel,
  getInventorySummary,
  getLowStockItems,
  getPurchaseOrderSpendByStatus,
  getReportRows,
  getSalesByCategory,
  getSalesSeries,
  getSalesSummary,
  type ReportDatePreset,
  type ReportFilters
} from '@/views/reports/ReportsData'
import ReportsFilters from '@/views/reports/ReportsFilters'
import ReportsSummary from '@/views/reports/ReportsSummary'
import ReportsTable from '@/views/reports/ReportsTable'
import { type SectionState } from '@/views/reports/ReportsStates'
import SalesOverTimeChart from '@/views/reports/charts/SalesOverTimeChart'
import SalesByCategoryChart from '@/views/reports/charts/SalesByCategoryChart'
import PurchaseOrdersByStatusChart from '@/views/reports/charts/PurchaseOrdersByStatusChart'
import LowStockItemsChart from '@/views/reports/charts/LowStockItemsChart'

declare const process: { env: { NODE_ENV?: string } }

function isWorstCaseMode(): boolean {
  return (
    process.env.NODE_ENV === 'development' &&
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('data') === 'worst'
  )
}

export default function ReportsPage() {
  const [filters, setFilters] = useState<ReportFilters>(DEFAULT_REPORT_FILTERS)
  const [worstCaseActive, setWorstCaseActive] = useState(isWorstCaseMode())

  const report = useMemo(() => {
    const filteredSales = filterSales(seedSales, filters)
    const categoryProducts = filterProducts(fruitProducts, filters.category)
    const filteredOrders = filterPurchaseOrders(purchaseOrdersSeed, fruitProducts, filters)
    const poSpendByStatus = getPurchaseOrderSpendByStatus(filteredOrders)
    const activePoSpendByStatus = worstCaseActive ? stressPoSpendByStatus : poSpendByStatus

    return {
      filteredSales,
      salesSummary: getSalesSummary(filteredSales),
      inventorySummary: getInventorySummary(categoryProducts),
      poSpendByStatus: activePoSpendByStatus,
      poSpendCentavos: activePoSpendByStatus.reduce((total, row) => total + row.spendCentavos, 0),
      salesByCategory: worstCaseActive ? stressSalesByCategory : getSalesByCategory(filteredSales, fruitProducts),
      lowStockItems: worstCaseActive ? stressLowStockItems : getLowStockItems(categoryProducts),
      salesSeries: worstCaseActive ? stressSalesSeries : getSalesSeries(filteredSales, filters.datePreset),
      reportRows: getReportRows(filteredSales, fruitProducts)
    }
  }, [filters, worstCaseActive])

  const {
    filteredSales,
    salesSummary,
    inventorySummary,
    poSpendByStatus,
    poSpendCentavos,
    salesByCategory,
    lowStockItems,
    salesSeries,
    reportRows
  } = report

  const sectionState: SectionState = filteredSales.length ? 'ready' : 'empty'

  function setDatePreset(preset: ReportDatePreset) {
    setFilters(current => ({ ...current, datePreset: preset }))
  }

  function setCategory(category: string) {
    setFilters(current => ({ ...current, category }))
  }

  function resetDatePreset() {
    setFilters(current => ({ ...current, datePreset: DEFAULT_DATE_PRESET }))
  }

  function resetCategory() {
    setFilters(current => ({ ...current, category: ALL_CATEGORIES }))
  }

  function clearFilters() {
    setFilters(DEFAULT_REPORT_FILTERS)
  }

  function setWorstCaseMode(isWorst: boolean) {
    const url = new URL(window.location.href)
    if (isWorst) {
      url.searchParams.set('data', 'worst')
    } else {
      url.searchParams.delete('data')
    }
    window.history.pushState(null, '', url.toString())
    setWorstCaseActive(isWorstCaseMode())
  }

  return (
    <section aria-labelledby='reports-title' className='borderline min-w-0 p-4 sm:p-6'>
      <header className='space-y-1'>
        <h1 id='reports-title' className='text-3xl font-semibold'>
          Reports
        </h1>
        <p className='text-muted-foreground text-sm'>Mock data · {getDatePresetLabel(filters.datePreset)}</p>
      </header>

      <div className='border-t pt-6'>
        <ReportsFilters
          filters={filters}
          onDatePresetChange={setDatePreset}
          onCategoryChange={setCategory}
          onResetDatePreset={resetDatePreset}
          onResetCategory={resetCategory}
        />
      </div>

      <div className='space-y-3 border-t pt-6'>
        <h2 className='text-base font-semibold'>Summary</h2>
        <ReportsSummary
          sales={salesSummary}
          inventory={inventorySummary}
          poSpendCentavos={poSpendCentavos}
          state={sectionState}
          onClearFilters={clearFilters}
        />
      </div>

      <div className='grid items-stretch gap-4 border-t pt-6 lg:grid-cols-2'>
        <SalesOverTimeChart
          points={salesSeries}
          datePreset={filters.datePreset}
          state={sectionState}
          onClearFilters={clearFilters}
        />
        <SalesByCategoryChart data={salesByCategory} state={sectionState} onClearFilters={clearFilters} />
        <PurchaseOrdersByStatusChart data={poSpendByStatus} state={sectionState} onClearFilters={clearFilters} />
        <LowStockItemsChart data={lowStockItems} state={sectionState} onClearFilters={clearFilters} />
      </div>

      <div className='space-y-3 border-t pt-6'>
        <h2 className='text-base font-semibold'>Sales detail</h2>
        <ReportsTable rows={reportRows} state={sectionState} onClearFilters={clearFilters} />
      </div>

      {process.env.NODE_ENV === 'development' && (
        <div
          role='group'
          aria-label='Report data mode'
          className='fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-0.5 rounded-md bg-neutral-300 p-0.5'
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          <button
            type='button'
            aria-pressed={!worstCaseActive}
            onClick={() => setWorstCaseMode(false)}
            className={`rounded px-2 py-1 text-xs ${worstCaseActive ? 'text-neutral-600' : 'bg-white text-black'}`}
          >
            Demo data
          </button>
          <button
            type='button'
            aria-pressed={worstCaseActive}
            onClick={() => setWorstCaseMode(true)}
            className={`rounded px-2 py-1 text-xs ${worstCaseActive ? 'bg-white text-black' : 'text-neutral-600'}`}
          >
            Worst case
          </button>
        </div>
      )}
    </section>
  )
}
