import { Building02Icon, Mail01Icon, PhoneIcon } from '@hugeicons/core-free-icons'
import { withMockStatisticsHistory } from '@/views/dashboards/statistics/StatisticsData'
import StatisticsGrid from '@/views/dashboards/statistics/StatisticsGrid'
import type { Supplier } from './SuppliersData'

export default function SuppliersSummary({ suppliers }: { suppliers: Supplier[] }) {
  const uniquePhones = new Set(suppliers.map(supplier => supplier.phone.replace(/\D/g, '')))
  const uniqueEmails = new Set(suppliers.map(supplier => supplier.email.toLowerCase()))
  const summary = withMockStatisticsHistory([
    { label: 'Total suppliers', value: suppliers.length, icon: Building02Icon },
    { label: 'Unique phones', value: uniquePhones.size, icon: PhoneIcon },
    { label: 'Unique emails', value: uniqueEmails.size, icon: Mail01Icon }
  ])

  return <StatisticsGrid label='Supplier summary' statistics={summary} className='md:grid-cols-3' />
}
