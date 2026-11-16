import { priceFormatter } from '@/views/pages/products/FruitProductsData'
import { CURRENCY_SCALE } from '@/views/pages/purchase-orders/PurchaseOrdersData'

const countFormatter = new Intl.NumberFormat('en-PH')
const dateTickFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC'
})
const monthTickFormatter = new Intl.DateTimeFormat('en-GB', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC'
})

export function formatCentavos(cents: number): string {
  return priceFormatter.format(cents / CURRENCY_SCALE)
}

export function formatCount(value: number): string {
  return countFormatter.format(value)
}

export function formatDateTick(dateKey: string): string {
  const date = new Date(`${dateKey}T00:00:00Z`)
  return Number.isNaN(date.getTime()) ? dateKey : dateTickFormatter.format(date)
}

export function formatMonthTick(monthKey: string): string {
  const date = new Date(`${monthKey}-01T00:00:00Z`)
  return Number.isNaN(date.getTime()) ? monthKey : monthTickFormatter.format(date)
}
