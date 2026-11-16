import { useState, type RefObject } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircleIcon } from '@hugeicons/core-free-icons'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { HugeiconsIcon } from '@/components/ui/hugeicons'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  MAX_SUPPLIER_NAME_LENGTH,
  MAX_CONTACT_PERSON_LENGTH,
  MAX_PHONE_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_ADDRESS_LENGTH,
  type Supplier
} from './SuppliersData'
import {
  createSupplierSchema,
  supplierFieldLabels,
  supplierFieldPlaceholders,
  supplierInputPatterns,
  type SupplierDraft
} from './SuppliersSchema'

const fieldSettings = {
  name: { type: 'text', autoComplete: 'organization', maxLength: MAX_SUPPLIER_NAME_LENGTH },
  contactPerson: { type: 'text', autoComplete: 'name', maxLength: MAX_CONTACT_PERSON_LENGTH },
  phone: { type: 'tel', inputMode: 'tel', autoComplete: 'tel', maxLength: MAX_PHONE_LENGTH },
  email: {
    type: 'email',
    inputMode: 'email',
    autoComplete: 'email',
    autoCapitalize: 'none',
    spellCheck: false,
    maxLength: MAX_EMAIL_LENGTH
  },
  address: { autoComplete: 'street-address', maxLength: MAX_ADDRESS_LENGTH }
} as const
const inputHints = {
  name: "Use letters, numbers, spaces or . , & ' - ( ) /.",
  contactPerson: 'Use letters, spaces, periods, hyphens or apostrophes.',
  phone: 'Use digits, spaces, hyphens, parentheses or a leading +.',
  email: 'Remove spaces from the email.',
  address: "Use letters, numbers, spaces or . , # / ' - ( )."
}

export default function SupplierDialog({
  suppliers,
  supplier,
  onSaveSupplier,
  onClose,
  returnFocus
}: {
  suppliers: Supplier[]
  supplier?: Supplier
  onSaveSupplier: (supplier: Supplier) => void
  onClose: () => void
  returnFocus: RefObject<HTMLButtonElement | null>
}) {
  const [blocked, setBlocked] = useState<Partial<Record<keyof SupplierDraft, boolean>>>({})
  const form = useForm<SupplierDraft>({
    resolver: zodResolver(createSupplierSchema(suppliers.filter(item => item.id !== supplier?.id))),
    mode: 'onTouched',
    shouldFocusError: true,
    defaultValues: {
      name: supplier?.name ?? '',
      contactPerson: supplier?.contactPerson ?? '',
      phone: supplier?.phone ?? '',
      email: supplier?.email ?? '',
      address: supplier?.address ?? ''
    }
  })
  const saveSupplier = form.handleSubmit(
    draft => {
      onSaveSupplier({ ...draft, id: supplier?.id ?? crypto.randomUUID() })
      onClose()
      toast.success(supplier ? 'Supplier updated.' : 'Supplier added.')
    },
    () => toast.error('Please fix the highlighted fields.')
  )

  return (
    <DialogContent
      finalFocus={() => {
        // Saving can remove the opening button from the filtered rows.
        requestAnimationFrame(() => {
          const target = returnFocus.current?.isConnected
            ? returnFocus.current
            : document.getElementById('supplier-search')
          target?.focus()
        })
        return false
      }}
      className='max-h-[85vh] overflow-y-auto sm:max-w-lg [&>[data-slot=dialog-close]]:size-11'
    >
      <DialogHeader>
        <DialogTitle className='text-xl font-semibold'>{supplier ? 'Edit supplier' : 'Add supplier'}</DialogTitle>
        <DialogDescription>Contact details for this supplier.</DialogDescription>
      </DialogHeader>
      <form noValidate onSubmit={saveSupplier} className='space-y-6'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {(['name', 'contactPerson', 'phone', 'email', 'address'] as const).map(name => (
            <Controller
              key={name}
              name={name}
              control={form.control}
              render={({ field, fieldState }) => {
                const error = fieldState.error?.message
                const message = blocked[name] ? inputHints[name] : error
                const props = {
                  ...field,
                  ...fieldSettings[name],
                  id: `supplier-${name}`,
                  placeholder: supplierFieldPlaceholders[name],
                  'aria-invalid': !!message,
                  'aria-describedby': message ? `supplier-${name}-error` : undefined,
                  className:
                    'border-transparent focus-visible:border-foreground shadow-none focus-visible:ring-0 aria-invalid:ring-0',
                  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                    if (
                      !(event.nativeEvent as InputEvent).isComposing &&
                      !supplierInputPatterns[name].test(event.target.value)
                    ) {
                      setBlocked(current => ({ ...current, [name]: true }))
                      return
                    }
                    setBlocked(current => ({ ...current, [name]: false }))
                    field.onChange(event)
                  }
                }
                return (
                  <Field
                    data-invalid={!!message}
                    className={name === 'contactPerson' || name === 'phone' ? '' : 'sm:col-span-2'}
                  >
                    <FieldLabel htmlFor={props.id}>{supplierFieldLabels[name]}</FieldLabel>
                    {name === 'address' ? (
                      <Textarea {...props} rows={3} />
                    ) : (
                      <Input {...props} className={`${props.className} h-11`} />
                    )}
                    {message && (
                      <FieldError id={`supplier-${name}-error`} className='flex items-start gap-1'>
                        <HugeiconsIcon icon={AlertCircleIcon} className='size-4 shrink-0' aria-hidden='true' />
                        {message}
                      </FieldError>
                    )}
                  </Field>
                )
              }}
            />
          ))}
        </div>
        <div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
          <Button type='button' variant='outline' className='h-11' onClick={onClose}>
            Cancel
          </Button>
          <Button type='submit' className='h-11' disabled={form.formState.isSubmitting}>
            Save supplier
          </Button>
        </div>
      </form>
    </DialogContent>
  )
}
