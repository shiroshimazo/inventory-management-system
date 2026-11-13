import { z } from 'zod'

// shortcut: this public demo code only previews verification; replace with server verification before connecting authentication.
export const previewCode = '123456'

const minPasswordLength = 12
const maxPasswordLength = 128
const commonPasswords = ['password', 'password123', '12345678', '123456789', 'qwerty123']

type PasswordCheck = {
  id: string
  label: string
  message: string
  test: (password: string) => boolean
}

export const passwordChecks: PasswordCheck[] = [
  {
    id: 'length',
    label: `At least ${minPasswordLength} characters`,
    message: `Use at least ${minPasswordLength} characters.`,
    test: password => password.length >= minPasswordLength
  },
  {
    id: 'case',
    label: 'Upper and lowercase letters',
    message: 'Use uppercase and lowercase letters.',
    test: password => /\p{Ll}/u.test(password) && /\p{Lu}/u.test(password)
  },
  {
    id: 'number',
    label: 'At least one number',
    message: 'Include at least one number.',
    test: password => /\p{N}/u.test(password)
  },
  {
    id: 'symbol',
    label: 'At least one symbol',
    message: 'Include at least one symbol.',
    test: password => /[^\p{L}\p{N}\s]/u.test(password)
  }
]

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
      .max(maxPasswordLength, 'Use 128 characters or fewer.')
      .refine(value => value.trim().length > 0, 'Enter a new password.')
      .superRefine((value, context) => {
        if (value.trim().length === 0) return
        const failedCheck = passwordChecks.find(check => !check.test(value))
        if (failedCheck) context.addIssue({ code: 'custom', message: failedCheck.message })
      })
      .refine(
        value => !/^(.)\1+$/.test(value) && !commonPasswords.includes(value.toLowerCase()),
        'Choose a less common password.'
      ),
    confirmPassword: z.string().min(1, 'Confirm your password.').max(maxPasswordLength, 'Use 128 characters or fewer.')
  })
  .refine(value => value.password.toLowerCase() !== value.email.toLowerCase(), {
    path: ['password'],
    message: 'Use a password different from your email.'
  })
  .refine(value => value.password === value.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.'
  })
