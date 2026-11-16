import assert from 'node:assert/strict'
import test from 'node:test'
import { purchaseOrderSchema } from './PurchaseOrdersSchema.ts'
import {
  getPurchaseOrderToday,
  getPurchaseOrderTotal,
  formatPurchaseOrderDate,
  matchesPurchaseOrderSearch,
  purchaseOrdersSeed,
  purchaseOrderInputPatterns,
  MAX_ORDER_LINES
} from './PurchaseOrdersData.ts'

const valid = {
  supplierId: 's1',
  orderDate: '2026-11-16',
  expectedDate: '2026-11-20',
  status: 'Draft',
  lines: [{ productId: 'f1', quantity: '2', unitCost: '28.50' }]
}
const filledWith = value => ({
  supplierId: value,
  orderDate: value,
  expectedDate: value,
  status: value,
  lines: [{ productId: value, quantity: value, unitCost: value }]
})

test('empty, partial, spaces, ones, long, and script values fail without losing individual errors', () => {
  for (const value of ['', ' ', '1', 'x'.repeat(1000), '<script>alert(1)</script>']) {
    const result = purchaseOrderSchema.safeParse(filledWith(value))
    assert.equal(result.success, false)
    for (const name of ['supplierId', 'orderDate', 'expectedDate', 'status', 'lines.0.productId']) {
      assert.ok(
        result.error.issues.some(issue => issue.path.join('.') === name),
        `${value}: ${name}`
      )
    }
  }
  assert.equal(purchaseOrderSchema.safeParse({ ...filledWith(''), supplierId: 's1' }).success, false)
})

test('valid drafts and all seed rows pass; surrounding spaces are trimmed', () => {
  assert.equal(purchaseOrderSchema.safeParse(valid).success, true)
  for (const order of purchaseOrdersSeed) assert.equal(purchaseOrderSchema.safeParse(order).success, true)
  const result = purchaseOrderSchema.parse({
    ...valid,
    supplierId: ' s1 ',
    orderDate: ' 2026-11-16 ',
    lines: [{ productId: ' f1 ', quantity: ' 2 ', unitCost: ' 28.50 ' }]
  })
  assert.equal(result.supplierId, 's1')
  assert.equal(result.lines[0].quantity, '2')
})

test('quantities reject zero, decimals, signs, exponents, letters, overflow and missing values', () => {
  for (const quantity of ['', ' ', '0', '-1', '+1', '1.5', '1e3', 'abc', '1a', '1000001', '9'.repeat(1000)]) {
    assert.equal(
      purchaseOrderSchema.safeParse({ ...valid, lines: [{ ...valid.lines[0], quantity }] }).success,
      false,
      quantity
    )
  }
  assert.equal(
    purchaseOrderSchema.safeParse({ ...valid, lines: [{ ...valid.lines[0], quantity: '1000000' }] }).success,
    true
  )
})

test('costs require positive bounded amounts with at most two decimals', () => {
  for (const unitCost of [
    '',
    ' ',
    '0',
    '-1',
    '0.001',
    '1.234',
    '1e2',
    'Infinity',
    'NaN',
    '1000000.01',
    '<script>alert(1)</script>'
  ]) {
    assert.equal(
      purchaseOrderSchema.safeParse({ ...valid, lines: [{ ...valid.lines[0], unitCost }] }).success,
      false,
      unitCost
    )
  }
  for (const unitCost of ['0.01', '1', '1.2', '1.23', '1000000.00']) {
    assert.equal(
      purchaseOrderSchema.safeParse({ ...valid, lines: [{ ...valid.lines[0], unitCost }] }).success,
      true,
      unitCost
    )
  }
})

test('date checks reject invalid calendar dates and expected dates before order dates', () => {
  for (const orderDate of ['', '2026-02-29', '2026-11-31', '2026-13-01', '0000-01-01', '11/16/2026', '2026-1-1']) {
    assert.equal(purchaseOrderSchema.safeParse({ ...valid, orderDate }).success, false, orderDate)
  }
  assert.equal(purchaseOrderSchema.safeParse({ ...valid, expectedDate: '2026-11-15' }).success, false)
  assert.equal(purchaseOrderSchema.safeParse({ ...valid, expectedDate: valid.orderDate }).success, true)
  assert.equal(purchaseOrderSchema.safeParse({ ...valid, orderDate: '2024-02-29' }).success, true)
})

test('unknown suppliers, products, statuses, empty lines, duplicates and excessive lines fail', () => {
  for (const patch of [
    { supplierId: 'missing' },
    { status: 'Pending' },
    { lines: [] },
    { lines: [{ ...valid.lines[0], productId: 'missing' }] },
    { lines: [valid.lines[0], valid.lines[0]] },
    { lines: Array(MAX_ORDER_LINES + 1).fill(valid.lines[0]) }
  ]) {
    assert.equal(purchaseOrderSchema.safeParse({ ...valid, ...patch }).success, false)
  }
})

test('input guards reject invalid typed and pasted strings, including length overflow', () => {
  for (const value of ['a', '12a', '1.5', '-1', ' ', '<script>alert(1)</script>', '9'.repeat(8)])
    assert.equal(purchaseOrderInputPatterns.quantity.test(value), false)
  for (const value of ['a', '1e2', '1.234', '1,000', '-1', '9'.repeat(8)])
    assert.equal(purchaseOrderInputPatterns.unitCost.test(value), false)
  for (const value of ['abc', '2026/11/16', '2026-11-160'])
    assert.equal(purchaseOrderInputPatterns.date.test(value), false)
  assert.equal(purchaseOrderInputPatterns.quantity.test('12'), true)
  assert.equal(purchaseOrderInputPatterns.unitCost.test('28.50'), true)
  assert.equal(purchaseOrderInputPatterns.date.test('2026-11-16'), true)
})

test('totals derive from lines in centavos; incomplete input cannot produce NaN', () => {
  assert.equal(getPurchaseOrderTotal(valid.lines), 57)
  assert.equal(
    getPurchaseOrderTotal([
      { productId: 'f1', quantity: '3', unitCost: '0.10' },
      { productId: 'f2', quantity: '2', unitCost: '0.20' }
    ]),
    0.7
  )
  assert.equal(getPurchaseOrderTotal([{ productId: '', quantity: '', unitCost: 'NaN' }]), 0)
  assert.equal(getPurchaseOrderTotal([]), 0)
})

test('search matches supplier and reference regardless of case or surrounding spaces', () => {
  assert.equal(matchesPurchaseOrderSearch(purchaseOrdersSeed[0], ' po-2026-101 '), true)
  assert.equal(matchesPurchaseOrderSearch(purchaseOrdersSeed[0], ' CORDILLERA '), true)
  assert.equal(matchesPurchaseOrderSearch(purchaseOrdersSeed[0], 'missing'), false)
  assert.equal(matchesPurchaseOrderSearch(purchaseOrdersSeed[0], ' '), true)
})

test('Manila date boundary and display remain independent of host timezone', () => {
  assert.equal(getPurchaseOrderToday(new Date('2026-11-15T15:59:59Z')), '2026-11-15')
  assert.equal(getPurchaseOrderToday(new Date('2026-11-15T16:00:00Z')), '2026-11-16')
  assert.match(formatPurchaseOrderDate('2026-11-16'), /16/)
})
