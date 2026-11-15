import assert from 'node:assert/strict'
import { fruitProducts } from '../products/FruitProductsData.ts'
import { createSaleSchema, getDraftSaleLines, recordSale } from './SalesSchema.ts'
import {
  seedSales,
  getLineTotal,
  getSaleTotal,
  getSaleItemCount,
  getNextSaleReference,
  getSaleDateKey,
  getSaleTimestamp,
  matchesSaleDatePreset,
  matchesSaleSearch,
  formatSaleDate
} from './SalesData.ts'

const schema = createSaleSchema(fruitProducts)
const draft = quantity => ({ lines: [{ productId: 'f1', quantity }] })
assert.equal(getDraftSaleLines(draft('1'), fruitProducts)[0].quantity, 1)
for (const quantity of ['', 'abc', '9'.repeat(400)])
  assert.equal(getDraftSaleLines(draft(quantity), fruitProducts)[0].quantity, 0)
assert.equal(schema.safeParse({ lines: [] }).success, false)
for (const quantity of [
  '',
  ' ',
  '0',
  '999999999999',
  '9'.repeat(400),
  'abc',
  '1.5',
  '-1',
  '+1',
  '1e3',
  '1 0',
  '<script>alert(1)</script>',
  1,
  undefined
]) {
  assert.equal(schema.safeParse(draft(quantity)).success, false, String(quantity))
}
assert.equal(schema.safeParse(draft('1')).success, true, '1 is a valid quantity')
assert.equal(schema.safeParse(draft('210')).success, true)
assert.equal(schema.safeParse(draft('211')).success, false)
assert.equal(schema.safeParse({ lines: [...draft('1').lines, ...draft('1').lines] }).success, false)
for (const productId of ['', 'unknown', 'f7', 'f9'])
  assert.equal(schema.safeParse({ lines: [{ productId, quantity: '1' }] }).success, false)
assert.equal(schema.safeParse({ lines: [draft('1').lines[0], { productId: 'f2', quantity: '' }] }).success, false)
assert.equal(seedSales.length, 6)
assert.deepEqual(seedSales.map(getSaleTotal), [64.8, 57.6, 48.5, 79.5, 58.5, 56.4])
assert.equal(getSaleItemCount(seedSales[0]), 32)
assert.equal(getLineTotal({ ...seedSales[0].lines[0], unitPrice: 0.1, quantity: 3 }), 0.3)
for (const sale of seedSales) {
  assert.equal(
    schema.safeParse({
      lines: sale.lines.map(line => ({ productId: line.productId, quantity: String(line.quantity) }))
    }).success,
    true
  )
  for (const line of sale.lines) {
    const product = fruitProducts.find(product => product.id === line.productId)
    assert.equal(line.unitPrice, product.pricePerKg)
    assert.equal(line.name, product.name)
    assert.equal(line.sku, product.sku)
  }
}
const year = getSaleDateKey(new Date().toISOString()).slice(0, 4)
assert.equal(getNextSaleReference(seedSales), `SO-${year}-117`)
assert.equal(getNextSaleReference([...seedSales].reverse()), `SO-${year}-117`)
assert.equal(getNextSaleReference([]), `SO-${year}-101`)
assert.equal(getNextSaleReference([{ ...seedSales[0], reference: 'SO-2025-999' }]), `SO-${year}-1000`)
assert.match(getSaleTimestamp(), /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+08:00$/)
assert.equal(getSaleDateKey('2026-11-14T16:00:00Z'), '2026-11-15')
assert.equal(formatSaleDate('2026-11-15T09:20:00+08:00'), '15 Nov 2026, 09:20')
const onDate = soldAt => ({ ...seedSales[0], soldAt })
for (const [date, preset, expected] of [
  ['2026-11-15', 'today', true],
  ['2026-11-14', 'today', false],
  ['2026-11-09', 'last-7-days', true],
  ['2026-11-08', 'last-7-days', false],
  ['2026-10-17', 'last-30-days', true],
  ['2026-10-16', 'last-30-days', false],
  ['2026-11-16', 'last-7-days', false],
  ['2025-01-01', 'all', true]
])
  assert.equal(matchesSaleDatePreset(onDate(`${date}T12:00:00+08:00`), preset, '2026-11-15'), expected)
assert.equal(matchesSaleDatePreset(onDate('2026-11-14T16:00:00Z'), 'today', '2026-11-15'), true)
assert.equal(matchesSaleDatePreset(onDate('2026-02-23T12:00:00+08:00'), 'last-7-days', '2026-03-01'), true)
for (const query of [' SO-2026-111 ', 'FUJI', 'fru-002', 'alex TAN', ''])
  assert.equal(matchesSaleSearch(seedSales[0], query), true)
assert.equal(matchesSaleSearch(seedSales[0], 'unmatched'), false)
const originalProducts = structuredClone(fruitProducts)
const result = recordSale(draft('210'), fruitProducts, seedSales)
assert.equal(result.success, true)
assert.equal(result.data.products.find(product => product.id === 'f1').quantity, 0)
assert.equal(getSaleTotal(result.data.sale), 714)
assert.equal(result.data.sale.reference, `SO-${year}-117`)
assert.equal(matchesSaleDatePreset(result.data.sale, 'today'), true)
assert.equal(recordSale(draft('1'), result.data.products, seedSales).success, false)
assert.deepEqual(fruitProducts, originalProducts, 'recording does not mutate catalogue')
assert.deepEqual(
  result.data.products.filter(product => product.id !== 'f1'),
  fruitProducts.filter(product => product.id !== 'f1')
)
const snapshot = structuredClone(result.data.sale)
result.data.products[0].name = 'Changed'
result.data.products[0].pricePerKg = 500
assert.deepEqual(result.data.sale, snapshot)
const stale = recordSale(
  draft('2'),
  fruitProducts.map(product => (product.id === 'f1' ? { ...product, quantity: 1 } : product)),
  seedSales
)
assert.equal(stale.success, false)
assert.equal(stale.error.issues[0].message, 'Only 1 left in Fuji apple.')
console.log('Sales schema, stock, snapshots, totals, references, search and date checks passed.')
