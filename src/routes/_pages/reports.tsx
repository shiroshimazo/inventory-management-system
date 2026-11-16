import { createFileRoute } from '@tanstack/react-router'
import ReportsPage from '@/views/reports/ReportsPage'

export const Route = createFileRoute('/_pages/reports')({ component: ReportsPage })
