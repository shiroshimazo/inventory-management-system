import assert from 'node:assert/strict'
import { createUserSchema } from './UsersSchema.ts'
import { usersSeed, formatUserDate, getUserJoinedDate } from './UsersData.ts'

const schema = createUserSchema(usersSeed)
const valid = { name: 'Alex Morgan', email: 'alex.morgan@example.com', role: 'Staff', status: 'Active' }
assert.equal(schema.safeParse(valid).success, true)
for (const name of [
  '',
  '   ',
  'a',
  'a'.repeat(61),
  '1',
  '<script>alert(1)</script>',
  '---',
  "'''",
  'Alex\nTan',
  'Alex2'
]) {
  assert.equal(schema.safeParse({ ...valid, name }).success, false, name)
}
for (const name of [
  'Élodie Martin',
  "Liam O'Brien",
  'O’Brien',
  '李 明',
  'Jose\u0301 Martin',
  'Anne-Marie',
  'ab',
  'a'.repeat(60)
]) {
  assert.equal(schema.safeParse({ ...valid, name }).success, true, name)
}
for (const email of [
  '',
  '   ',
  '1',
  'abc',
  'abc@',
  'abc@gmail',
  'a b@example.com',
  'a'.repeat(243) + '@example.com',
  usersSeed[0].email.toUpperCase()
]) {
  assert.equal(schema.safeParse({ ...valid, email }).success, false, email)
}
for (const field of ['role', 'status']) {
  for (const value of ['', ' ', '1', 'Unknown', null, undefined]) {
    assert.equal(schema.safeParse({ ...valid, [field]: value }).success, false)
  }
}
assert.equal(schema.safeParse({ name: '', email: '', role: '', status: '' }).error.issues.length >= 4, true)
assert.equal(schema.safeParse({ name: '1', email: '1', role: '1', status: '1' }).success, false)
assert.equal(schema.safeParse({ name: valid.name }).success, false)
assert.deepEqual(schema.parse({ ...valid, name: ' Alex Morgan ', email: ' alex.morgan@example.com ' }), valid)
assert.equal(
  createUserSchema(usersSeed.filter(user => user.id !== usersSeed[0].id)).safeParse(usersSeed[0]).success,
  true
)
assert.equal(
  createUserSchema(usersSeed.filter(user => user.id !== usersSeed[0].id)).safeParse({
    ...usersSeed[0],
    email: usersSeed[1].email
  }).success,
  false
)
for (const user of usersSeed) assert.equal(createUserSchema([]).safeParse(user).success, true)
assert.equal(new Set(usersSeed.map(user => user.email)).size, 8)
assert.equal(formatUserDate('2025-01-15'), '15 Jan 2025')
assert.match(getUserJoinedDate(), /^\d{4}-\d{2}-\d{2}$/)
console.log('User validation checks passed.')
