import { useRef, useState } from 'react'

import { useSparklineHover } from '@/components/charts/sparkline'
import { cn } from '@/lib/utils'
import StatisticsCard from './statistics-card-01'
import type { Statistic, StatisticsPoint } from './StatisticsData'

type StatisticsGridProps = {
  label: string
  statistics: readonly Statistic[]
  className: string
}

export default function StatisticsGrid({ label, statistics, className }: StatisticsGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const [activeRow, setActiveRow] = useState<number[]>([])
  const hover = useSparklineHover<StatisticsPoint>()

  function updateHover(cardIndex: number, pointIndex: number | null, point: StatisticsPoint | null) {
    if (pointIndex !== null && gridRef.current) {
      const cards = Array.from(gridRef.current.children) as HTMLElement[]
      const rowTop = cards[cardIndex].offsetTop
      setActiveRow(cards.map(card => card.offsetTop).flatMap((top, index) => (top === rowTop ? [index] : [])))
    }
    hover.sparklineProps.onHoverChange(pointIndex, point)
  }

  return (
    <section aria-label={label} className='space-y-2'>
      <p className='text-muted-foreground text-xs'>Mock trends</p>
      <div ref={gridRef} className={cn('relative grid gap-4', className)}>
        {statistics.map((statistic, index) => (
          <StatisticsCard
            key={statistic.label}
            statistic={statistic}
            sparklineProps={{
              ...hover.sparklineProps,
              hoverIndex: activeRow.includes(index) ? hover.index : null,
              onHoverChange: (pointIndex, point) => updateHover(index, pointIndex, point)
            }}
          />
        ))}
      </div>
    </section>
  )
}
