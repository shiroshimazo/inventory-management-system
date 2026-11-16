import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { type CategorySale } from '@/views/reports/ReportsData'
import { formatCentavos } from '@/views/reports/ReportsFormat'
import ReportsState, { type SectionState } from '@/views/reports/ReportsStates'

const chartConfig = {
  revenueCentavos: { label: 'Revenue', color: 'var(--primary)' }
} satisfies ChartConfig

const chartClassName =
  '[&_.recharts-surface:focus-visible]:outline-primary aspect-auto min-h-72 w-full flex-1 [&_.recharts-surface:focus-visible]:outline-2 [&_.recharts-surface:focus-visible]:-outline-offset-2 [&_.recharts-surface:focus-visible]:outline-solid'

export default function SalesByCategoryChart({
  data,
  state,
  onClearFilters
}: {
  data: CategorySale[]
  state: SectionState
  onClearFilters: () => void
}) {
  const ariaLabel = 'Revenue by category'

  return (
    <Card className='borderline-surface h-full min-w-0'>
      <CardHeader>
        <h2 className='text-base font-semibold'>Sales by category</h2>
        <CardDescription>Revenue in PHP</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-1 flex-col'>
        {state !== 'ready' ? (
          <div className='flex min-h-72 flex-1 items-center justify-center'>
            <ReportsState state={state} onClearFilters={onClearFilters} />
          </div>
        ) : (
          <>
            <ChartContainer config={chartConfig} className={chartClassName} aria-label={ariaLabel}>
              <BarChart accessibilityLayer aria-label={ariaLabel} data={data} margin={{ left: 4, right: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey='category' tickLine={false} axisLine={false} minTickGap={16} />
                <YAxis tickLine={false} axisLine={false} width={56} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className='borderline-surface'
                      formatter={value => (
                        <div className='flex w-full items-center justify-between gap-4'>
                          <span className='text-muted-foreground'>Revenue</span>
                          <span className='font-mono font-medium tabular-nums'>{formatCentavos(Number(value))}</span>
                        </div>
                      )}
                    />
                  }
                />
                <Bar
                  dataKey='revenueCentavos'
                  name='Revenue'
                  fill='var(--color-revenueCentavos)'
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            </ChartContainer>
            <table className='sr-only'>
              <caption>Revenue by category</caption>
              <thead>
                <tr>
                  <th scope='col'>Category</th>
                  <th scope='col'>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item.category}>
                    <th scope='row'>{item.category}</th>
                    <td>{formatCentavos(item.revenueCentavos)}</td>
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
