import { BoxesIcon, Invoice01Icon, Money01Icon } from '@hugeicons/core-free-icons'
import { withMockStatisticsHistory } from '@/views/dashboards/statistics/StatisticsData'
import StatisticsGrid from '@/views/dashboards/statistics/StatisticsGrid'
import { getSaleItemCount, getSaleTotal, priceFormatter, type Sale } from './SalesData'

export default function SalesSummary({ sales }: { sales: Sale[] }) {
  const unitsSold = sales.reduce((total, sale) => total + getSaleItemCount(sale), 0)
  const salesTotal = sales.reduce((total, sale) => total + getSaleTotal(sale), 0)
  const summary = withMockStatisticsHistory([
    { label: 'Sales records', value: sales.length, icon: Invoice01Icon },
    { label: 'Units sold', value: unitsSold, icon: BoxesIcon },
    { label: 'Total sales', value: salesTotal, icon: Money01Icon, kind: 'area', formatValue: priceFormatter.format }
  ])

  return <StatisticsGrid label='Sales summary' statistics={summary} className='md:grid-cols-3' />
}
