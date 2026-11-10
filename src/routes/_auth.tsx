import { Outlet, createFileRoute } from '@tanstack/react-router'
import BlankLayout from '@/components/layout/BlankLayout'

export const Route = createFileRoute('/_auth')({
  component: () => <BlankLayout><Outlet /></BlankLayout>,
})