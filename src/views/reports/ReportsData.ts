import { categoriesSeed } from '@/views/pages/categories/CategoriesData'
import {
  fruitProducts,
  getStockStatus,
  type FruitProduct
} from '@/views/pages/products/FruitProductsData'
import {
  formatSaleDate,
  getSaleDateKey,
  type Sale,
  type SaleLine
} from '@/views/pages/sales/SalesData'
import {
  CURRENCY_SCALE,
  getPurchaseOrderToday,
  getPurchaseOrderTotal,
  purchaseOrderStatuses,
  type PurchaseOrder,
  type PurchaseOrderStatus
} from '@/views/pages/purchase-orders/PurchaseOrdersData'

export type ReportDatePreset = 'today' | 'last-7-days' | 'last-30-days' | 'last-90-days' | 'all'

export const REPORT_DATE_PRESETS: { value: ReportDatePreset; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'last-7-days', label: 'Last 7 days' },
  { value: 'last-30-days', label: 'Last 30 days' },
  { value: 'last-90-days', label: 'Last 90 days' },
  { value: 'all', label: 'All dates' }
]

export const DEFAULT_DATE_PRESET: ReportDatePreset = 'last-30-days'
export const ALL_CATEGORIES = 'all'
export const DEFAULT_REPORT_FILTERS: ReportFilters = {
  datePreset: DEFAULT_DATE_PRESET,
  category: ALL_CATEGORIES
}

const UNCATEGORISED = 'Uncategorised'
const ALL_CATEGORY_NAMES = categoriesSeed.map(category => category.name)

export function getDatePresetLabel(preset: ReportDatePreset): string {
  return REPORT_DATE_PRESETS.find(item => item.value === preset)?.label ?? ''
}

export type ReportFilters = { datePreset: ReportDatePreset; category: string }
export type SalesSummary = {
  revenueCentavos: number
  orderCount: number
  averageOrderCentavos: number
}
export type InventorySummary = {
  inventoryValueCentavos: number
  totalUnits: number
  lowStockCount: number
  outOfStockCount: number
}
export type CategorySale = { category: string; revenueCentavos: number; unitsSold: number }
export type TopProduct = {
  productId: string
  name: string
  sku: string
  unitsSold: number
  revenueCentavos: number
}
export type CategoryStock = { category: string; units: number; valueCentavos: number }
export type SalesPoint = { label: string; revenueCentavos: number }
export type ReportRow = {
  id: string
  reference: string
  soldAt: string
  dateLabel: string
  productName: string
  category: string
  units: number
  totalCentavos: number
}
export type LowStockItem = { name: string; quantity: number; reorderLevel: number }
export type StatusSpend = { status: PurchaseOrderStatus; spendCentavos: number; count: number }

function toCentavos(peso: number): number {
  return Math.round(peso * CURRENCY_SCALE)
}

function getLineRevenueCentavos(line: SaleLine): number {
  return Math.round(line.unitPrice * CURRENCY_SCALE) * line.quantity
}

function getProductCategory(productId: string, products: FruitProduct[]): string {
  return products.find(product => product.id === productId)?.category ?? UNCATEGORISED
}

function isDateKeyInPreset(
  dateKey: string,
  preset: ReportDatePreset,
  todayKey = getPurchaseOrderToday()
): boolean {
  if (preset === 'all') return true
  const days = preset === 'last-90-days' ? 89 : preset === 'last-30-days' ? 29 : preset === 'last-7-days' ? 6 : 0
  const start = new Date(`${todayKey}T00:00:00Z`)
  start.setUTCDate(start.getUTCDate() - days)
  const startKey = start.toISOString().slice(0, 10)
  return dateKey >= startKey && dateKey <= todayKey
}

export function filterSales(sales: Sale[], filters: ReportFilters): Sale[] {
  return sales.filter(sale => {
    if (!isDateKeyInPreset(getSaleDateKey(sale.soldAt), filters.datePreset)) return false
    if (filters.category === ALL_CATEGORIES) return true
    return sale.lines.some(line => getProductCategory(line.productId, fruitProducts) === filters.category)
  })
}

export function filterProducts(products: FruitProduct[], category: string): FruitProduct[] {
  if (category === ALL_CATEGORIES) return products
  return products.filter(product => product.category === category)
}

export function filterPurchaseOrders(
  orders: PurchaseOrder[],
  products: FruitProduct[],
  filters: ReportFilters
): PurchaseOrder[] {
  return orders.filter(order => {
    if (!isDateKeyInPreset(order.orderDate, filters.datePreset)) return false
    if (filters.category === ALL_CATEGORIES) return true
    return order.lines.some(line => getProductCategory(line.productId, products) === filters.category)
  })
}

export function getSalesSummary(sales: Sale[]): SalesSummary {
  const revenueCentavos = sales.reduce(
    (total, sale) => total + sale.lines.reduce((sum, line) => sum + getLineRevenueCentavos(line), 0),
    0
  )
  const orderCount = sales.length
  return {
    revenueCentavos,
    orderCount,
    averageOrderCentavos: orderCount ? Math.round(revenueCentavos / orderCount) : 0
  }
}

export function getInventorySummary(products: FruitProduct[]): InventorySummary {
  return {
    inventoryValueCentavos: products.reduce(
      (total, product) => total + toCentavos(product.quantity * product.pricePerKg),
      0
    ),
    totalUnits: products.reduce((total, product) => total + product.quantity, 0),
    lowStockCount: products.filter(product => getStockStatus(product) === 'Low stock').length,
    outOfStockCount: products.filter(product => getStockStatus(product) === 'Out of stock').length
  }
}

export function getPurchaseOrderSpendByStatus(orders: PurchaseOrder[]): StatusSpend[] {
  const rows = new Map<PurchaseOrderStatus, StatusSpend>(
    purchaseOrderStatuses.map(status => [status, { status, spendCentavos: 0, count: 0 }] as const)
  )
  for (const order of orders) {
    const row = rows.get(order.status)
    if (!row) continue
    row.spendCentavos += toCentavos(getPurchaseOrderTotal(order.lines))
    row.count += 1
  }
  return Array.from(rows.values())
}

export function getSalesByCategory(sales: Sale[], products: FruitProduct[]): CategorySale[] {
  const totals = new Map<string, CategorySale>(
    ALL_CATEGORY_NAMES.map(category => [category, { category, revenueCentavos: 0, unitsSold: 0 }] as const)
  )
  for (const sale of sales) {
    for (const line of sale.lines) {
      const category = getProductCategory(line.productId, products)
      const row = totals.get(category) ?? { category, revenueCentavos: 0, unitsSold: 0 }
      row.revenueCentavos += getLineRevenueCentavos(line)
      row.unitsSold += line.quantity
      totals.set(category, row)
    }
  }
  return Array.from(totals.values())
}

export function getTopSellingProducts(sales: Sale[]): TopProduct[] {
  const totals = new Map<string, TopProduct>()
  for (const sale of sales) {
    for (const line of sale.lines) {
      const row = totals.get(line.productId) ?? {
        productId: line.productId,
        name: line.name,
        sku: line.sku,
        unitsSold: 0,
        revenueCentavos: 0
      }
      row.unitsSold += line.quantity
      row.revenueCentavos += getLineRevenueCentavos(line)
      totals.set(line.productId, row)
    }
  }
  return Array.from(totals.values()).sort(
    (a, b) => b.unitsSold - a.unitsSold || b.revenueCentavos - a.revenueCentavos || a.name.localeCompare(b.name)
  )
}

export function getStockByCategory(products: FruitProduct[]): CategoryStock[] {
  const totals = new Map<string, CategoryStock>()
  for (const product of products) {
    const row = totals.get(product.category) ?? { category: product.category, units: 0, valueCentavos: 0 }
    row.units += product.quantity
    row.valueCentavos += toCentavos(product.quantity * product.pricePerKg)
    totals.set(product.category, row)
  }
  return Array.from(totals.values()).sort((a, b) => a.category.localeCompare(b.category))
}

export function getLowStockItems(products: FruitProduct[]): LowStockItem[] {
  return products
    .filter(product => getStockStatus(product) === 'Low stock')
    .map(product => ({ name: product.name, quantity: product.quantity, reorderLevel: product.reorderLevel }))
    .sort((a, b) => a.quantity - b.quantity || a.name.localeCompare(b.name))
}

export function getSalesSeries(sales: Sale[], preset: ReportDatePreset): SalesPoint[] {
  const totals = new Map<string, number>()
  for (const sale of sales) {
    const dateKey = getSaleDateKey(sale.soldAt)
    const label = preset === 'all' ? dateKey.slice(0, 7) : dateKey
    const revenue = sale.lines.reduce((sum, line) => sum + getLineRevenueCentavos(line), 0)
    totals.set(label, (totals.get(label) ?? 0) + revenue)
  }
  return Array.from(totals, ([label, revenueCentavos]) => ({ label, revenueCentavos })).sort((a, b) =>
    a.label.localeCompare(b.label)
  )
}

export function getReportRows(sales: Sale[], products: FruitProduct[]): ReportRow[] {
  const rows: ReportRow[] = []
  for (const sale of sales) {
    const dateLabel = formatSaleDate(sale.soldAt)
    sale.lines.forEach((line, index) => {
      rows.push({
        id: `${sale.id}-${index}`,
        reference: sale.reference,
        soldAt: sale.soldAt,
        dateLabel,
        productName: line.name,
        category: getProductCategory(line.productId, products),
        units: line.quantity,
        totalCentavos: getLineRevenueCentavos(line)
      })
    })
  }
  return rows
}
