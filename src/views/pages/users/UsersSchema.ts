import { z } from 'zod'
import {
  MIN_USER_NAME_LENGTH,
  MAX_USER_NAME_LENGTH,
  MAX_USER_EMAIL_LENGTH,
  USER_ROLES,
  USER_STATUSES,
  type User
} from './UsersData.ts'

export function createUserSchema(users: User[]) {
  return z.object({
    name: z
      .string()
      .trim()
      .refine(
        name =>
          name.length >= MIN_USER_NAME_LENGTH &&
          name.length <= MAX_USER_NAME_LENGTH &&
          /\p{L}/u.test(name) &&
          /^[\p{L}\p{M} '\u2019-]+$/u.test(name),
        'Enter a full name with letters, spaces, hyphens, or apostrophes.'
      ),
    email: z
      .string()
      .trim()
      .max(MAX_USER_EMAIL_LENGTH, 'Enter a valid email, like name@example.com.')
      .email('Enter a valid email, like name@example.com.')
      .refine(email => !/\s/u.test(email), 'Enter a valid email, like name@example.com.')
      .refine(
        email => !users.some(user => user.email.trim().toLowerCase() === email.toLowerCase()),
        'This email is already used.'
      ),
    role: z.enum(USER_ROLES, { error: 'Choose Admin or Staff.' }),
    status: z.enum(USER_STATUSES, { error: 'Choose Active or Inactive.' })
  })
}
export type UserDraft = z.infer<ReturnType<typeof createUserSchema>>
export const userFieldLabels = { name: 'Full name', email: 'Email', role: 'Role', status: 'Status' }
export const userFieldPlaceholders = {
  name: 'Alex Tan',
  email: 'name@example.com',
  role: 'Choose role',
  status: 'Choose status'
}
