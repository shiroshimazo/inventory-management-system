import type { RefObject } from 'react'
import { Button } from '@/components/ui/button'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatSaleDate, getLineTotal, getSaleTotal, priceFormatter, type Sale } from './SalesData'

export function SaleSummary({ sale }: { sale: Sale }) {
  return (
    <div className='min-w-0 space-y-4'>
      <p className='text-muted-foreground text-sm'>Unit price (PHP)</p>
      <ul className='divide-y'>
        {sale.lines.map(line => (
          <li key={line.productId} className='flex flex-wrap items-start justify-between gap-4 py-3'>
            <div className='min-w-0 flex-1 break-words'>
              <p className='font-medium'>
                {line.name} ×{line.quantity}
              </p>
              <p className='text-muted-foreground text-xs'>{line.sku}</p>
              <p className='text-muted-foreground tabular-nums'>{priceFormatter.format(line.unitPrice)} each</p>
            </div>
            <p className='max-w-full text-right break-words tabular-nums'>
              {priceFormatter.format(getLineTotal(line))}
            </p>
          </li>
        ))}
      </ul>
      <p className='flex flex-wrap justify-end gap-2 border-t pt-4' aria-live='polite'>
        Total <span className='text-base font-semibold tabular-nums'>{priceFormatter.format(getSaleTotal(sale))}</span>
      </p>
    </div>
  )
}

export default function SaleDetailDialog({
  sale,
  onClose,
  returnFocus
}: {
  sale: Sale
  onClose: () => void
  returnFocus: RefObject<HTMLButtonElement | null>
}) {
  return (
    <DialogContent
      finalFocus={returnFocus}
      showCloseButton={false}
      className='max-h-[85vh] overflow-y-auto duration-200 ease-out motion-reduce:animate-none sm:max-w-xl'
    >
      <DialogHeader>
        <DialogTitle>{sale.reference}</DialogTitle>
        <DialogDescription>
          Recorded by {sale.recordedBy} on {formatSaleDate(sale.soldAt)}.
        </DialogDescription>
      </DialogHeader>
      <SaleSummary sale={sale} />
      <Button type='button' variant='outline' className='h-11 justify-self-end' onClick={onClose}>
        Close
      </Button>
    </DialogContent>
  )
}
