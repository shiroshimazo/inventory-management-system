import type { IconSvgElement } from '@hugeicons/react'

export type StatisticsPoint = { value: number }

export type Statistic = {
  label: string
  icon: IconSvgElement
  value: number
  data: readonly StatisticsPoint[]
  kind?: 'area' | 'line'
  formatValue?: (value: number) => string
}

type MockStatistic = Omit<Statistic, 'data'> & { trend?: 'up' | 'down' }

const mockOffsets = [24, 20, 23, 16, 19, 14, 17, 12, 15, 18, 13, 10, 14, 8, 12, 11, 7, 9, 5, 8, 4, 6, 2, 0]
const minimumMockScale = 8

export function withMockStatisticsHistory(statistics: readonly MockStatistic[]): Statistic[] {
  return statistics.map(({ trend = 'up', ...statistic }) => {
    const scale = Math.max(statistic.value, minimumMockScale)
    const direction = trend === 'up' ? -1 : 1
    const data = mockOffsets.map(offset => ({
      value: Math.max(0, statistic.value + direction * Math.round((scale * offset) / 100))
    }))

    return { ...statistic, data }
  })
}
