import assert from 'node:assert/strict'
import { createCategorySchema } from './CategoriesSchema.ts'
import { categoriesSeed, getProductCount } from './CategoriesData.ts'
const schema = createCategorySchema(categoriesSeed)
const valid = { name: 'Fresh & dried', description: '' }
assert.equal(schema.safeParse(valid).success, true)
for (const name of ['', '   ', 'a', 'a'.repeat(41), '1', '<script>alert(1)</script>', ' berries ']) {
  assert.equal(schema.safeParse({ ...valid, name }).success, false, name)
}
assert.equal(schema.safeParse({ ...valid, description: 'a'.repeat(121) }).success, false)
assert.equal(
  createCategorySchema(categoriesSeed.filter(row => row.id !== 'c1')).safeParse(categoriesSeed[0]).success,
  true
)
assert.deepEqual(schema.parse({ name: ' Fresh fruit ', description: ' Notes ' }), {
  name: 'Fresh fruit',
  description: 'Notes'
})
for (const name of ["Été's fruit", '水果 2', 'a'.repeat(40)])
  assert.equal(schema.safeParse({ ...valid, name }).success, true)
assert.equal(getProductCount('New category'), 0)
assert.equal(
  categoriesSeed.reduce((total, category) => total + getProductCount(category.name), 0),
  12
)
console.log('Category validation checks passed.')
