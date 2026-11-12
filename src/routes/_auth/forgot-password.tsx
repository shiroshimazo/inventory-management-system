import { createFileRoute } from '@tanstack/react-router'
import ForgotPasswordPage from '@/views/pages/auth/forgot-password/ForgotPasswordPage'

export const Route = createFileRoute('/_auth/forgot-password')({
  component: ForgotPasswordPage
})
