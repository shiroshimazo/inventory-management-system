import { createFileRoute } from '@tanstack/react-router'
import ProductsPage from '@/views/pages/products/ProductsPage'

export const Route = createFileRoute('/_pages/products')({
  component: ProductsPage
})
