export const USER_ROLES = ['Admin', 'Staff'] as const
export const USER_STATUSES = ['Active', 'Inactive'] as const
export type UserRole = (typeof USER_ROLES)[number]
export type UserStatus = (typeof USER_STATUSES)[number]
export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  joinedAt: string
}
export const MIN_USER_NAME_LENGTH = 2
export const MAX_USER_NAME_LENGTH = 60
export const MAX_USER_EMAIL_LENGTH = 254
export const usersSeed: User[] = [
  {
    id: 'u1',
    name: 'Alex Tan',
    email: 'alex.tan@example.com',
    role: 'Admin',
    status: 'Active',
    joinedAt: '2025-01-15'
  },
  {
    id: 'u2',
    name: 'Sofia Reyes',
    email: 'sofia.reyes@example.com',
    role: 'Staff',
    status: 'Active',
    joinedAt: '2025-03-04'
  },
  {
    id: 'u3',
    name: 'Élodie Martin',
    email: 'elodie.martin@example.com',
    role: 'Staff',
    status: 'Inactive',
    joinedAt: '2025-05-21'
  },
  {
    id: 'u4',
    name: "Liam O'Brien",
    email: 'liam.obrien@example.com',
    role: 'Admin',
    status: 'Inactive',
    joinedAt: '2025-08-12'
  },
  {
    id: 'u5',
    name: 'Mei Chen',
    email: 'mei.chen@example.com',
    role: 'Staff',
    status: 'Active',
    joinedAt: '2026-01-09'
  },
  {
    id: 'u6',
    name: 'Daniel Cruz',
    email: 'daniel.cruz@example.com',
    role: 'Staff',
    status: 'Active',
    joinedAt: '2026-02-18'
  },
  {
    id: 'u7',
    name: 'Amara Okafor',
    email: 'amara.okafor@example.com',
    role: 'Admin',
    status: 'Active',
    joinedAt: '2026-04-06'
  },
  {
    id: 'u8',
    name: 'Noah Patel',
    email: 'noah.patel@example.com',
    role: 'Staff',
    status: 'Inactive',
    joinedAt: '2026-07-23'
  }
]
const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC'
})
export function formatUserDate(date: string): string {
  return dateFormatter.format(new Date(`${date}T00:00:00Z`))
}
export function getUserJoinedDate(): string {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}
