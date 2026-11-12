import assert from 'node:assert/strict'
import { test } from 'node:test'
import { previewCode, recoveryCodeSchema, recoveryEmailSchema, recoveryPasswordSchema } from './RecoverySchema.ts'

test('email rejects empty, malformed, whitespace, long and script inputs', () => {
  for (const email of [
    '',
    '1',
    '   ',
    'abc',
    'abc@',
    'abc@gmail',
    'a'.repeat(255) + '@example.com',
    '<script>alert(1)</script>'
  ]) {
    assert.equal(recoveryEmailSchema.safeParse({ email }).success, false, email)
  }
  assert.deepEqual(recoveryEmailSchema.parse({ email: ' staff@example.com ' }), { email: 'staff@example.com' })
})

test('only the complete public preview code advances verification', () => {
  for (const code of ['', '1', '12345', '1234567', '000000', 'abcdef', '      ', '<script>']) {
    assert.equal(recoveryCodeSchema.safeParse({ code }).success, false, code)
  }
  assert.equal(recoveryCodeSchema.safeParse({ code: previewCode }).success, true)
})

test('password rejects empty, partial, mismatched, trivial, whitespace and long inputs', () => {
  const valid = { email: 'staff@example.com', password: 'Inventory-river-47!', confirmPassword: 'Inventory-river-47!' }
  for (const password of [
    '',
    '1',
    '        ',
    '11111111',
    'password',
    'password123',
    '12345678',
    valid.email,
    'x'.repeat(129)
  ]) {
    assert.equal(recoveryPasswordSchema.safeParse({ ...valid, password, confirmPassword: password }).success, false)
  }
  assert.equal(recoveryPasswordSchema.safeParse({ ...valid, confirmPassword: '' }).success, false)
  assert.equal(recoveryPasswordSchema.safeParse({ ...valid, password: '' }).success, false)
  assert.equal(recoveryPasswordSchema.safeParse({ ...valid, confirmPassword: 'Different-password' }).success, false)
  const empty = recoveryPasswordSchema.safeParse({ ...valid, password: '', confirmPassword: '' })
  assert.deepEqual(new Set(empty.error.issues.map(issue => issue.path[0])), new Set(['password', 'confirmPassword']))
  assert.deepEqual(recoveryPasswordSchema.parse(valid), valid)
  for (const password of [' Inventory-river-47! ', '<script>alert(1)</script>']) {
    assert.equal(recoveryPasswordSchema.parse({ ...valid, password, confirmPassword: password }).password, password)
  }
})
