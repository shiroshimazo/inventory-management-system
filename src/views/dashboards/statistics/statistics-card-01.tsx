import { AreaSparkline, LineSparkline, type SparklineBaseProps } from '@/components/charts/sparkline'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { HugeiconsIcon } from '@/components/ui/hugeicons'
import { cn } from '@/lib/utils'
import type { Statistic, StatisticsPoint } from './StatisticsData'

type StatisticsCardProps = {
  statistic: Statistic
  sparklineProps: Pick<SparklineBaseProps<StatisticsPoint>, 'hoverIndex' | 'onHoverChange'>
}

const trendStyles = {
  up: { color: 'var(--up-text)', badge: 'border-(--up-border) bg-(--up-bg) text-(--up-text)' },
  down: { color: 'var(--down-text)', badge: 'border-(--down-border) bg-(--down-bg) text-(--down-text)' },
  flat: { color: 'var(--text-muted)', badge: 'text-muted-foreground' }
}

const sparklineComponents = { area: AreaSparkline, line: LineSparkline }
const sparklineHeight = 36
const snappyHoverSpring = { stiffness: 600, damping: 45 }
const countFormatter = new Intl.NumberFormat()
const formatCount = (value: number) => countFormatter.format(value)

export default function StatisticsCard({ statistic, sparklineProps }: StatisticsCardProps) {
  const { label, icon, value, data, kind = 'line', formatValue = formatCount } = statistic
  const latest = data.at(-1)?.value ?? value
  const delta = latest - (data[0]?.value ?? latest)
  const trend = trendStyles[delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat']
  const deltaSign = delta > 0 ? '+' : delta < 0 ? '−' : ''
  const lastIndex = data.length - 1
  const selectedIndex = sparklineProps.hoverIndex ?? lastIndex
  const selectedValue = data[selectedIndex]?.value ?? latest
  const Sparkline = sparklineComponents[kind]

  function selectPoint(index: number | null) {
    sparklineProps.onHoverChange?.(index, index === null ? null : (data[index] ?? null))
  }

  return (
    <Card size='sm' className='borderline borderline-surface min-w-0'>
      <CardHeader className='border-b border-(--divider)'>
        <h2 className='flex items-center gap-2 font-medium'>
          <HugeiconsIcon icon={icon} className='size-4 shrink-0' aria-hidden='true' />
          {label}
        </h2>
      </CardHeader>
      <CardContent className='mt-auto flex min-w-0 flex-col gap-2'>
        <div className='flex flex-wrap items-baseline gap-x-2 gap-y-1'>
          <span className='text-2xl font-semibold tabular-nums'>{formatValue(selectedValue)}</span>
          {data.length > 0 && (
            <Badge variant='outline' className={cn('tabular-nums', trend.badge)}>
              <span className='sr-only'>Mock change </span>
              {deltaSign}
              {formatValue(Math.abs(delta))}
            </Badge>
          )}
        </div>
        {data.length > 0 && (
          <div className='relative rounded-sm focus-within:outline focus-within:outline-(--focus-border)'>
            <Sparkline
              data={data}
              dataKey='value'
              height={sparklineHeight}
              color={trend.color}
              aria-label={`${label} mock trend`}
              animate={false}
              crosshair='gradient'
              springConfig={snappyHoverSpring}
              {...(kind === 'area' && { fill: 'gradient' as const })}
              {...sparklineProps}
            />
            <input
              type='range'
              className='sr-only'
              min={0}
              max={lastIndex}
              value={selectedIndex}
              aria-label={`Explore ${label} mock trend`}
              aria-valuetext={`${formatValue(selectedValue)}, point ${selectedIndex + 1} of ${data.length}`}
              onFocus={() => selectPoint(selectedIndex)}
              onChange={event => selectPoint(event.currentTarget.valueAsNumber)}
              onBlur={() => selectPoint(null)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
