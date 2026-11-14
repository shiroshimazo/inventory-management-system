import { useState } from 'react'
import type { ColumnFiltersState } from '@tanstack/react-table'
import { Alert02Icon, FilterHorizontalIcon } from '@hugeicons/core-free-icons'
import { toast } from 'sonner'
import { HugeiconsIcon } from '@/components/ui/hugeicons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { fruitProducts } from '@/views/pages/products/FruitProductsData'

const categories = ['All', ...Array.from(new Set(fruitProducts.map(product => product.category))).sort()]
const statuses = ['All', 'In stock', 'Low stock', 'Out of stock']
const maxPrice = 1000000

function priceError(value: string) {
  const price = value.trim()
  if (!price) return ''
  if (!/^(\d+(\.\d*)?|\.\d+)$/.test(price) || !Number.isFinite(Number(price)) || Number(price) > maxPrice) {
    return 'Enter a price from 0 to 1,000,000.'
  }
  return ''
}

export default function ProductsFilters({
  columnFilters,
  onApply
}: {
  columnFilters: ColumnFiltersState
  onApply: (filters: ColumnFiltersState) => void
}) {
  const [open, setOpen] = useState(false)
  const [minimum, setMinimum] = useState('')
  const [maximum, setMaximum] = useState('')
  const [priceTouched, setPriceTouched] = useState(false)
  const minimumError = priceError(minimum)
  const maximumError =
    priceError(maximum) ||
    (minimum.trim() !== '' && maximum.trim() !== '' && Number(minimum) > Number(maximum)
      ? 'Maximum must be at least the minimum.'
      : '')

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      const range = columnFilters.find(filter => filter.id === 'pricePerKg')?.value as
        | [number | undefined, number | undefined]
        | undefined
      setMinimum(range?.[0] === undefined ? '' : String(range[0]))
      setMaximum(range?.[1] === undefined ? '' : String(range[1]))
      setPriceTouched(false)
    }
    setOpen(nextOpen)
  }

  return (
    <>
      {[
        { id: 'category', label: 'Category', options: categories },
        { id: 'status', label: 'Status', options: statuses }
      ].map(field => (
        <Select
          key={field.id}
          value={String(columnFilters.find(filter => filter.id === field.id)?.value ?? 'All')}
          onValueChange={value => {
            const filters = columnFilters.filter(filter => filter.id !== field.id)
            if (value && value !== 'All') filters.push({ id: field.id, value })
            onApply(filters)
          }}
        >
          <SelectTrigger aria-label={field.label} className='data-[size=default]:h-11'>
            <span>{field.label}:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {field.options.map(option => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger render={<Button variant='outline' className='h-11 shadow-none' />}>
          <HugeiconsIcon icon={FilterHorizontalIcon} aria-hidden='true' />
          Price{columnFilters.some(filter => filter.id === 'pricePerKg') ? ' (1)' : ''}
        </PopoverTrigger>
        <PopoverContent align='end'>
          <PopoverTitle>Filter price</PopoverTitle>
          <form
            className='space-y-4'
            noValidate
            onSubmit={event => {
              event.preventDefault()
              setPriceTouched(true)
              const form = event.currentTarget
              if (minimumError || maximumError) {
                toast.error('Please fix the highlighted fields.')
                form.querySelector<HTMLInputElement>(minimumError ? '#minimum-price' : '#maximum-price')?.focus()
                return
              }
              const filters = columnFilters.filter(filter => filter.id !== 'pricePerKg')
              if (minimum.trim() !== '' || maximum.trim() !== '')
                filters.push({
                  id: 'pricePerKg',
                  value: [
                    minimum.trim() === '' ? undefined : Number(minimum),
                    maximum.trim() === '' ? undefined : Number(maximum)
                  ]
                })
              onApply(filters)
              setOpen(false)
            }}
          >
            <fieldset className='space-y-2'>
              <legend className='text-sm font-medium'>Price per kg (USD)</legend>
              <div className='grid grid-cols-2 gap-2'>
                {[
                  { id: 'minimum-price', label: 'Minimum', value: minimum, setValue: setMinimum, error: minimumError },
                  { id: 'maximum-price', label: 'Maximum', value: maximum, setValue: setMaximum, error: maximumError }
                ].map(field => (
                  <div key={field.id} className='space-y-2'>
                    <Label htmlFor={field.id}>{field.label}</Label>
                    <Input
                      id={field.id}
                      type='text'
                      inputMode='decimal'
                      maxLength={16}
                      value={field.value}
                      onChange={event => field.setValue(event.target.value)}
                      onBlur={() => setPriceTouched(true)}
                      aria-invalid={priceTouched && !!field.error}
                      aria-describedby={priceTouched && field.error ? `${field.id}-error` : undefined}
                      className='h-11'
                    />
                    {priceTouched && field.error && (
                      <p
                        id={`${field.id}-error`}
                        role='alert'
                        className='text-destructive flex items-start gap-1 text-sm'
                      >
                        <HugeiconsIcon icon={Alert02Icon} className='size-4 shrink-0' aria-hidden='true' />
                        {field.error}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </fieldset>
            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='ghost'
                className='h-11'
                onClick={() => {
                  onApply(columnFilters.filter(filter => filter.id !== 'pricePerKg'))
                  setOpen(false)
                }}
              >
                Reset price
              </Button>
              <Button type='submit' className='h-11'>
                Apply price
              </Button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
    </>
  )
}
