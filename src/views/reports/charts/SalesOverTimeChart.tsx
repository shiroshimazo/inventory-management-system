import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { type ReportDatePreset, type SalesPoint } from '@/views/reports/ReportsData'
import { formatCentavos, formatDateTick, formatMonthTick } from '@/views/reports/ReportsFormat'
import ReportsState, { type SectionState } from '@/views/reports/ReportsStates'

const chartConfig = {
  revenueCentavos: { label: 'Revenue', color: 'var(--primary)' }
} satisfies ChartConfig

const chartClassName =
  '[&_.recharts-surface:focus-visible]:outline-primary aspect-auto min-h-72 w-full flex-1 [&_.recharts-surface:focus-visible]:outline-2 [&_.recharts-surface:focus-visible]:-outline-offset-2 [&_.recharts-surface:focus-visible]:outline-solid'

export default function SalesOverTimeChart({
  points,
  datePreset,
  state,
  onClearFilters
}: {
  points: SalesPoint[]
  datePreset: ReportDatePreset
  state: SectionState
  onClearFilters: () => void
}) {
  const tickFormatter = datePreset === 'all' ? formatMonthTick : formatDateTick
  const ariaLabel = 'Revenue over time'

  return (
    <Card className='borderline-surface h-full min-w-0'>
      <CardHeader>
        <h2 className='text-base font-semibold'>Sales over time</h2>
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
              <AreaChart accessibilityLayer aria-label={ariaLabel} data={points} margin={{ left: 4, right: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey='label' tickFormatter={tickFormatter} tickLine={false} axisLine={false} minTickGap={16} />
                <YAxis tickLine={false} axisLine={false} width={56} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className='borderline-surface'
                      labelFormatter={label => tickFormatter(String(label))}
                      formatter={value => (
                        <div className='flex w-full items-center justify-between gap-4'>
                          <span className='text-muted-foreground'>Revenue</span>
                          <span className='font-mono font-medium tabular-nums'>{formatCentavos(Number(value))}</span>
                        </div>
                      )}
                    />
                  }
                />
                <Area
                  dataKey='revenueCentavos'
                  name='Revenue'
                  type='monotone'
                  fill='var(--color-revenueCentavos)'
                  stroke='var(--color-revenueCentavos)'
                  fillOpacity={0.2}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ChartContainer>
            <table className='sr-only'>
              <caption>Revenue over time</caption>
              <thead>
                <tr>
                  <th scope='col'>Date</th>
                  <th scope='col'>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {points.map(point => (
                  <tr key={point.label}>
                    <th scope='row'>{tickFormatter(point.label)}</th>
                    <td>{formatCentavos(point.revenueCentavos)}</td>
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
