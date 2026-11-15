import { createFileRoute } from '@tanstack/react-router'
import CategoriesPage from '@/views/pages/categories/CategoriesPage'

export const Route = createFileRoute('/_pages/categories')({
  component: CategoriesPage
})
