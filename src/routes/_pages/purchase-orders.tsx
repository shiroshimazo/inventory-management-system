import { createFileRoute } from '@tanstack/react-router'
import PurchaseOrdersPage from '@/views/pages/purchase-orders/PurchaseOrdersPage'

export const Route = createFileRoute('/_pages/purchase-orders')({ component: PurchaseOrdersPage })
