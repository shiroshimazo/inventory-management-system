import assert from 'node:assert/strict'
import { createSupplierSchema, supplierInputPatterns } from './SuppliersSchema.ts'
import { suppliersSeed } from './SuppliersData.ts'

const schema = createSupplierSchema([])
const { id, ...valid } = suppliersSeed[0]
for (const supplier of suppliersSeed) assert.equal(schema.safeParse(supplier).success, true)
for (const value of ['', '   ', '1', '<script>alert(1)</script>']) {
  for (const field of Object.keys(valid)) {
    assert.equal(schema.safeParse({ ...valid, [field]: value }).success, false, `${field}: ${value}`)
  }
  const result = schema.safeParse(Object.fromEntries(Object.keys(valid).map(field => [field, value])))
  assert.equal(result.success, false)
  assert.equal(new Set(result.error.issues.map(issue => issue.path[0])).size, 5)
}
assert.equal(schema.safeParse({ name: valid.name }).success, false)
for (const field of ['name', 'contactPerson']) {
  for (const value of ['a', 'a'.repeat(61)]) {
    assert.equal(schema.safeParse({ ...valid, [field]: value }).success, false)
  }
  for (const value of ["Été O'Brien", '水果供应', 'Anne-Marie', 'Jose\u0301 Santos', 'a'.repeat(60)]) {
    assert.equal(schema.safeParse({ ...valid, [field]: value }).success, true, `${field}: ${value}`)
  }
}
for (const name of [valid.name.toUpperCase(), ` ${valid.name.toLowerCase()} `]) {
  const result = createSupplierSchema(suppliersSeed).safeParse({ ...valid, name })
  assert.equal(result.success, false)
  assert.equal(result.error.issues[0].message, 'This supplier name is already used.')
}
assert.equal(createSupplierSchema(suppliersSeed.filter(row => row.id !== id)).safeParse(valid).success, true)
assert.deepEqual(
  schema.parse(Object.fromEntries(Object.entries(valid).map(([key, value]) => [key, ` ${value} `]))),
  valid
)
assert.equal(schema.safeParse({ ...valid, contactPerson: 'Maria 2' }).success, false)
for (const phone of ['+63 917 555 0142', '(02) 8123 4567', '1234567', '1'.repeat(20)]) {
  assert.equal(schema.safeParse({ ...valid, phone }).success, true)
}
for (const phone of ['letters', '123456', '1'.repeat(21), '123+4567', '-------']) {
  assert.equal(schema.safeParse({ ...valid, phone }).success, false)
}
for (const email of ['abc', 'abc@', 'abc@gmail', 'a b@example.com', `${'a'.repeat(243)}@example.com`]) {
  assert.equal(schema.safeParse({ ...valid, email }).success, false)
}
assert.equal(schema.parse({ ...valid, email: 'Orders@Example.com' }).email, 'Orders@Example.com')
assert.equal(createSupplierSchema(suppliersSeed).safeParse({ ...valid, name: 'Shared inbox supplier' }).success, true)
for (const address of ['abcd', 'a'.repeat(161), '12345', 'Market<script>']) {
  assert.equal(schema.safeParse({ ...valid, address }).success, false)
}
for (const address of ['abcde', 'a'.repeat(160), "123 O'Brien St., #2 (North)/A-1"]) {
  assert.equal(schema.safeParse({ ...valid, address }).success, true)
}
assert.equal(supplierInputPatterns.contactPerson.test('Maria2'), false)
assert.equal(supplierInputPatterns.phone.test('123abc'), false)
assert.equal(supplierInputPatterns.name.test('<script>'), false)
console.log('Supplier validation checks passed.')
