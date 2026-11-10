import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { getStockMovementData, type StockMovement } from '@/views/dashboards/InventoryMockData'

const chartConfig = {
  stockIn: { label: 'Stock-in', color: 'var(--primary)' },
  stockOut: { label: 'Stock-out', color: 'var(--muted-foreground)' }
} satisfies ChartConfig

const dateFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })
const formatDate = (date: string) => dateFormatter.format(new Date(`${date}T00:00:00Z`))

export default function StockMovementChart({ movements, dates }: { movements: StockMovement[]; dates: string[] }) {
  const chartData = getStockMovementData(movements, dates)
  const hasMovements = chartData.some(day => day.stockIn > 0 || day.stockOut > 0)

  return (
    <Card className='min-w-0 shadow-none'>
      <CardHeader>
        <h2 className='text-base font-semibold'>Stock movement</h2>
        <CardDescription>Stock-in vs stock-out · Units per day</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasMovements ? (
          <p className='text-muted-foreground flex h-72 items-center justify-center'>
            No stock movements in this period.
          </p>
        ) : (
          <>
            <ChartContainer
              config={chartConfig}
              className='[&_.recharts-surface:focus-visible]:outline-primary h-72 w-full [&_.recharts-surface:focus-visible]:outline-2 [&_.recharts-surface:focus-visible]:-outline-offset-2 [&_.recharts-surface:focus-visible]:outline-solid'
              aria-label='Daily stock-in and stock-out units'
            >
              <BarChart accessibilityLayer aria-label='Daily stock-in and stock-out units' data={chartData} barGap={4}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey='date' tickFormatter={formatDate} tickLine={false} axisLine={false} minTickGap={16} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={32} />
                <ChartTooltip content={<ChartTooltipContent labelFormatter={label => formatDate(String(label))} />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey='stockIn' fill='var(--color-stockIn)' radius={[4, 4, 0, 0]} isAnimationActive={false} />
                <Bar dataKey='stockOut' fill='var(--color-stockOut)' radius={[4, 4, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ChartContainer>
            <table className='sr-only'>
              <caption>Daily stock movement in units</caption>
              <thead>
                <tr>
                  <th scope='col'>Date</th>
                  <th scope='col'>Stock-in</th>
                  <th scope='col'>Stock-out</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map(day => (
                  <tr key={day.date}>
                    <th scope='row'>{formatDate(day.date)}</th>
                    <td>{day.stockIn}</td>
                    <td>{day.stockOut}</td>
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
