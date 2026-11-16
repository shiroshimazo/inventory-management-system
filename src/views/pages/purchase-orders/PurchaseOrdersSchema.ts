import { z } from 'zod'
import { fruitProducts } from '../products/FruitProductsData.ts'
import { suppliersSeed } from '../suppliers/SuppliersData.ts'
import { MAX_ORDER_LINES, MAX_ORDER_QUANTITY, MAX_UNIT_COST, purchaseOrderStatuses } from './PurchaseOrdersData.ts'

const dateSchema = z
  .string()
  .trim()
  .pipe(z.iso.date('Enter a valid date: YYYY-MM-DD.'))
  .refine(value => !value.startsWith('0000'), 'Enter a year from 0001 to 9999.')
const quantitySchema = z
  .string()
  .trim()
  .max(7, 'Quantity must be 1 to 1,000,000.')
  .regex(/^\d+$/, 'Enter a whole number.')
  .refine(value => Number(value) > 0 && Number(value) <= MAX_ORDER_QUANTITY, 'Quantity must be 1 to 1,000,000.')
const costSchema = z
  .string()
  .trim()
  .max(10, 'Cost must be 0.01 to 1,000,000.')
  .regex(/^\d+(?:\.\d{1,2})?$/, 'Use digits and up to two decimals.')
  .refine(value => Number(value) > 0 && Number(value) <= MAX_UNIT_COST, 'Cost must be 0.01 to 1,000,000.')

export const purchaseOrderSchema = z
  .object({
    supplierId: z
      .string()
      .trim()
      .refine(value => suppliersSeed.some(supplier => supplier.id === value), 'Choose a supplier.'),
    orderDate: dateSchema,
    expectedDate: dateSchema,
    status: z.enum(purchaseOrderStatuses, { error: 'Choose an order status.' }),
    lines: z
      .array(
        z.object({
          productId: z
            .string()
            .trim()
            .refine(value => fruitProducts.some(product => product.id === value), 'Choose a product.'),
          quantity: quantitySchema,
          unitCost: costSchema
        })
      )
      .min(1, 'Add at least one line item.')
      .max(MAX_ORDER_LINES, 'Use at most 12 line items.')
  })
  .superRefine((draft, context) => {
    if (
      z.iso.date().safeParse(draft.orderDate).success &&
      z.iso.date().safeParse(draft.expectedDate).success &&
      draft.expectedDate < draft.orderDate
    ) {
      context.addIssue({
        code: 'custom',
        path: ['expectedDate'],
        message: 'Expected date must be on or after order date.'
      })
    }
    const productIds = new Set<string>()
    draft.lines.forEach((line, index) => {
      if (line.productId && productIds.has(line.productId)) {
        context.addIssue({
          code: 'custom',
          path: ['lines', index, 'productId'],
          message: 'Product already added. Update its quantity.'
        })
      }
      productIds.add(line.productId)
    })
  })

export type PurchaseOrderDraft = z.infer<typeof purchaseOrderSchema>
