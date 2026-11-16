import { priceFormatter } from '../products/FruitProductsData.ts'
import { suppliersSeed } from '../suppliers/SuppliersData.ts'

export { priceFormatter }
export const purchaseOrderStatuses = ['Draft', 'Ordered', 'Received', 'Cancelled'] as const
export type PurchaseOrderStatus = (typeof purchaseOrderStatuses)[number]
export type PurchaseOrderLine = { productId: string; quantity: string; unitCost: string }
export type PurchaseOrder = {
  id: string
  reference: string
  supplierId: string
  orderDate: string
  expectedDate: string
  status: PurchaseOrderStatus
  lines: PurchaseOrderLine[]
}

export const CURRENCY_SCALE = 100
export const MAX_ORDER_QUANTITY = 1_000_000
export const MAX_UNIT_COST = 1_000_000
export const MAX_ORDER_LINES = 12
export const MAX_SEARCH_LENGTH = 100
export const PURCHASE_ORDER_TIME_ZONE = 'Asia/Manila'
export const purchaseOrderInputPatterns = {
  quantity: /^\d{0,7}$/,
  unitCost: /^\d{0,7}(?:\.\d{0,2})?$/,
  date: /^[\d-]{0,10}$/
}
const dateKeyFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: PURCHASE_ORDER_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
})
const dateFormatter = new Intl.DateTimeFormat('en-PH', {
  timeZone: PURCHASE_ORDER_TIME_ZONE,
  year: 'numeric',
  month: 'short',
  day: 'numeric'
})

export function getPurchaseOrderToday(now = new Date()): string {
  const parts = dateKeyFormatter.formatToParts(now)
  return ['year', 'month', 'day'].map(type => parts.find(part => part.type === type)!.value).join('-')
}

export function formatPurchaseOrderDate(date: string): string {
  return dateFormatter.format(new Date(`${date}T00:00:00+08:00`))
}

export function getPurchaseOrderTotal(lines: PurchaseOrderLine[]): number {
  return (
    lines.reduce((total, line) => {
      const quantity = Number(line.quantity)
      const cost = Number(line.unitCost)
      if (!/^\d+$/.test(line.quantity) || !/^\d+(?:\.\d{1,2})?$/.test(line.unitCost)) return total
      if (quantity < 1 || quantity > MAX_ORDER_QUANTITY || cost <= 0 || cost > MAX_UNIT_COST) return total
      return total + quantity * Math.round(cost * CURRENCY_SCALE)
    }, 0) / CURRENCY_SCALE
  )
}

export function getPurchaseOrderSupplier(supplierId: string): string {
  return suppliersSeed.find(supplier => supplier.id === supplierId)?.name ?? 'Unknown supplier'
}

export function matchesPurchaseOrderSearch(order: PurchaseOrder, search: string): boolean {
  const query = search.trim().toLowerCase()
  return [order.reference, getPurchaseOrderSupplier(order.supplierId)].some(value =>
    value.toLowerCase().includes(query)
  )
}

export const purchaseOrdersSeed: PurchaseOrder[] = [
  {
    id: 'po1',
    reference: 'PO-2026-101',
    supplierId: 's6',
    orderDate: '2026-11-10',
    expectedDate: '2026-11-14',
    status: 'Received',
    lines: [{ productId: 'f1', quantity: '40', unitCost: '28.50' }]
  },
  {
    id: 'po2',
    reference: 'PO-2026-102',
    supplierId: 's2',
    orderDate: '2026-11-11',
    expectedDate: '2026-11-17',
    status: 'Ordered',
    lines: [
      { productId: 'f2', quantity: '60', unitCost: '12.00' },
      { productId: 'f7', quantity: '30', unitCost: '20.50' }
    ]
  },
  {
    id: 'po3',
    reference: 'PO-2026-103',
    supplierId: 's5',
    orderDate: '2026-11-12',
    expectedDate: '2026-11-18',
    status: 'Draft',
    lines: [{ productId: 'f3', quantity: '20', unitCost: '65.00' }]
  },
  {
    id: 'po4',
    reference: 'PO-2026-104',
    supplierId: 's3',
    orderDate: '2026-11-13',
    expectedDate: '2026-11-20',
    status: 'Cancelled',
    lines: [{ productId: 'f6', quantity: '30', unitCost: '32.25' }]
  }
]
