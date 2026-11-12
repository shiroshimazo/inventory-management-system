import { z } from 'zod'

// shortcut: this public demo code only previews verification; replace with server verification before connecting authentication.
export const previewCode = '123456'

export const recoveryEmailSchema = z.object({
  email: z.string().trim().max(254, 'Use 254 characters or fewer.').email('Enter a valid email, like name@example.com.')
})

export const recoveryCodeSchema = z.object({
  code: z
    .string()
    .regex(/^\d{6}$/, 'Enter all six digits.')
    .refine((value): boolean => value === previewCode, 'Use the preview code shown above.')
})

export const recoveryPasswordSchema = z
  .object({
    email: z.string(),
    password: z
      .string()
      .min(8, 'Use at least 8 characters.')
      .max(128, 'Use 128 characters or fewer.')
      .refine(value => value.trim().length > 0, 'Enter a new password.')
      .refine(
        value =>
          !/^(.)\1+$/.test(value) &&
          !['password', 'password123', '12345678', '123456789', 'qwerty123'].includes(value.toLowerCase()),
        'Choose a less common password.'
      ),
    confirmPassword: z.string().min(1, 'Confirm your password.').max(128, 'Use 128 characters or fewer.')
  })
  .refine(value => value.password.toLowerCase() !== value.email.toLowerCase(), {
    path: ['password'],
    message: 'Use a password different from your email.'
  })
  .refine(value => value.password === value.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.'
  })
