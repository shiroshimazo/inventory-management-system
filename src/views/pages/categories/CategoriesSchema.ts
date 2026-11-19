import { z } from 'zod'
import {
  CATEGORY_STATUSES,
  MIN_CATEGORY_NAME_LENGTH,
  MAX_CATEGORY_NAME_LENGTH,
  MAX_CATEGORY_DESCRIPTION_LENGTH,
  type Category
} from './CategoriesData.ts'

export function createCategorySchema(categories: Category[]) {
  return z.object({
    name: z
      .string()
      .trim()
      .refine(
        name =>
          name.length >= MIN_CATEGORY_NAME_LENGTH &&
          name.length <= MAX_CATEGORY_NAME_LENGTH &&
          /\p{L}/u.test(name) &&
          /^[\p{L}\p{M}\p{N} '&-]+$/u.test(name),
        'Use 2-40 characters with a letter.'
      )
      .refine(
        name => !categories.some(category => category.name.trim().toLowerCase() === name.toLowerCase()),
        'This category name is already used.'
      ),
    description: z.string().trim().max(MAX_CATEGORY_DESCRIPTION_LENGTH, 'Use 120 characters or fewer.'),
    status: z.enum(CATEGORY_STATUSES, { error: 'Choose Active or Inactive.' })
  })
}
export type CategoryDraft = z.infer<ReturnType<typeof createCategorySchema>>
export const categoryFieldLabels = { name: 'Name', description: 'Description (optional)' }
export const categoryFieldPlaceholders = { name: 'Berries', description: 'Short note about this group.' }
