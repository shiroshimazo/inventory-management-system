import { BoxesIcon, Invoice01Icon, Money01Icon } from '@hugeicons/core-free-icons'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { HugeiconsIcon } from '@/components/ui/hugeicons'
import { getSaleItemCount, getSaleTotal, priceFormatter, type Sale } from './SalesData'

export default function SalesSummary({ sales }: { sales: Sale[] }) {
  const unitsSold = sales.reduce((total, sale) => total + getSaleItemCount(sale), 0)
  const salesTotal = sales.reduce((total, sale) => total + getSaleTotal(sale), 0)
  const summary = [
    { label: 'Sales records', value: sales.length.toLocaleString(), icon: Invoice01Icon },
    { label: 'Units sold', value: unitsSold.toLocaleString(), icon: BoxesIcon },
    { label: 'Total sales', value: priceFormatter.format(salesTotal), icon: Money01Icon }
  ]

  return (
    <section aria-label='Sales summary' className='grid gap-4 md:grid-cols-3'>
      {summary.map(({ label, value, icon }) => (
        <Card key={label} size='sm' className='borderline borderline-surface'>
          <CardHeader className='border-b border-(--divider)'>
            <h2 className='flex items-center gap-2 font-medium'>
              <HugeiconsIcon icon={icon} className='size-4 shrink-0' aria-hidden='true' />
              {label}
            </h2>
          </CardHeader>
          <CardContent className='text-2xl font-semibold tabular-nums'>{value}</CardContent>
        </Card>
      ))}
    </section>
  )
}
