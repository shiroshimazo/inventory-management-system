import { createFileRoute } from '@tanstack/react-router'
import SuppliersPage from '@/views/pages/suppliers/SuppliersPage'

export const Route = createFileRoute('/_pages/suppliers')({
  component: SuppliersPage
})
