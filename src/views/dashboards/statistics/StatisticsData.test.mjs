import assert from 'node:assert/strict'
import { test } from 'node:test'
import { withMockStatisticsHistory } from './StatisticsData.ts'

test('mock histories preserve latest KPI values and keep counts nonnegative', () => {
  const [up, down, flat] = withMockStatisticsHistory([
    { label: 'Total products', icon: [], value: 12 },
    { label: 'Out of stock', icon: [], value: 0, trend: 'down' },
    { label: 'Orders', icon: [], value: 0 }
  ])

  for (const statistic of [up, down, flat]) {
    assert.equal(statistic.data.length, 24)
    assert.equal(statistic.data.at(-1).value, statistic.value)
    assert.ok(statistic.data.every(point => Number.isInteger(point.value) && point.value >= 0))
  }

  assert.ok(up.data[0].value < up.value)
  assert.ok(down.data[0].value > down.value)
  assert.ok(flat.data.every(point => point.value === flat.value))
})
