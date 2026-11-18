import { useMemo, useState } from 'react'
import { fruitProducts } from '@/views/pages/products/FruitProductsData'
import { seedSales } from '@/views/pages/sales/SalesData'
import { purchaseOrdersSeed } from '@/views/pages/purchase-orders/PurchaseOrdersData'
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

export default function ReportsPage() {
  const [filters, setFilters] = useState<ReportFilters>(DEFAULT_REPORT_FILTERS)

  const report = useMemo(() => {
    const filteredSales = filterSales(seedSales, filters)
    const categoryProducts = filterProducts(fruitProducts, filters.category)
    const filteredOrders = filterPurchaseOrders(purchaseOrdersSeed, fruitProducts, filters)
    const poSpendByStatus = getPurchaseOrderSpendByStatus(filteredOrders)

    return {
      filteredSales,
      salesSummary: getSalesSummary(filteredSales),
      inventorySummary: getInventorySummary(categoryProducts),
      poSpendByStatus,
      poSpendCentavos: poSpendByStatus.reduce((total, row) => total + row.spendCentavos, 0),
      salesByCategory: getSalesByCategory(filteredSales, fruitProducts),
      lowStockItems: getLowStockItems(categoryProducts),
      salesSeries: getSalesSeries(filteredSales, filters.datePreset),
      reportRows: getReportRows(filteredSales, fruitProducts)
    }
  }, [filters])

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

  return (
    <section aria-labelledby='reports-title' className='borderline min-w-0 space-y-6 p-4 sm:p-6'>
      <header className='space-y-1'>
        <h1 id='reports-title' className='text-3xl font-semibold'>
          Reports
        </h1>
        <p className='text-muted-foreground text-sm'>Mock data · {getDatePresetLabel(filters.datePreset)}</p>
      </header>

      <ReportsFilters
        filters={filters}
        onDatePresetChange={setDatePreset}
        onCategoryChange={setCategory}
        onResetDatePreset={resetDatePreset}
        onResetCategory={resetCategory}
      />

      <div className='space-y-3'>
        <h2 className='text-base font-semibold'>Summary</h2>
        <ReportsSummary
          sales={salesSummary}
          inventory={inventorySummary}
          poSpendCentavos={poSpendCentavos}
          state={sectionState}
          onClearFilters={clearFilters}
        />
      </div>

      <div className='grid items-stretch gap-4 lg:grid-cols-2'>
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

      <div className='space-y-3'>
        <h2 className='text-base font-semibold'>Sales detail</h2>
        <ReportsTable rows={reportRows} state={sectionState} onClearFilters={clearFilters} />
      </div>
    </section>
  )
}
