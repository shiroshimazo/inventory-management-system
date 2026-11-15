import { z } from 'zod'
import type { FruitProduct } from '../products/FruitProductsData.ts'
import { CURRENT_USER_NAME, getNextSaleReference, getSaleTimestamp, type Sale, type SaleLine } from './SalesData.ts'

export function createSaleSchema(products: FruitProduct[]) {
  return z
    .object({
      lines: z.array(z.object({ productId: z.string(), quantity: z.string() })).min(1, 'Add at least one product.')
    })
    .superRefine(({ lines }, context) => {
      const productIds = new Set<string>()
      lines.forEach((line, index) => {
        const product = products.find(product => product.id === line.productId)
        const issue = (field: 'quantity' | 'productId', message: string) =>
          context.addIssue({ code: 'custom', path: ['lines', index, field], message })
        if (!product || product.quantity === 0) issue('productId', 'Choose an available product.')
        if (productIds.has(line.productId)) issue('productId', 'This product is already in the sale.')
        productIds.add(line.productId)
        if (!/^\d+$/.test(line.quantity)) issue('quantity', 'Enter a whole number.')
        else if (Number(line.quantity) < 1) issue('quantity', 'Quantity must be 1 or more.')
        else if (product && (!Number.isSafeInteger(Number(line.quantity)) || Number(line.quantity) > product.quantity))
          issue('quantity', `Only ${product.quantity} left in ${product.name}.`)
      })
    })
}
export type SaleDraft = z.infer<ReturnType<typeof createSaleSchema>>

export function getDraftSaleLines(draft: SaleDraft, products: FruitProduct[]): SaleLine[] {
  return draft.lines.map(line => {
    const product = products.find(product => product.id === line.productId)!
    // Preview assumption: pricePerKg supplies the per-item PHP price until catalogue units are reconciled.
    return {
      productId: product.id,
      name: product.name,
      sku: product.sku,
      unitPrice: product.pricePerKg,
      quantity: /^\d+$/.test(line.quantity) && Number.isSafeInteger(Number(line.quantity)) ? Number(line.quantity) : 0
    }
  })
}

export function recordSale(draft: SaleDraft, products: FruitProduct[], sales: Sale[]) {
  const result = createSaleSchema(products).safeParse(draft)
  if (!result.success) return result
  const sale: Sale = {
    id: crypto.randomUUID(),
    reference: getNextSaleReference(sales),
    soldAt: getSaleTimestamp(),
    recordedBy: CURRENT_USER_NAME,
    lines: getDraftSaleLines(result.data, products)
  }
  // Single-user preview only; the server must re-check stock and deduct atomically when a backend exists.
  const remainingProducts = products.map(product => ({
    ...product,
    quantity: product.quantity - (sale.lines.find(line => line.productId === product.id)?.quantity ?? 0)
  }))
  return { success: true as const, data: { sale, products: remainingProducts } }
}
