import { fruitProducts, priceFormatter } from '../products/FruitProductsData.ts'

export { priceFormatter }
export type SaleLine = { productId: string; name: string; sku: string; quantity: number; unitPrice: number }
export type Sale = { id: string; reference: string; soldAt: string; lines: SaleLine[]; recordedBy: string }
export type SaleDatePreset = 'all' | 'today' | 'last-7-days' | 'last-30-days'

// Replace the preview name with the authenticated session user when auth exists.
export const CURRENT_USER_NAME = 'Alex Tan'
export const SALES_TIME_ZONE = 'Asia/Manila'
const CURRENCY_SCALE = 100
const dateKeyFormatter = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: SALES_TIME_ZONE
})
const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: SALES_TIME_ZONE
})
const timeFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
  timeZone: SALES_TIME_ZONE
})

export function getLineTotal(line: SaleLine): number {
  return (Math.round(line.unitPrice * CURRENCY_SCALE) * line.quantity) / CURRENCY_SCALE
}
export function getSaleTotal(sale: Sale): number {
  return sale.lines.reduce((total, line) => total + Math.round(getLineTotal(line) * CURRENCY_SCALE), 0) / CURRENCY_SCALE
}
export function getSaleItemCount(sale: Sale): number {
  return sale.lines.reduce((total, line) => total + line.quantity, 0)
}
export function getSaleDateKey(soldAt: string): string {
  const parts = dateKeyFormatter.formatToParts(new Date(soldAt))
  return ['year', 'month', 'day'].map(type => parts.find(part => part.type === type)!.value).join('-')
}
export function getSaleTimestamp(): string {
  const now = new Date()
  return `${getSaleDateKey(now.toISOString())}T${timeFormatter.format(now)}+08:00`
}
export function getNextSaleReference(sales: Sale[]): string {
  const sequence = sales.length ? Math.max(...sales.map(sale => Number(sale.reference.split('-')[2]))) + 1 : 101
  return `SO-${getSaleDateKey(new Date().toISOString()).slice(0, 4)}-${String(sequence).padStart(3, '0')}`
}
export function formatSaleDate(soldAt: string): string {
  return dateFormatter.format(new Date(soldAt))
}
export function matchesSaleDatePreset(
  sale: Sale,
  preset: SaleDatePreset,
  todayKey = getSaleDateKey(new Date().toISOString())
): boolean {
  if (preset === 'all') return true
  const dateKey = getSaleDateKey(sale.soldAt)
  const start = new Date(`${todayKey}T00:00:00Z`)
  const days = preset === 'last-30-days' ? 29 : preset === 'last-7-days' ? 6 : 0
  start.setUTCDate(start.getUTCDate() - days)
  return dateKey >= start.toISOString().slice(0, 10) && dateKey <= todayKey
}
export function matchesSaleSearch(sale: Sale, search: string): boolean {
  const query = search.trim().toLowerCase()
  return [sale.reference, sale.recordedBy, ...sale.lines.flatMap(line => [line.name, line.sku])].some(value =>
    value.toLowerCase().includes(query)
  )
}

function seedSale(
  id: string,
  reference: string,
  soldAt: string,
  quantities: [string, number][],
  recordedBy: string
): Sale {
  return {
    id,
    reference,
    soldAt,
    recordedBy,
    lines: quantities.map(([productId, quantity]) => {
      const product = fruitProducts.find(product => product.id === productId)!
      return { productId, name: product.name, sku: product.sku, quantity, unitPrice: product.pricePerKg }
    })
  }
}

// Display history only: catalogue quantities already represent stock after these sales.
export const seedSales: Sale[] = [
  seedSale(
    's1',
    'SO-2026-111',
    '2026-11-11T09:20:00+08:00',
    [
      ['f1', 12],
      ['f2', 20]
    ],
    'Alex Tan'
  ),
  seedSale('s2', 'SO-2026-112', '2026-11-12T10:05:00+08:00', [['f3', 6]], 'Mia Santos'),
  seedSale(
    's3',
    'SO-2026-113',
    '2026-11-13T08:45:00+08:00',
    [
      ['f6', 8],
      ['f10', 4],
      ['f12', 5]
    ],
    'Mia Santos'
  ),
  seedSale(
    's4',
    'SO-2026-114',
    '2026-11-13T15:30:00+08:00',
    [
      ['f5', 15],
      ['f8', 10]
    ],
    'Alex Tan'
  ),
  seedSale('s5', 'SO-2026-115', '2026-11-14T09:10:00+08:00', [['f11', 9]], 'Mia Santos'),
  seedSale(
    's6',
    'SO-2026-116',
    '2026-11-14T16:40:00+08:00',
    [
      ['f2', 30],
      ['f1', 6]
    ],
    'Alex Tan'
  )
]
