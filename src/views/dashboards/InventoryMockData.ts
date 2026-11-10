export type InventoryProduct = {
  id: string
  sku: string
  name: string
  quantity: number
  reorderLevel: number
}

export type PurchaseOrder = {
  id: string
  status: 'Pending' | 'Ordered' | 'Received' | 'Cancelled'
}

export type StockMovement = {
  id: string
  productId: string
  type: 'in' | 'out'
  quantity: number
  occurredAt: string
  reference: string
  recordedBy: string
}

export const inventoryProducts: InventoryProduct[] = [
  { id: 'p1', sku: 'GLV-001', name: 'Work gloves (pair)', quantity: 8, reorderLevel: 20 },
  { id: 'p2', sku: 'TAP-048', name: 'Packing tape 48 mm', quantity: 0, reorderLevel: 12 },
  { id: 'p3', sku: 'BLT-M08', name: 'M8 hex bolts (box)', quantity: 6, reorderLevel: 10 },
  { id: 'p4', sku: 'TIE-200', name: 'Cable ties 200 mm (pack)', quantity: 32, reorderLevel: 10 },
  { id: 'p5', sku: 'GOG-001', name: 'Safety goggles', quantity: 4, reorderLevel: 8 },
  { id: 'p6', sku: 'KNF-001', name: 'Utility knife', quantity: 19, reorderLevel: 5 },
  { id: 'p7', sku: 'MSK-010', name: 'Dust masks (box)', quantity: 0, reorderLevel: 6 },
  { id: 'p8', sku: 'LBL-A04', name: 'A4 shipping labels (pack)', quantity: 48, reorderLevel: 15 },
  { id: 'p9', sku: 'WRP-500', name: 'Stretch wrap 500 mm', quantity: 15, reorderLevel: 6 },
  { id: 'p10', sku: 'BIN-050', name: 'Bin liners (roll)', quantity: 22, reorderLevel: 8 },
  { id: 'p11', sku: 'MLR-C05', name: 'Bubble mailers C5 (pack)', quantity: 36, reorderLevel: 10 },
  { id: 'p12', sku: 'MRK-BLK', name: 'Black marker pens (box)', quantity: 12, reorderLevel: 4 }
]

export const purchaseOrders: PurchaseOrder[] = [
  { id: 'PO-2026-038', status: 'Received' },
  { id: 'PO-2026-039', status: 'Received' },
  { id: 'PO-2026-040', status: 'Received' },
  { id: 'PO-2026-041', status: 'Received' },
  { id: 'PO-2026-042', status: 'Received' },
  { id: 'PO-2026-043', status: 'Pending' },
  { id: 'PO-2026-044', status: 'Pending' },
  { id: 'PO-2026-045', status: 'Ordered' },
  { id: 'PO-2026-046', status: 'Cancelled' }
]

export const movementDates = [
  '2026-11-04',
  '2026-11-05',
  '2026-11-06',
  '2026-11-07',
  '2026-11-08',
  '2026-11-09',
  '2026-11-10'
]

export const stockMovements: StockMovement[] = [
  {
    id: 'm1',
    productId: 'p8',
    type: 'in',
    quantity: 30,
    occurredAt: '2026-11-04T09:15:00+08:00',
    reference: 'PO-2026-038',
    recordedBy: 'Alex Tan'
  },
  {
    id: 'm2',
    productId: 'p6',
    type: 'out',
    quantity: 3,
    occurredAt: '2026-11-04T14:20:00+08:00',
    reference: 'SO-2026-101',
    recordedBy: 'Mia Santos'
  },
  {
    id: 'm3',
    productId: 'p4',
    type: 'in',
    quantity: 20,
    occurredAt: '2026-11-05T10:10:00+08:00',
    reference: 'PO-2026-039',
    recordedBy: 'Alex Tan'
  },
  {
    id: 'm4',
    productId: 'p1',
    type: 'out',
    quantity: 8,
    occurredAt: '2026-11-05T16:30:00+08:00',
    reference: 'SO-2026-102',
    recordedBy: 'Mia Santos'
  },
  {
    id: 'm5',
    productId: 'p2',
    type: 'out',
    quantity: 12,
    occurredAt: '2026-11-06T11:05:00+08:00',
    reference: 'SO-2026-103',
    recordedBy: 'Mia Santos'
  },
  {
    id: 'm6',
    productId: 'p5',
    type: 'out',
    quantity: 6,
    occurredAt: '2026-11-06T14:45:00+08:00',
    reference: 'SO-2026-104',
    recordedBy: 'Alex Tan'
  },
  {
    id: 'm7',
    productId: 'p9',
    type: 'in',
    quantity: 12,
    occurredAt: '2026-11-07T09:30:00+08:00',
    reference: 'PO-2026-040',
    recordedBy: 'Alex Tan'
  },
  {
    id: 'm8',
    productId: 'p3',
    type: 'out',
    quantity: 4,
    occurredAt: '2026-11-07T13:10:00+08:00',
    reference: 'SO-2026-105',
    recordedBy: 'Mia Santos'
  },
  {
    id: 'm9',
    productId: 'p11',
    type: 'in',
    quantity: 30,
    occurredAt: '2026-11-09T10:00:00+08:00',
    reference: 'PO-2026-041',
    recordedBy: 'Alex Tan'
  },
  {
    id: 'm10',
    productId: 'p7',
    type: 'out',
    quantity: 10,
    occurredAt: '2026-11-09T12:15:00+08:00',
    reference: 'SO-2026-106',
    recordedBy: 'Mia Santos'
  },
  {
    id: 'm11',
    productId: 'p12',
    type: 'out',
    quantity: 4,
    occurredAt: '2026-11-09T15:20:00+08:00',
    reference: 'SO-2026-107',
    recordedBy: 'Alex Tan'
  },
  {
    id: 'm12',
    productId: 'p10',
    type: 'in',
    quantity: 20,
    occurredAt: '2026-11-10T08:45:00+08:00',
    reference: 'PO-2026-042',
    recordedBy: 'Alex Tan'
  },
  {
    id: 'm13',
    productId: 'p1',
    type: 'out',
    quantity: 4,
    occurredAt: '2026-11-10T10:20:00+08:00',
    reference: 'SO-2026-108',
    recordedBy: 'Mia Santos'
  },
  {
    id: 'm14',
    productId: 'p8',
    type: 'out',
    quantity: 6,
    occurredAt: '2026-11-10T13:05:00+08:00',
    reference: 'SO-2026-109',
    recordedBy: 'Mia Santos'
  },
  {
    id: 'm15',
    productId: 'p4',
    type: 'out',
    quantity: 8,
    occurredAt: '2026-11-10T15:40:00+08:00',
    reference: 'SO-2026-110',
    recordedBy: 'Alex Tan'
  }
]

export function getInventorySummary(products: InventoryProduct[], orders: PurchaseOrder[]) {
  return {
    totalProducts: products.length,
    lowStockItems: products.filter(product => product.quantity < product.reorderLevel).length,
    outOfStock: products.filter(product => product.quantity === 0).length,
    pendingPurchaseOrders: orders.filter(order => order.status === 'Pending').length
  }
}

export function getStockMovementData(movements: StockMovement[], dates: string[]) {
  // shortcut: mock timestamps share UTC+08:00; group by warehouse timezone if API timestamps use mixed offsets.
  return dates.map(date => ({
    date,
    stockIn: movements
      .filter(movement => movement.occurredAt.startsWith(date) && movement.type === 'in')
      .reduce((total, movement) => total + movement.quantity, 0),
    stockOut: movements
      .filter(movement => movement.occurredAt.startsWith(date) && movement.type === 'out')
      .reduce((total, movement) => total + movement.quantity, 0)
  }))
}
