import { z } from 'zod'

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must be 3–20 characters.')
    .max(20, 'Username must be 3–20 characters.')
    .regex(/^[A-Za-z][A-Za-z0-9_]*$/, 'Start with a letter. Use letters, numbers, or underscores.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(128, 'Password must be 128 characters or fewer.')
    .refine(password => password.trim().length > 0, 'Enter your password.')
})
