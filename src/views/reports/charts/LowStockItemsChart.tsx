import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import type { LowStockItem } from '@/views/reports/ReportsData'
import ReportsState, { type SectionState } from '@/views/reports/ReportsStates'

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

  return (
    <Card className='borderline-surface h-full min-w-0'>
      <CardHeader>
        <h2 className='text-base font-semibold'>Low stock items</h2>
        <CardDescription>Units remaining by item</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-1 flex-col'>
        {sectionState !== 'ready' ? (
          <ReportsState state={sectionState} onClearFilters={onClearFilters} />
        ) : (
          <>
            <ChartContainer
              config={chartConfig}
              className='[&_.recharts-surface:focus-visible]:outline-primary aspect-auto min-h-72 w-full flex-1 [&_.recharts-surface:focus-visible]:outline-2 [&_.recharts-surface:focus-visible]:-outline-offset-2 [&_.recharts-surface:focus-visible]:outline-solid'
              aria-label='Low stock items by remaining quantity'
            >
              <BarChart
                accessibilityLayer
                aria-label='Low stock items by remaining quantity'
                data={data}
                layout='vertical'
                margin={{ left: 8, right: 16 }}
              >
                <CartesianGrid horizontal={false} />
                <XAxis type='number' allowDecimals={false} tickLine={false} axisLine={false} />
                <YAxis dataKey='name' type='category' tickLine={false} axisLine={false} width={112} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent className='borderline-surface' />} />
                <Bar
                  dataKey='quantity'
                  fill='var(--color-quantity)'
                  radius={[0, 4, 4, 0]}
                  isAnimationActive={false}
                />
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
                {data.map(item => (
                  <tr key={item.name}>
                    <th scope='row'>{item.name}</th>
                    <td>{item.quantity}</td>
                    <td>{item.reorderLevel}</td>
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
