import { Building02Icon, Mail01Icon, PhoneIcon } from '@hugeicons/core-free-icons'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { HugeiconsIcon } from '@/components/ui/hugeicons'
import type { Supplier } from './SuppliersData'

export default function SuppliersSummary({ suppliers }: { suppliers: Supplier[] }) {
  const uniquePhones = new Set(suppliers.map(supplier => supplier.phone.replace(/\D/g, '')))
  const uniqueEmails = new Set(suppliers.map(supplier => supplier.email.toLowerCase()))
  const summary = [
    { label: 'Total suppliers', value: suppliers.length, icon: Building02Icon },
    { label: 'Unique phones', value: uniquePhones.size, icon: PhoneIcon },
    { label: 'Unique emails', value: uniqueEmails.size, icon: Mail01Icon }
  ]

  return (
    <section aria-label='Supplier summary' className='grid gap-4 md:grid-cols-3'>
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
