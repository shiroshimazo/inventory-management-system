import type { RefObject } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircleIcon } from '@hugeicons/core-free-icons'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { HugeiconsIcon } from '@/components/ui/hugeicons'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MAX_CATEGORY_DESCRIPTION_LENGTH, type Category } from './CategoriesData'
import {
  createCategorySchema,
  categoryFieldLabels,
  categoryFieldPlaceholders,
  type CategoryDraft
} from './CategoriesSchema'

export default function CategoryDialog({
  categories,
  category,
  onSaveCategory,
  onClose,
  returnFocus
}: {
  categories: Category[]
  category?: Category
  onSaveCategory: (category: Category) => void
  onClose: () => void
  returnFocus: RefObject<HTMLButtonElement | null>
}) {
  const form = useForm<CategoryDraft>({
    resolver: zodResolver(createCategorySchema(categories.filter(item => item.id !== category?.id))),
    mode: 'onTouched',
    defaultValues: { name: category?.name ?? '', description: category?.description ?? '' }
  })
  const { errors } = form.formState
  const saveCategory = form.handleSubmit(
    draft => {
      onSaveCategory({ ...draft, id: category?.id ?? crypto.randomUUID() })
      onClose()
      toast.success(category ? 'Category updated.' : 'Category added.')
    },
    () => toast.error('Please fix the highlighted fields.')
  )
  return (
    <DialogContent finalFocus={returnFocus} className='sm:max-w-md [&>[data-slot=dialog-close]]:size-11'>
      <DialogHeader>
        <DialogTitle className='text-xl font-semibold'>{category ? 'Edit category' : 'Add category'}</DialogTitle>
        <DialogDescription>Group products for faster filtering.</DialogDescription>
      </DialogHeader>
      <form noValidate onSubmit={saveCategory} className='space-y-6'>
        {(['name', 'description'] as const).map(name => {
          const props = {
            ...form.register(name),
            id: `category-${name}`,
            placeholder: categoryFieldPlaceholders[name],
            'aria-invalid': !!errors[name],
            'aria-describedby': errors[name] ? `category-${name}-error` : undefined,
            className: 'focus-visible:border-foreground shadow-none focus-visible:ring-0 aria-invalid:ring-0'
          }
          return (
            <Field key={name} data-invalid={!!errors[name]}>
              <FieldLabel htmlFor={props.id}>{categoryFieldLabels[name]}</FieldLabel>
              {name === 'name' ? (
                <Input {...props} className={`${props.className} h-11`} />
              ) : (
                <Textarea {...props} maxLength={MAX_CATEGORY_DESCRIPTION_LENGTH} rows={3} />
              )}
              {errors[name] && (
                <FieldError id={`category-${name}-error`} className='flex items-start gap-1'>
                  <HugeiconsIcon icon={AlertCircleIcon} className='size-4 shrink-0' aria-hidden='true' />
                  {errors[name]?.message}
                </FieldError>
              )}
            </Field>
          )
        })}
        <div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
          <Button type='button' variant='outline' className='h-11' onClick={onClose}>
            Cancel
          </Button>
          <Button type='submit' className='h-11'>
            Save category
          </Button>
        </div>
      </form>
    </DialogContent>
  )
}
