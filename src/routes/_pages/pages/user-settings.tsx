import { createFileRoute } from '@tanstack/react-router'
import UserSettings from '@/views/pages/user-settings'

export const Route = createFileRoute('/_pages/pages/user-settings')({
  component: UserSettings,
})
