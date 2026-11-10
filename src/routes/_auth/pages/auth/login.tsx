import { createFileRoute } from '@tanstack/react-router'
import Login from '@/views/pages/auth/login'

export const Route = createFileRoute('/_auth/pages/auth/login')({
  component: () => <Login />,
})