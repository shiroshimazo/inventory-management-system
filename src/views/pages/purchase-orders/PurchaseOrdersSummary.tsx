import {
  CancelCircleIcon,
  CheckmarkCircle02Icon,
  DeliveryTruck01Icon,
  FileEditIcon,
  Invoice01Icon
} from '@hugeicons/core-free-icons'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { HugeiconsIcon } from '@/components/ui/hugeicons'
import { purchaseOrderStatuses, type PurchaseOrder } from './PurchaseOrdersData'

const statusIcons = {
  Draft: FileEditIcon,
  Ordered: DeliveryTruck01Icon,
  Received: CheckmarkCircle02Icon,
  Cancelled: CancelCircleIcon
}

export default function PurchaseOrdersSummary({ orders }: { orders: PurchaseOrder[] }) {
  const summary = [
    { label: 'Total orders', value: orders.length, icon: Invoice01Icon },
    ...purchaseOrderStatuses.map(status => ({
      label: status,
      value: orders.filter(order => order.status === status).length,
      icon: statusIcons[status]
    }))
  ]

  return (
    <section aria-label='Purchase order summary' className='grid gap-4 sm:grid-cols-2 xl:grid-cols-5'>
      {summary.map(({ label, value, icon }) => (
        <Card key={label} size='sm' className='borderline borderline-surface'>
          <CardHeader className='border-b border-(--divider)'>
            <h2 className='flex items-center gap-2 font-medium'>
              <HugeiconsIcon icon={icon} className='size-4 shrink-0' aria-hidden='true' />
              {label}
            </h2>
          </CardHeader>
          <CardContent className='text-2xl font-semibold tabular-nums'>{value.toLocaleString()}</CardContent>
        </Card>
      ))}
    </section>
  )
}
