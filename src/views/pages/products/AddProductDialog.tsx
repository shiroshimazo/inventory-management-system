import { useState, type RefObject } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircleIcon } from '@hugeicons/core-free-icons'
import { toast } from 'sonner'
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@/components/ui/hugeicons'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperTitle,
  StepperSeparator
} from '@/components/ui/stepper'
import { productCategories, priceFormatter, type FruitProduct } from './FruitProductsData'
import { createProductSchema, productStepFields, productFieldLabels, type ProductDraft } from './ProductSchema'
const steps = ['Details', 'Stock & price', 'Review']
const inputClasses =
  'h-11 w-full shadow-none focus-visible:ring-0 focus-visible:border-foreground aria-invalid:ring-0 aria-invalid:focus-visible:border-destructive data-[size=default]:h-11'
export default function AddProductDialog({
  products,
  onAddProduct,
  onClose,
  returnFocus
}: {
  products: FruitProduct[]
  onAddProduct: (product: FruitProduct) => void
  onClose: () => void
  returnFocus: RefObject<HTMLButtonElement | null>
}) {
  const [step, setStep] = useState(1)
  const form = useForm<ProductDraft>({
    resolver: zodResolver(createProductSchema(products)),
    mode: 'onTouched',
    defaultValues: { name: '', sku: '', category: '', pricePerKg: '', weightKg: '', quantity: '', reorderLevel: '' }
  })
  const { errors } = form.formState
  const values = form.getValues()
  function focusField(field: keyof ProductDraft) {
    requestAnimationFrame(() => form.setFocus(field))
  }
  async function continueStep() {
    const fields = productStepFields[step - 1]
    if (await form.trigger(fields)) {
      setStep(step + 1)
      if (step === 1) focusField('pricePerKg')
      else requestAnimationFrame(() => document.getElementById('product-review')?.focus())
    } else {
      toast.error('Please fix the highlighted fields.')
      const first = fields.find(field => form.getFieldState(field).invalid)
      if (first) focusField(first)
    }
  }
  const saveProduct = form.handleSubmit(
    draft => {
      onAddProduct({
        id: crypto.randomUUID(),
        name: draft.name.trim(),
        sku: draft.sku.trim().toUpperCase(),
        category: draft.category as FruitProduct['category'],
        pricePerKg: Number(draft.pricePerKg.trim()),
        weightKg: Number(draft.weightKg.trim()),
        quantity: Number(draft.quantity.trim()),
        reorderLevel: Number(draft.reorderLevel.trim())
      })
      onClose()
      toast.success('Product added.')
    },
    invalid => {
      const index = productStepFields.findIndex(fields => fields.some(field => invalid[field]))
      setStep(index + 1)
      const first = productStepFields[index].find(field => invalid[field])
      if (first) focusField(first)
      toast.error('Please fix the highlighted fields.')
    }
  )
  return (
    <DialogContent
      finalFocus={returnFocus}
      className='max-h-[85vh] overflow-y-auto sm:max-w-xl [&>[data-slot=dialog-close]]:size-11'
    >
      <DialogHeader>
        <DialogTitle>Add product</DialogTitle>
        <DialogDescription>Add a product to the inventory.</DialogDescription>
      </DialogHeader>
      <nav aria-label='Add product progress'>
        <Stepper
          value={step}
          onValueChange={value => {
            setStep(value)
            focusField(productStepFields[value - 1][0])
          }}
        >
          {steps.map((label, index) => (
            <StepperItem key={label} step={index + 1} disabled={index + 1 >= step} className='not-last:flex-1'>
              <StepperTrigger
                aria-current={step === index + 1 ? 'step' : undefined}
                aria-label={`Step ${index + 1} of 3: ${label}`}
                className='min-h-11 min-w-11 justify-center gap-2 transition-none hover:bg-transparent'
              >
                <StepperIndicator />
                <StepperTitle className='hidden sm:inline'>{label}</StepperTitle>
              </StepperTrigger>
              {index < steps.length - 1 && <StepperSeparator />}
            </StepperItem>
          ))}
        </Stepper>
      </nav>
      <form
        noValidate
        onSubmit={event => {
          if (step < 3) {
            event.preventDefault()
            void continueStep()
          } else void saveProduct(event)
        }}
        className='space-y-6'
      >
        {step < 3 ? (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            {productStepFields[step - 1].map(name => (
              <Field key={name} data-invalid={!!errors[name]}>
                <FieldLabel htmlFor={`product-${name}`}>{productFieldLabels[name]}</FieldLabel>
                {name === 'category' ? (
                  <Controller
                    name='category'
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        value={field.value || null}
                        onValueChange={value => {
                          field.onChange(value ?? '')
                          if (errors.category) void form.trigger('category')
                        }}
                      >
                        <SelectTrigger
                          ref={field.ref}
                          onBlur={field.onBlur}
                          id='product-category'
                          aria-invalid={!!errors.category}
                          aria-describedby={errors.category ? 'product-category-error' : undefined}
                          className={inputClasses}
                        >
                          <SelectValue placeholder='Choose a category' />
                        </SelectTrigger>
                        <SelectContent>
                          {productCategories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                ) : (
                  <Input
                    {...form.register(name, {
                      onChange: () => {
                        if (form.getFieldState(name).error) void form.trigger(name)
                      }
                    })}
                    id={`product-${name}`}
                    type='text'
                    inputMode={
                      step === 2 ? (name === 'quantity' || name === 'reorderLevel' ? 'numeric' : 'decimal') : 'text'
                    }
                    aria-invalid={!!errors[name]}
                    aria-describedby={errors[name] ? `product-${name}-error` : undefined}
                    className={inputClasses}
                  />
                )}
                {errors[name] && (
                  <FieldError id={`product-${name}-error`} className='flex items-start gap-1'>
                    <HugeiconsIcon icon={AlertCircleIcon} className='size-4 shrink-0' aria-hidden='true' />
                    {errors[name]?.message}
                  </FieldError>
                )}
              </Field>
            ))}
          </div>
        ) : (
          <div id='product-review' tabIndex={-1} className='space-y-5 outline-none'>
            {productStepFields.map((fields, index) => (
              <section key={steps[index]} aria-labelledby={`review-group-${index}`}>
                <h2 id={`review-group-${index}`} className='mb-3 font-medium'>
                  {steps[index]}
                </h2>
                <dl className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  {fields.map(name => (
                    <div key={name} className='min-w-0'>
                      <dt className='text-muted-foreground text-sm'>{productFieldLabels[name]}</dt>
                      <dd className='break-words'>
                        {name === 'pricePerKg'
                          ? priceFormatter.format(Number(values[name]))
                          : name === 'weightKg'
                            ? `${Number(values[name])} kg`
                            : name === 'sku'
                              ? values[name].trim().toUpperCase()
                              : values[name].trim()}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        )}
        <div className='flex justify-between gap-2'>
          {step === 2 && (
            <Button
              type='button'
              variant='outline'
              className='h-11'
              onClick={() => {
                setStep(1)
                focusField('name')
              }}
            >
              Back
            </Button>
          )}
          {step === 3 && (
            <Button type='button' variant='ghost' className='h-11' onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button type='submit' className='ml-auto h-11'>
            {step === 3 ? 'Add Products' : 'Continue'}
          </Button>
        </div>
      </form>
    </DialogContent>
  )
}
