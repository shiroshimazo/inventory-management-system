import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { getStockStatus, type FruitProduct } from './FruitProductsData'

export default function ProductsSummary({ products }: { products: FruitProduct[] }) {
  const statusCounts = { 'In stock': 0, 'Low stock': 0, 'Out of stock': 0 }
  let totalStock = 0
  for (const product of products) {
    totalStock += product.quantity
    statusCounts[getStockStatus(product)] += 1
  }

  const totals = [
    { label: 'Fruit products', value: products.length },
    { label: 'Total stock units', value: totalStock }
  ]

  return (
    <section aria-label='Inventory summary' className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
      {totals.map(({ label, value }) => (
        <Card key={label} size='sm' className='borderline borderline-surface'>
          <CardHeader className='border-b border-(--divider)'>
            <h2 className='font-medium'>{label}</h2>
          </CardHeader>
          <CardContent className='text-2xl font-semibold tabular-nums'>{value.toLocaleString()}</CardContent>
        </Card>
      ))}
      <Card size='sm' className='borderline borderline-surface sm:col-span-2 xl:col-span-1'>
        <CardHeader className='border-b border-(--divider)'>
          <h2 className='font-medium'>Stock status</h2>
        </CardHeader>
        <CardContent>
          <dl className='grid grid-cols-3 gap-2'>
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className='flex flex-col-reverse gap-1'>
                <dt className='text-muted-foreground text-xs'>{status}</dt>
                <dd className='text-2xl font-semibold tabular-nums'>{count.toLocaleString()}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </section>
  )
}
