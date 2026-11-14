import assert from 'node:assert/strict'
import { createProductSchema } from './ProductSchema.ts'
import { fruitProducts } from './FruitProductsData.ts'
const schema = createProductSchema(fruitProducts)
const valid = {
  name: 'Apple & pear',
  sku: 'new-001',
  category: 'Pome',
  pricePerKg: '2.50',
  weightKg: '0',
  quantity: '0',
  reorderLevel: '1000000'
}
assert.equal(schema.safeParse(valid).success, true)
for (const field of Object.keys(valid)) {
  for (const value of ['', '   ']) assert.equal(schema.safeParse({ ...valid, [field]: value }).success, false)
}
for (const field of ['pricePerKg', 'weightKg', 'quantity', 'reorderLevel']) {
  for (const value of ['-1', '1000001', 'NaN', 'Infinity', '1e3', '0x10', '1.001']) {
    assert.equal(schema.safeParse({ ...valid, [field]: value }).success, false)
  }
}
for (const patch of [
  { name: '1' },
  { name: 'a'.repeat(61) },
  { name: '<script>alert(1)</script>' },
  { sku: ' fru-001 ' },
  { sku: 'ab' },
  { sku: 'a'.repeat(21) },
  { category: 'Other' },
  { pricePerKg: '0' },
  { quantity: '1.5' },
  { reorderLevel: '1.5' }
])
  assert.equal(schema.safeParse({ ...valid, ...patch }).success, false)
assert.equal(schema.safeParse({ ...valid, pricePerKg: '1000000', weightKg: '1000000' }).success, true)
assert.equal(new Set(fruitProducts.map(product => product.sku)).size, 12)
console.log('Product validation checks passed.')
