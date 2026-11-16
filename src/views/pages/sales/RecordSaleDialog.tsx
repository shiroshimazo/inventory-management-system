import { useRef, useState, type RefObject } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircleIcon, Delete01Icon } from '@hugeicons/core-free-icons'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { HugeiconsIcon } from '@/components/ui/hugeicons'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty
} from '@/components/ui/combobox'
import {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperTitle,
  StepperSeparator
} from '@/components/ui/stepper'
import type { FruitProduct } from '../products/FruitProductsData'
import {
  CURRENT_USER_NAME,
  formatSaleDate,
  getSaleTimestamp,
  getLineTotal,
  getSaleTotal,
  priceFormatter,
  type Sale
} from './SalesData'
import { createSaleSchema, getDraftSaleLines, type SaleDraft, type recordSale } from './SalesSchema'
import { SaleSummary } from './SaleDetailDialog'

function focusSaleContent(id: string) {
  // Wait for the dialog's own focus restoration when step or confirmation controls unmount.
  requestAnimationFrame(() => requestAnimationFrame(() => document.getElementById(id)?.focus()))
}

function SaleError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className='text-destructive flex items-start gap-1 text-sm'>
      <HugeiconsIcon icon={AlertCircleIcon} className='size-4 shrink-0' aria-hidden='true' />
      {children}
    </p>
  )
}

export default function RecordSaleDialog({
  products,
  reference,
  onSave,
  onClose,
  returnFocus
}: {
  products: FruitProduct[]
  reference: string
  onSave: (draft: SaleDraft) => ReturnType<typeof recordSale>
  onClose: () => void
  returnFocus: RefObject<HTMLButtonElement | null>
}) {
  const [step, setStep] = useState(1)
  const [discarding, setDiscarding] = useState(false)
  const [pickerSearch, setPickerSearch] = useState('')
  const [blocked, setBlocked] = useState<Record<string, boolean>>({})

  const saveLock = useRef(false)
  const form = useForm<SaleDraft>({
    resolver: zodResolver(createSaleSchema(products)),
    mode: 'onTouched',
    defaultValues: { lines: [] }
  })
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'lines' })
  useWatch({ control: form.control, name: 'lines' })
  const lines = form.getValues('lines')
  const { errors } = form.formState
  const preview: Sale = {
    id: 'preview',
    reference,
    soldAt: getSaleTimestamp(),
    recordedBy: CURRENT_USER_NAME,
    lines: getDraftSaleLines({ lines }, products)
  }

  function focusItems() {
    setStep(1)
    focusSaleContent('sale-product')
  }
  function showErrors() {
    setStep(1)
    toast.error('Please fix the highlighted fields.')
    const index = lines.findIndex(
      (_, index) =>
        form.getFieldState(`lines.${index}.quantity`).invalid || form.getFieldState(`lines.${index}.productId`).invalid
    )
    focusSaleContent(index < 0 ? 'sale-product' : `sale-quantity-${fields[index].id}`)
  }
  function requestClose() {
    if (lines.length) {
      setDiscarding(true)
      focusSaleContent('sale-keep-editing')
    } else onClose()
  }
  async function continueStep() {
    if (!(await form.trigger())) return showErrors()
    setStep(2)
    focusSaleContent('sale-review')
  }
  const save = form.handleSubmit(draft => {
    if (saveLock.current) return
    saveLock.current = true
    const result = onSave(draft)
    if (!result.success) {
      for (const issue of result.error.issues) {
        form.setError(issue.path.join('.') as `lines.${number}.quantity`, { message: issue.message })
      }
      saveLock.current = false
      showErrors()
      return
    }
    onClose()
    toast.success(`Sale ${result.data.sale.reference} recorded.`)
  }, showErrors)

  return (
    <Dialog
      open
      onOpenChange={open => {
        if (!open) requestClose()
      }}
    >
      <DialogContent
        initialFocus={() => document.getElementById('sale-product')}
        finalFocus={returnFocus}
        className='max-h-[85vh] overflow-y-auto duration-200 ease-out motion-reduce:animate-none sm:max-w-xl [&>[data-slot=dialog-close]]:size-11'
      >
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>{discarding ? 'Discard this sale?' : 'Record sale'}</DialogTitle>
          <DialogDescription>
            {discarding
              ? 'The items you added will be lost.'
              : 'Add products and quantities. Stock updates when you save.'}
          </DialogDescription>
        </DialogHeader>
        {discarding ? (
          <div className='flex flex-wrap justify-end gap-2'>
            <Button
              id='sale-keep-editing'
              type='button'
              variant='outline'
              className='h-11'
              onClick={() => {
                setDiscarding(false)
                focusSaleContent(step === 1 ? 'sale-product' : 'sale-review')
              }}
            >
              Keep editing
            </Button>
            <Button type='button' variant='destructive' className='h-11' onClick={onClose}>
              Discard
            </Button>
          </div>
        ) : (
          <>
            <nav aria-label='Record sale progress'>
              <Stepper value={step} onValueChange={focusItems}>
                {['Items', 'Review'].map((label, index) => (
                  <StepperItem key={label} step={index + 1} disabled={index + 1 >= step} className='not-last:flex-1'>
                    <StepperTrigger
                      aria-current={step === index + 1 ? 'step' : undefined}
                      aria-label={`Step ${index + 1} of 2: ${label}`}
                      className='min-h-11 min-w-11 gap-2 transition-none'
                    >
                      <StepperIndicator />
                      <StepperTitle>{label}</StepperTitle>
                    </StepperTrigger>
                    {index === 0 && <StepperSeparator />}
                  </StepperItem>
                ))}
              </Stepper>
            </nav>
            <form
              noValidate
              className='min-w-0 space-y-4'
              onSubmit={event => {
                if (step === 1) {
                  event.preventDefault()
                  void continueStep()
                } else void save(event)
              }}
            >
              {step === 1 ? (
                <>
                  <div className='space-y-2'>
                    <label htmlFor='sale-product' className='font-medium'>
                      Product
                    </label>
                    <Combobox<FruitProduct>
                      items={products}
                      value={null}
                      inputValue={pickerSearch}
                      onInputValueChange={setPickerSearch}
                      itemToStringLabel={product => `${product.name} ${product.sku}`}
                      onValueChange={product => {
                        if (!product) return
                        append({ productId: product.id, quantity: '1' }, { shouldFocus: false })
                        setPickerSearch('')
                        if (errors.lines) void form.trigger('lines')
                      }}
                    >
                      <ComboboxInput
                        id='sale-product'
                        placeholder='Search products'
                        showTrigger={false}
                        aria-invalid={!!errors.lines?.root || !!errors.lines?.message}
                        aria-describedby='sale-lines-error'
                        className='has-[[data-slot=input-group-control]:focus-visible]:border-foreground h-11 w-full shadow-none has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot][aria-invalid=true]]:ring-0 [&_input]:h-11'
                      />
                      <ComboboxContent className='duration-200 ease-out motion-reduce:animate-none'>
                        <ComboboxEmpty>No products match your search.</ComboboxEmpty>
                        <ComboboxList>
                          {(product: FruitProduct) => {
                            const added = lines.some(line => line.productId === product.id)
                            return (
                              <ComboboxItem
                                key={product.id}
                                value={product}
                                disabled={added || product.quantity === 0}
                                className='min-h-11'
                              >
                                <div className='min-w-0 break-words'>
                                  <p>{product.name}</p>
                                  <p className='text-muted-foreground text-xs'>{product.sku}</p>
                                  <p className='text-muted-foreground'>
                                    {added
                                      ? 'Added'
                                      : product.quantity === 0
                                        ? 'Out of stock'
                                        : `Available: ${product.quantity}`}
                                  </p>
                                </div>
                              </ComboboxItem>
                            )
                          }}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </div>
                  {(errors.lines?.root?.message || errors.lines?.message) && (
                    <SaleError id='sale-lines-error'>{errors.lines.root?.message ?? errors.lines.message}</SaleError>
                  )}
                  {!fields.length && <p className='text-muted-foreground'>No items yet. Add a product to start.</p>}
                  <div className='divide-y'>
                    {fields.map((field, index) => {
                      const product = products.find(product => product.id === field.productId)!
                      const error =
                        errors.lines?.[index]?.quantity?.message ?? errors.lines?.[index]?.productId?.message
                      const inputId = `sale-quantity-${field.id}`
                      return (
                        <div key={field.id} className='space-y-2 py-4'>
                          <div className='flex items-start justify-between gap-2'>
                            <div className='min-w-0 break-words'>
                              <p className='font-medium'>{product.name}</p>
                              <p className='text-muted-foreground text-xs'>{product.sku}</p>
                              <p className='text-muted-foreground'>Available: {product.quantity}</p>
                            </div>
                            <Button
                              type='button'
                              variant='ghost'
                              size='icon'
                              className='text-destructive hover:bg-destructive/10 hover:text-destructive size-11 shrink-0'
                              aria-label={`Remove ${product.name}`}
                              onClick={() => {
                                remove(index)
                                focusSaleContent('sale-product')
                              }}
                            >
                              <HugeiconsIcon icon={Delete01Icon} aria-hidden='true' />
                            </Button>
                          </div>
                          <div className='flex flex-wrap items-end justify-between gap-4'>
                            <div className='space-y-2'>
                              <label htmlFor={inputId}>Quantity</label>
                              <Controller
                                control={form.control}
                                name={`lines.${index}.quantity`}
                                render={({ field: quantityField }) => (
                                  <Input
                                    {...quantityField}
                                    id={inputId}
                                    type='text'
                                    inputMode='numeric'
                                    placeholder='1'
                                    aria-label={`Quantity for ${product.name}`}
                                    aria-invalid={!!error}
                                    aria-describedby={
                                      error ? `${inputId}-error` : blocked[field.id] ? `${inputId}-hint` : undefined
                                    }
                                    className='focus-visible:border-foreground h-11 w-20 tabular-nums shadow-none focus-visible:ring-0 aria-invalid:ring-0'
                                    onKeyDown={event => {
                                      if (
                                        event.key.length === 1 &&
                                        !event.ctrlKey &&
                                        !event.metaKey &&
                                        !/^\d$/.test(event.key)
                                      ) {
                                        event.preventDefault()
                                        setBlocked(current => ({ ...current, [field.id]: true }))
                                      }
                                    }}
                                    onChange={event => {
                                      if (/\D/.test(event.target.value)) {
                                        setBlocked(current => ({ ...current, [field.id]: true }))
                                        return
                                      }
                                      quantityField.onChange(event)
                                      if (event.target.value) setBlocked(current => ({ ...current, [field.id]: false }))
                                    }}
                                    onPaste={event => {
                                      event.preventDefault()
                                      const text = event.clipboardData.getData('text')
                                      const digits = text.replace(/\D/g, '')
                                      const input = event.currentTarget
                                      const value = quantityField.value
                                      quantityField.onChange(
                                        value.slice(0, input.selectionStart ?? 0) +
                                          digits +
                                          value.slice(input.selectionEnd ?? value.length)
                                      )
                                      setBlocked(current => ({ ...current, [field.id]: /\D/.test(text) }))
                                    }}
                                  />
                                )}
                              />
                            </div>
                            <p className='text-muted-foreground tabular-nums'>
                              {priceFormatter.format(product.pricePerKg)} each
                            </p>
                            <p className='max-w-full text-right break-words tabular-nums'>
                              {priceFormatter.format(getLineTotal(preview.lines[index]))}
                            </p>
                          </div>
                          {blocked[field.id] && (
                            <p id={`${inputId}-hint`} className='text-muted-foreground text-sm' role='status'>
                              Numbers only.
                            </p>
                          )}
                          {error && <SaleError id={`${inputId}-error`}>{error}</SaleError>}
                        </div>
                      )
                    })}
                  </div>
                  <p aria-live='polite' className='flex flex-wrap justify-end gap-2 border-t pt-4'>
                    Total{' '}
                    <span className='max-w-full text-base font-semibold break-words tabular-nums'>
                      {priceFormatter.format(getSaleTotal(preview))}
                    </span>
                  </p>
                </>
              ) : (
                <div id='sale-review' tabIndex={-1} className='min-w-0 space-y-4 outline-none'>
                  <h2 className='font-medium'>{reference}</h2>
                  <dl className='space-y-2'>
                    <div>
                      <dt className='text-muted-foreground'>Sold at</dt>
                      <dd>{formatSaleDate(preview.soldAt)}</dd>
                    </div>
                    <div>
                      <dt className='text-muted-foreground'>Recorded by</dt>
                      <dd>{CURRENT_USER_NAME}</dd>
                    </div>
                  </dl>
                  <SaleSummary sale={preview} />
                </div>
              )}
              <div className='flex flex-wrap justify-end gap-2'>
                <Button type='button' variant='ghost' className='mr-auto h-11' onClick={requestClose}>
                  Cancel
                </Button>
                {step === 2 && (
                  <Button type='button' variant='outline' className='h-11' onClick={focusItems}>
                    Back
                  </Button>
                )}
                <Button type='submit' className='h-11' disabled={form.formState.isSubmitting}>
                  {step === 1 ? 'Continue' : 'Record sale'}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
