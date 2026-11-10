import { createFileRoute } from '@tanstack/react-router'
import TwoSteps from '@/views/pages/auth/two-steps'

export const Route = createFileRoute('/_auth/pages/auth/two-steps')({
  component: () => <TwoSteps />,
})