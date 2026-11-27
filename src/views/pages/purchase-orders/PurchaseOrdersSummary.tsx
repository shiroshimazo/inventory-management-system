import {
  CancelCircleIcon,
  CheckmarkCircle02Icon,
  DeliveryTruck01Icon,
  FileEditIcon,
  Invoice01Icon
} from '@hugeicons/core-free-icons'
import { withMockStatisticsHistory } from '@/views/dashboards/statistics/StatisticsData'
import StatisticsGrid from '@/views/dashboards/statistics/StatisticsGrid'
import { purchaseOrderStatuses, type PurchaseOrder } from './PurchaseOrdersData'

const statusIcons = {
  Draft: FileEditIcon,
  Ordered: DeliveryTruck01Icon,
  Received: CheckmarkCircle02Icon,
  Cancelled: CancelCircleIcon
}

export default function PurchaseOrdersSummary({ orders }: { orders: PurchaseOrder[] }) {
  const summary = withMockStatisticsHistory([
    { label: 'Total orders', value: orders.length, icon: Invoice01Icon },
    ...purchaseOrderStatuses.map(status => ({
      label: status,
      value: orders.filter(order => order.status === status).length,
      icon: statusIcons[status]
    }))
  ])

  return (
    <StatisticsGrid label='Purchase order summary' statistics={summary} className='sm:grid-cols-2 xl:grid-cols-5' />
  )
}
