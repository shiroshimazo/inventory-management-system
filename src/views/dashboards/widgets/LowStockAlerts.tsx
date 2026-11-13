import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import type { InventoryProduct } from '@/views/dashboards/InventoryMockData'

export default function LowStockAlerts({ products }: { products: InventoryProduct[] }) {
  const alerts = products
    .filter(product => product.quantity < product.reorderLevel)
    .sort((first, second) => first.quantity - second.quantity)

  return (
    <Card className='min-w-0 shadow-none ring-0'>
      <CardHeader>
        <h2 className='text-base font-semibold'>Low stock alerts</h2>
        <CardDescription>Below reorder level, including out-of-stock items.</CardDescription>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <p className='text-muted-foreground'>No low stock alerts.</p>
        ) : (
          <ul className='divide-y'>
            {alerts.map(product => (
              <li
                key={product.id}
                className='flex flex-wrap items-start justify-between gap-2 py-3 first:pt-0 last:pb-0'
              >
                <div className='min-w-0 space-y-1'>
                  <p className='font-medium'>{product.name}</p>
                  <p className='text-muted-foreground text-xs'>{product.sku}</p>
                  <p className='text-muted-foreground text-sm tabular-nums'>
                    {product.quantity} on hand · Reorder level {product.reorderLevel}
                  </p>
                </div>
                <Badge variant={product.quantity === 0 ? 'default' : 'outline'} className='border-transparent'>
                  {product.quantity === 0 ? 'Out of stock' : 'Low stock'}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
