import { createFileRoute } from '@tanstack/react-router'
import UserSetting from '@/views/pages/user-settings'

export const Route = createFileRoute('/_pages/pages/user-settings')({
  validateSearch: (search: Record<string, unknown>): { setting?: 'general' | 'workspace' } => ({
    setting: search.setting === 'workspace' ? 'workspace' : 'general',
  }),
  component: () => <UserSetting />,
})