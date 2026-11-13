import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { InventoryProduct, StockMovement } from '@/views/dashboards/InventoryMockData'

const RECENT_MOVEMENT_LIMIT = 8
const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Shanghai'
})

export default function RecentStockMovements({
  movements,
  products
}: {
  movements: StockMovement[]
  products: InventoryProduct[]
}) {
  const recentMovements = [...movements]
    .sort((first, second) => second.occurredAt.localeCompare(first.occurredAt))
    .slice(0, RECENT_MOVEMENT_LIMIT)

  return (
    <Card className='min-w-0 shadow-none ring-0'>
      <CardHeader>
        <h2 className='text-base font-semibold'>Recent stock movements</h2>
        <CardDescription>Latest {RECENT_MOVEMENT_LIMIT} entries · Times UTC+08:00</CardDescription>
      </CardHeader>
      <CardContent>
        <Table
          aria-label='Recent stock movements'
          tabIndex={0}
          className='focus-visible:outline-primary focus-visible:outline-2 focus-visible:-outline-offset-2'
        >
          <TableHeader>
            <TableRow>
              {['Date', 'Product', 'Movement', 'Quantity', 'Reference', 'Recorded by'].map(label => (
                <TableHead key={label} scope='col' className={label === 'Quantity' ? 'text-right' : undefined}>
                  {label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentMovements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className='text-muted-foreground py-8 text-center'>
                  No stock movements yet.
                </TableCell>
              </TableRow>
            ) : (
              recentMovements.map(movement => {
                const product = products.find(product => product.id === movement.productId)

                return (
                  <TableRow key={movement.id}>
                    <TableCell>
                      <time dateTime={movement.occurredAt}>{dateFormatter.format(new Date(movement.occurredAt))}</time>
                    </TableCell>
                    <TableCell>
                      <p className='font-medium'>{product?.name ?? 'Unknown product'}</p>
                      <p className='text-muted-foreground text-xs'>{product?.sku ?? movement.productId}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline' className='border-transparent'>{movement.type === 'in' ? 'Stock-in' : 'Stock-out'}</Badge>
                    </TableCell>
                    <TableCell className='text-right font-medium tabular-nums'>
                      {movement.type === 'in' ? '+' : '−'}
                      {movement.quantity}
                    </TableCell>
                    <TableCell>{movement.reference}</TableCell>
                    <TableCell>{movement.recordedBy}</TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
