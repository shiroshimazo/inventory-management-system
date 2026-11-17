import { createFileRoute } from '@tanstack/react-router'
import UsersPage from '@/views/pages/users/UsersPage'

export const Route = createFileRoute('/_pages/users')({ component: UsersPage })
