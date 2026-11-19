import { BoxesIcon, PackageIcon, PackageOutOfStockIcon } from '@hugeicons/core-free-icons'
import type { IconSvgElement } from '@hugeicons/react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { HugeiconsIcon } from '@/components/ui/hugeicons'
import { getStockStatus, type FruitProduct } from './FruitProductsData'

const fruitProductsIcon: IconSvgElement = [
  [
    'path',
    {
      d: 'M12 8C9 5.5 4 7 4 12C4 17 7 22 10 21C11.3 20.5 12.7 20.5 14 21C17 22 20 17 20 12C20 7 15 5.5 12 8ZM12 8V5M12 5C12 2.5 14.5 2 17 2C17 4.5 14.5 5 12 5Z',
      stroke: 'currentColor',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      key: 'fruit'
    }
  ]
]

const lowStockIcon: IconSvgElement = [
  PackageOutOfStockIcon[0],
  ['path', { d: 'M10 4H14', stroke: 'currentColor', strokeLinecap: 'round', key: 'low-stock' }]
]

export default function ProductsSummary({ products }: { products: FruitProduct[] }) {
  const statusCounts = { 'In stock': 0, 'Low stock': 0, 'Out of stock': 0 }
  let totalStock = 0
  for (const product of products) {
    totalStock += product.quantity
    statusCounts[getStockStatus(product)] += 1
  }

  const summary = [
    { label: 'Fruit products', value: products.length, icon: fruitProductsIcon },
    { label: 'Total stock units', value: totalStock, icon: BoxesIcon },
    { label: 'In stock', value: statusCounts['In stock'], icon: PackageIcon },
    { label: 'Low stock', value: statusCounts['Low stock'], icon: lowStockIcon },
    { label: 'Out of stock', value: statusCounts['Out of stock'], icon: PackageOutOfStockIcon }
  ]

  return (
    <section aria-label='Inventory summary' className='grid gap-4 sm:grid-cols-2 xl:grid-cols-5'>
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
