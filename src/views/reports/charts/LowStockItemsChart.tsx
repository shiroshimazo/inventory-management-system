import { Bar, BarChart, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import type { LowStockItem } from '@/views/reports/ReportsData'
import { formatCount } from '@/views/reports/ReportsFormat'
import ReportsState, { type SectionState } from '@/views/reports/ReportsStates'
import {
  clampNonNegative,
  getChartMargins,
  reportYAxisProps,
  truncateTick,
  useIsNarrowChart,
  useIsRtl
} from '@/views/reports/charts/ChartAxisHelpers'

const NARROW_ITEM_TICK_MAX_CHARS = 10

const chartConfig = {
  name: { label: 'Item' },
  quantity: { label: 'Quantity', color: 'var(--primary)' }
} satisfies ChartConfig

type Props = {
  data: LowStockItem[]
  state: SectionState
  onClearFilters: () => void
}

export default function LowStockItemsChart({ data, state, onClearFilters }: Props) {
  const sectionState: SectionState = state === 'ready' && data.length === 0 ? 'empty' : state
  const isNarrow = useIsNarrowChart()
  const isRtl = useIsRtl()
  const clampedData = data.map(item => ({ ...item, quantity: clampNonNegative(item.quantity) }))

  return (
    <Card className='borderline-surface h-full min-w-0'>
      <CardHeader>
        <h2 className='text-base font-semibold'>Low stock items</h2>
        <CardDescription>Units remaining by item</CardDescription>
      </CardHeader>
      <CardContent className='flex min-h-0 flex-1 flex-col'>
        {sectionState !== 'ready' ? (
          <div className='flex min-h-52 flex-1 items-center justify-center'>
            <ReportsState state={sectionState} onClearFilters={onClearFilters} />
          </div>
        ) : (
          <>
            <ChartContainer
              config={chartConfig}
              className='[&_.recharts-surface:focus-visible]:outline-primary aspect-auto min-h-52 w-full flex-1 [&_.recharts-surface:focus-visible]:outline-2 [&_.recharts-surface:focus-visible]:-outline-offset-2 [&_.recharts-surface:focus-visible]:outline-solid'
              aria-label='Low stock items by remaining quantity'
            >
              <BarChart
                accessibilityLayer
                aria-label='Low stock items by remaining quantity'
                data={clampedData}
                layout='vertical'
                margin={getChartMargins(isRtl)}
              >
                <XAxis type='number' allowDecimals={false} tickLine={false} axisLine={false} />
                <YAxis
                  {...reportYAxisProps}
                  dataKey='name'
                  type='category'
                  tickFormatter={value => truncateTick(value, isNarrow ? NARROW_ITEM_TICK_MAX_CHARS : undefined)}
                  orientation={isRtl ? 'right' : 'left'}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent className='borderline-surface' />} />
                <Bar dataKey='quantity' fill='var(--color-quantity)' radius={[0, 4, 4, 0]} isAnimationActive={false} />
              </BarChart>
            </ChartContainer>
            <table className='sr-only'>
              <caption>Low stock items with remaining quantity and reorder level</caption>
              <thead>
                <tr>
                  <th scope='col'>Item</th>
                  <th scope='col'>Quantity</th>
                  <th scope='col'>Reorder level</th>
                </tr>
              </thead>
              <tbody>
                {clampedData.map((item, index) => (
                  <tr key={`${item.name}-${index}`}>
                    <th scope='row'>{item.name}</th>
                    <td>{formatCount(item.quantity)}</td>
                    <td>{formatCount(item.reorderLevel)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </CardContent>
    </Card>
  )
}
