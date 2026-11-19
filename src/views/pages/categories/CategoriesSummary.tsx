import { CancelCircleIcon, CheckmarkCircle02Icon, PackageIcon, Tag01Icon } from '@hugeicons/core-free-icons'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { HugeiconsIcon } from '@/components/ui/hugeicons'
import { getProductCount, type Category } from './CategoriesData'

export default function CategoriesSummary({ categories }: { categories: Category[] }) {
  const summary = [
    { label: 'Total categories', value: categories.length, icon: Tag01Icon },
    {
      label: 'Active',
      value: categories.filter(category => category.status === 'Active').length,
      icon: CheckmarkCircle02Icon
    },
    {
      label: 'Inactive',
      value: categories.filter(category => category.status === 'Inactive').length,
      icon: CancelCircleIcon
    },
    {
      label: 'Total products',
      value: categories.reduce((total, category) => total + getProductCount(category.name), 0),
      icon: PackageIcon
    }
  ]

  return (
    <section aria-label='Category summary' className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
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
