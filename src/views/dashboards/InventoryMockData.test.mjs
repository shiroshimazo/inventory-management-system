import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  getInventorySummary,
  getStockMovementData,
  inventoryProducts,
  movementDates,
  purchaseOrders,
  stockMovements
} from './InventoryMockData.ts'

test('summary counts product records, low stock including zero, and only Pending orders', () => {
  assert.deepEqual(getInventorySummary(inventoryProducts, purchaseOrders), {
    totalProducts: 12,
    lowStockItems: 5,
    outOfStock: 2,
    pendingPurchaseOrders: 2
  })
  assert.deepEqual(getInventorySummary([], []), {
    totalProducts: 0,
    lowStockItems: 0,
    outOfStock: 0,
    pendingPurchaseOrders: 0
  })
  const atThreshold = { id: 'boundary', sku: 'TEST', name: 'Boundary', quantity: 5, reorderLevel: 5 }
  assert.equal(getInventorySummary([atThreshold], []).lowStockItems, 0)
})

test('chart sums quantities, retains inactive dates, and excludes dates outside the period', () => {
  const rows = getStockMovementData(stockMovements, movementDates)
  assert.equal(rows.length, 7)
  assert.deepEqual(rows[0], { date: '2026-11-04', stockIn: 30, stockOut: 3 })
  assert.deepEqual(rows[4], { date: '2026-11-08', stockIn: 0, stockOut: 0 })
  assert.deepEqual(rows[6], { date: '2026-11-10', stockIn: 20, stockOut: 18 })
  assert.equal(
    rows.reduce((total, row) => total + row.stockIn, 0),
    112
  )
  assert.equal(
    rows.reduce((total, row) => total + row.stockOut, 0),
    65
  )
  assert.deepEqual(getStockMovementData(stockMovements, ['2026-11-11']), [
    { date: '2026-11-11', stockIn: 0, stockOut: 0 }
  ])
  assert.deepEqual(getStockMovementData([], [movementDates[0]]), [{ date: movementDates[0], stockIn: 0, stockOut: 0 }])
  assert.deepEqual(getStockMovementData(stockMovements, []), [])
})

test('mock ledger references existing products and receipts, with feasible stock balances', () => {
  assert.equal(new Set(inventoryProducts.map(product => product.sku)).size, inventoryProducts.length)
  assert.equal(new Set(stockMovements.map(movement => movement.id)).size, stockMovements.length)
  for (const movement of stockMovements) {
    assert.ok(inventoryProducts.some(product => product.id === movement.productId))
    assert.ok(Number.isInteger(movement.quantity) && movement.quantity > 0)
    assert.ok(movement.occurredAt.endsWith('+08:00'))
    assert.ok(movementDates.includes(movement.occurredAt.slice(0, 10)))
    if (movement.type === 'in') {
      assert.ok(purchaseOrders.some(order => order.id === movement.reference && order.status === 'Received'))
    }
  }
  for (const product of inventoryProducts) {
    const ledger = stockMovements
      .filter(movement => movement.productId === product.id)
      .sort((first, second) => first.occurredAt.localeCompare(second.occurredAt))
    const netChange = ledger.reduce(
      (total, movement) => total + (movement.type === 'in' ? 1 : -1) * movement.quantity,
      0
    )
    let balance = product.quantity - netChange
    assert.ok(balance >= 0, product.sku)
    for (const movement of ledger) {
      balance += (movement.type === 'in' ? 1 : -1) * movement.quantity
      assert.ok(balance >= 0, product.sku)
    }
    assert.equal(balance, product.quantity)
  }
})
