import { createFileRoute } from '@tanstack/react-router'
import ForgotPassword from '@/views/pages/auth/forgot-password'

export const Route = createFileRoute('/_auth/pages/auth/forgot-password')({
  component: () => <ForgotPassword />,
})