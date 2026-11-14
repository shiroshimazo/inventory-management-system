import { z } from 'zod'
import { MAX_PRODUCT_VALUE, productCategories, type FruitProduct } from './FruitProductsData.ts'
export const MIN_PRODUCT_NAME_LENGTH = 2
export const MAX_PRODUCT_NAME_LENGTH = 60
export const MIN_SKU_LENGTH = 3
export const MAX_SKU_LENGTH = 20
function numericField(integer: boolean, positive = false) {
  return z.string().refine(
    value => {
      const text = value.trim()
      const number = Number(text)
      return (
        (integer ? /^\d+$/ : /^(\d+(\.\d{1,2})?|\.\d{1,2})$/).test(text) &&
        number >= 0 &&
        (!positive || number > 0) &&
        number <= MAX_PRODUCT_VALUE
      )
    },
    integer
      ? 'Enter a whole number from 0 to 1,000,000.'
      : positive
        ? 'Enter a price above 0 up to 1,000,000 (max 2 decimals).'
        : 'Enter a weight from 0 to 1,000,000 (max 2 decimals).'
  )
}
export function createProductSchema(products: FruitProduct[]) {
  return z.object({
    name: z.string().refine(value => {
      const name = value.trim()
      return (
        name.length >= MIN_PRODUCT_NAME_LENGTH &&
        name.length <= MAX_PRODUCT_NAME_LENGTH &&
        /\p{L}/u.test(name) &&
        /^[\p{L}\p{N} '&-]+$/u.test(name)
      )
    }, 'Use 2�60 characters with a letter; letters, numbers, spaces, hyphens, apostrophes or &.'),
    sku: z
      .string()
      .refine(value => {
        const sku = value.trim()
        return sku.length >= MIN_SKU_LENGTH && sku.length <= MAX_SKU_LENGTH && /^[a-z0-9-]+$/i.test(sku)
      }, 'Use 3�20 letters, numbers or hyphens.')
      .refine(
        value => !products.some(product => product.sku.toUpperCase() === value.trim().toUpperCase()),
        'This SKU is already used.'
      ),
    category: z.string().refine(value => productCategories.some(category => category === value), 'Choose a category.'),
    pricePerKg: numericField(false, true),
    weightKg: numericField(false),
    quantity: numericField(true),
    reorderLevel: numericField(true)
  })
}
export type ProductDraft = z.infer<ReturnType<typeof createProductSchema>>
export const productStepFields: (keyof ProductDraft)[][] = [
  ['name', 'sku', 'category'],
  ['pricePerKg', 'weightKg', 'quantity', 'reorderLevel']
]
export const productFieldLabels: Record<keyof ProductDraft, string> = {
  name: 'Product name',
  sku: 'SKU',
  category: 'Category',
  pricePerKg: 'Price per kg (USD)',
  weightKg: 'Total weight (kg)',
  quantity: 'Quantity',
  reorderLevel: 'Reorder level'
}
