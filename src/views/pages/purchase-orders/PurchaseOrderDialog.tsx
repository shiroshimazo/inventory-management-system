import { useRef, type RefObject } from 'react'
import { FormProvider, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Add01Icon, AlertCircleIcon, Delete01Icon } from '@hugeicons/core-free-icons'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@/components/ui/hugeicons'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { fruitProducts } from '../products/FruitProductsData'
import { suppliersSeed } from '../suppliers/SuppliersData'
import {
  getPurchaseOrderToday,
  getPurchaseOrderTotal,
  MAX_ORDER_LINES,
  priceFormatter,
  purchaseOrderInputPatterns,
  purchaseOrderStatuses,
  type PurchaseOrder
} from './PurchaseOrdersData'
import { purchaseOrderSchema, type PurchaseOrderDraft } from './PurchaseOrdersSchema'
import PurchaseOrderField from './PurchaseOrderField'

const supplierOptions = suppliersSeed.map(supplier => ({ value: supplier.id, label: supplier.name }))
const productOptions = fruitProducts.map(product => ({ value: product.id, label: `${product.name} (${product.sku})` }))
const statusOptions = purchaseOrderStatuses.map(status => ({ value: status, label: status }))
const emptyLine = { productId: '', quantity: '', unitCost: '' }

export default function PurchaseOrderDialog({
  order,
  onSave,
  onClose,
  returnFocus
}: {
  order?: PurchaseOrder
  onSave: (draft: PurchaseOrderDraft) => void
  onClose: () => void
  returnFocus: RefObject<HTMLButtonElement | null>
}) {
  const saveLock = useRef(false)
  const form = useForm<PurchaseOrderDraft>({
    resolver: zodResolver(purchaseOrderSchema),
    mode: 'onTouched',
    defaultValues: order
      ? { ...order, lines: order.lines.map(line => ({ ...line })) }
      : {
          supplierId: '',
          orderDate: getPurchaseOrderToday(),
          expectedDate: '',
          status: 'Draft',
          lines: [{ ...emptyLine }]
        }
  })
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'lines' })
  const lines = useWatch({ control: form.control, name: 'lines' })
  const lineError = form.formState.errors.lines?.root?.message ?? form.formState.errors.lines?.message
  const saveOrder = form.handleSubmit(
    draft => {
      if (saveLock.current) return
      saveLock.current = true
      onSave(draft)
      onClose()
      toast.success(order ? 'Purchase order updated.' : 'Purchase order added.')
    },
    () => {
      toast.error('Please fix the highlighted fields.')
      if (!fields.length) document.getElementById('purchase-order-add-line')?.focus()
    }
  )
  function refreshExpectedDate() {
    if (form.getFieldState('expectedDate').isTouched || form.formState.isSubmitted) void form.trigger('expectedDate')
  }
  function refreshLineProducts() {
    form.getValues('lines').forEach((_, index) => {
      const name = `lines.${index}.productId` as const
      if (form.getFieldState(name).isTouched || form.formState.isSubmitted) void form.trigger(name)
    })
  }
  return (
    <Dialog open onOpenChange={open => !open && onClose()}>
      <DialogContent
        aria-labelledby='purchase-order-dialog-title'
        className='borderline purchase-orders max-h-[85vh] overflow-y-auto sm:max-w-3xl [&>[data-slot=dialog-close]]:size-11'
        finalFocus={() => {
          requestAnimationFrame(() =>
            (returnFocus.current?.isConnected
              ? returnFocus.current
              : document.getElementById('purchase-order-search')
            )?.focus()
          )
          return false
        }}
      >
        <DialogHeader>
          <DialogTitle id='purchase-order-dialog-title' className='text-xl font-semibold'>
            {order ? 'Edit purchase order' : 'Add purchase order'}
          </DialogTitle>
          <DialogDescription>Choose a supplier and add products. Costs are in PHP.</DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form noValidate onSubmit={saveOrder} className='space-y-6'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <PurchaseOrderField
                name='supplierId'
                label='Supplier'
                placeholder='Choose supplier'
                options={supplierOptions}
              />
              <PurchaseOrderField name='status' label='Status' placeholder='Choose status' options={statusOptions} />
              <PurchaseOrderField
                name='orderDate'
                label='Order date'
                placeholder='2026-11-16'
                pattern={purchaseOrderInputPatterns.date}
                hint='Use YYYY-MM-DD. Dates follow Asia/Manila.'
                onChanged={refreshExpectedDate}
              />
              <PurchaseOrderField
                name='expectedDate'
                label='Expected date'
                placeholder='2026-11-20'
                pattern={purchaseOrderInputPatterns.date}
                hint='Use YYYY-MM-DD, on or after order date.'
              />
            </div>
            <fieldset className='min-w-0 space-y-4'>
              <legend className='mb-4 text-base font-semibold'>Line items</legend>
              {!fields.length && (
                <p className='text-muted-foreground text-sm'>No line items. Add a product to continue.</p>
              )}
              {fields.map((line, index) => (
                <div key={line.id} className='space-y-4 border-b pb-4'>
                  <div className='flex items-center justify-between gap-2'>
                    <p className='text-sm font-medium'>Item {index + 1}</p>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='text-destructive size-11'
                      aria-label={`Remove item ${index + 1}`}
                      onClick={() => {
                        remove(index)
                        if (form.formState.isSubmitted) void form.trigger('lines')
                        else refreshLineProducts()
                        document.getElementById('purchase-order-add-line')?.focus()
                      }}
                    >
                      <HugeiconsIcon icon={Delete01Icon} aria-hidden='true' />
                    </Button>
                  </div>
                  <div className='grid gap-4 sm:grid-cols-2'>
                    <div className='sm:col-span-2'>
                      <PurchaseOrderField
                        name={`lines.${index}.productId`}
                        label='Product / SKU'
                        placeholder='Choose product'
                        options={productOptions}
                        onChanged={refreshLineProducts}
                      />
                    </div>
                    <PurchaseOrderField
                      name={`lines.${index}.quantity`}
                      label='Quantity'
                      placeholder='20'
                      inputMode='numeric'
                      pattern={purchaseOrderInputPatterns.quantity}
                      hint='Numbers only. Use 1 to 1,000,000.'
                    />
                    <PurchaseOrderField
                      name={`lines.${index}.unitCost`}
                      label='Unit cost (PHP)'
                      placeholder='28.50'
                      inputMode='decimal'
                      pattern={purchaseOrderInputPatterns.unitCost}
                      hint='Use 0.01 to 1,000,000, up to two decimals.'
                    />
                  </div>
                </div>
              ))}
              {lineError && (
                <p role='alert' className='text-destructive flex items-start gap-1 text-xs'>
                  <HugeiconsIcon icon={AlertCircleIcon} className='size-4' aria-hidden='true' />
                  {lineError}
                </p>
              )}
              <Button
                id='purchase-order-add-line'
                type='button'
                variant='outline'
                className='h-11'
                onClick={() => {
                  if (fields.length >= MAX_ORDER_LINES) {
                    toast.error('Use at most 12 line items.')
                    return
                  }
                  append({ ...emptyLine })
                  if (lineError) void form.trigger('lines')
                }}
              >
                <HugeiconsIcon icon={Add01Icon} aria-hidden='true' />
                Add item
              </Button>
            </fieldset>
            <p aria-live='polite' className='text-right text-base font-semibold tabular-nums'>
              Total: {priceFormatter.format(getPurchaseOrderTotal(lines))}
            </p>
            <div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
              <Button type='button' variant='outline' className='h-11' onClick={onClose}>
                Cancel
              </Button>
              <Button type='submit' className='h-11' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving order…' : 'Save order'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
