import { createFileRoute } from '@tanstack/react-router'
import SalesPage from '@/views/pages/sales/SalesPage'

export const Route = createFileRoute('/_pages/sales')({ component: SalesPage })
