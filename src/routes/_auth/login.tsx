import { createFileRoute } from '@tanstack/react-router'
import LoginPage from '@/views/pages/auth/login/LoginPage'

export const Route = createFileRoute('/_auth/login')({
  component: LoginPage
})
