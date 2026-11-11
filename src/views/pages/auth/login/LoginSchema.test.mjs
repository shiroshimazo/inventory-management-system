import assert from 'node:assert/strict'
import { test } from 'node:test'
import { loginSchema } from './LoginSchema.ts'

const validInput = { username: 'stock_admin', password: 'Inventory123!' }

test('rejects empty, partial, trivial, whitespace, long, and script-like inputs', () => {
  const invalidInputs = [
    { username: '', password: '' },
    { ...validInput, password: '' },
    { ...validInput, username: '' },
    { username: '1', password: '1' },
    { ...validInput, username: '   ' },
    { ...validInput, password: '        ' },
    { ...validInput, username: 'a'.repeat(21) },
    { ...validInput, password: 'a'.repeat(129) },
    { ...validInput, username: '<script>alert(1)</script>' }
  ]

  for (const input of invalidInputs) {
    const result = loginSchema.safeParse(input)
    assert.equal(result.success, false)
    assert.ok(result.error.issues.every(issue => issue.message.length > 0))
  }

  const emptyResult = loginSchema.safeParse({ username: '', password: '' })
  assert.deepEqual(new Set(emptyResult.error.issues.map(issue => issue.path[0])), new Set(['username', 'password']))
})

test('accepts valid input, trims username, and preserves password exactly', () => {
  assert.deepEqual(loginSchema.parse(validInput), validInput)
  assert.deepEqual(loginSchema.parse({ username: ' stock_admin ', password: ' Inventory123! ' }), {
    username: 'stock_admin',
    password: ' Inventory123! '
  })
  assert.equal(loginSchema.safeParse({ username: 'abc', password: 'a'.repeat(8) }).success, true)
  assert.equal(loginSchema.safeParse({ username: 'a'.repeat(20), password: 'a'.repeat(128) }).success, true)
})
