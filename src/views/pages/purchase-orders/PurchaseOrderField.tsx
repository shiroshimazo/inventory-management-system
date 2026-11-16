import { useState } from 'react'
import { useController, useFormContext } from 'react-hook-form'
import { AlertCircleIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@/components/ui/hugeicons'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { PurchaseOrderDraft } from './PurchaseOrdersSchema'

type PurchaseOrderFieldName =
  | 'supplierId'
  | 'orderDate'
  | 'expectedDate'
  | 'status'
  | `lines.${number}.${'productId' | 'quantity' | 'unitCost'}`

export default function PurchaseOrderField({
  name,
  label,
  placeholder,
  options,
  pattern,
  hint,
  inputMode,
  onChanged
}: {
  name: PurchaseOrderFieldName
  label: string
  placeholder: string
  options?: { value: string; label: string }[]
  pattern?: RegExp
  hint?: string
  inputMode?: 'numeric' | 'decimal'
  onChanged?: () => void
}) {
  const { control } = useFormContext<PurchaseOrderDraft>()
  const { field, fieldState } = useController({ control, name })
  const [isBlocked, setIsBlocked] = useState(false)
  const id = `purchase-order-${name.replaceAll('.', '-')}`
  const message = isBlocked ? hint : fieldState.error?.message
  const descriptionIds = [hint && `${id}-hint`, message && `${id}-error`].filter(Boolean).join(' ')
  const accessibility = { id, 'aria-invalid': !!message, 'aria-describedby': descriptionIds || undefined }
  function changeValue(value: string) {
    if (pattern && !pattern.test(value)) {
      setIsBlocked(true)
      return
    }
    setIsBlocked(false)
    field.onChange(value)
    onChanged?.()
  }
  return (
    <div className='min-w-0 space-y-2'>
      <label htmlFor={id} className='text-sm font-medium'>
        {label}
      </label>
      {options ? (
        <Select value={field.value || null} onValueChange={value => changeValue(value ?? '')} items={options}>
          <SelectTrigger {...accessibility} ref={field.ref} onBlur={field.onBlur} className='w-full'>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className='borderline purchase-orders' alignItemWithTrigger={false}>
            {options.map(option => (
              <SelectItem key={option.value} value={option.value} className='min-h-11'>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          {...field}
          {...accessibility}
          type='text'
          inputMode={inputMode}
          placeholder={placeholder}
          autoComplete='off'
          onChange={event => changeValue(event.target.value)}
          onPaste={event => {
            const input = event.currentTarget
            const nextValue =
              field.value.slice(0, input.selectionStart ?? 0) +
              event.clipboardData.getData('text') +
              field.value.slice(input.selectionEnd ?? field.value.length)
            if (pattern && !pattern.test(nextValue)) {
              event.preventDefault()
              setIsBlocked(true)
            }
          }}
        />
      )}
      {hint && (
        <p id={`${id}-hint`} className='text-muted-foreground text-xs'>
          {hint}
        </p>
      )}
      {message && (
        <p id={`${id}-error`} role='alert' className='text-destructive flex items-start gap-1 text-xs'>
          <HugeiconsIcon icon={AlertCircleIcon} className='size-4 shrink-0' aria-hidden='true' />
          {message}
        </p>
      )}
    </div>
  )
}
