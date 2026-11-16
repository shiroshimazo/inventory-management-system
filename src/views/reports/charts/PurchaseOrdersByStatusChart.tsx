import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import type { StatusSpend } from '@/views/reports/ReportsData'
import { formatCentavos } from '@/views/reports/ReportsFormat'
import ReportsState, { type SectionState } from '@/views/reports/ReportsStates'

const statusColor: Record<StatusSpend['status'], string> = {
  Received: 'var(--up-text)',
  Cancelled: 'var(--down-text)',
  Draft: 'var(--muted-foreground)',
  Ordered: 'var(--primary)'
}

const chartConfig = {
  status: { label: 'Status' },
  spendCentavos: { label: 'Spend' }
} satisfies ChartConfig

type Props = {
  data: StatusSpend[]
  state: SectionState
  onClearFilters: () => void
}

export default function PurchaseOrdersByStatusChart({ data, state, onClearFilters }: Props) {
  const sectionState: SectionState = state === 'ready' && data.length === 0 ? 'empty' : state

  return (
    <Card className='borderline-surface h-full min-w-0'>
      <CardHeader>
        <h2 className='text-base font-semibold'>PO spend by status</h2>
        <CardDescription>Spend per order status</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-1 flex-col'>
        {sectionState !== 'ready' ? (
          <ReportsState state={sectionState} onClearFilters={onClearFilters} />
        ) : (
          <>
            <ChartContainer
              config={chartConfig}
              className='[&_.recharts-surface:focus-visible]:outline-primary aspect-auto min-h-72 w-full flex-1 [&_.recharts-surface:focus-visible]:outline-2 [&_.recharts-surface:focus-visible]:-outline-offset-2 [&_.recharts-surface:focus-visible]:outline-solid'
              aria-label='Purchase order spend by status'
            >
              <BarChart accessibilityLayer aria-label='Purchase order spend by status' data={data} margin={{ top: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey='status' tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={48} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className='borderline-surface'
                      formatter={value => (
                        <div className='flex flex-1 justify-between gap-4 leading-none'>
                          <span className='text-muted-foreground'>Spend</span>
                          <span className='text-foreground font-mono font-medium tabular-nums'>
                            {formatCentavos(Number(value))}
                          </span>
                        </div>
                      )}
                    />
                  }
                />
                <Bar dataKey='spendCentavos' radius={[4, 4, 0, 0]} isAnimationActive={false}>
                  {data.map(item => (
                    <Cell key={item.status} fill={statusColor[item.status]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
            <table className='sr-only'>
              <caption>Purchase order spend by status</caption>
              <thead>
                <tr>
                  <th scope='col'>Status</th>
                  <th scope='col'>Orders</th>
                  <th scope='col'>Spend</th>
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item.status}>
                    <th scope='row'>{item.status}</th>
                    <td>{item.count}</td>
                    <td>{formatCentavos(item.spendCentavos)}</td>
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
