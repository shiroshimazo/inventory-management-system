import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { AlertCircleIcon } from '@hugeicons/core-free-icons'
import { toast } from 'sonner'
import type { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { HugeiconsIcon } from '@/components/ui/hugeicons'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { previewCode, recoveryCodeSchema, recoveryEmailSchema, recoveryPasswordSchema } from './RecoverySchema'

function RecoveryError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <FieldError id={id} className='flex items-start gap-2'>
      <HugeiconsIcon icon={AlertCircleIcon} className='size-4 shrink-0' aria-hidden='true' />
      {message}
    </FieldError>
  )
}

function showValidationError() {
  toast.error('Please fix the highlighted fields.')
}

function EmailStep({ email, onContinue }: { email: string; onContinue: (email: string) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<z.infer<typeof recoveryEmailSchema>>({
    resolver: zodResolver(recoveryEmailSchema),
    mode: 'onTouched',
    defaultValues: { email }
  })
  return (
    <form noValidate onSubmit={handleSubmit(values => onContinue(values.email), showValidationError)}>
      <FieldGroup className='gap-4'>
        <Field className='gap-2' data-invalid={Boolean(errors.email)}>
          <FieldLabel htmlFor='recoveryEmail'>Email address</FieldLabel>
          <Input
            {...register('email')}
            id='recoveryEmail'
            type='email'
            autoComplete='email'
            autoCapitalize='none'
            required
            className='h-11'
            placeholder='name@example.com'
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'recoveryEmailError' : undefined}
          />
          <RecoveryError id='recoveryEmailError' message={errors.email?.message} />
        </Field>
        <Button type='submit' className='h-11 w-full'>
          Continue
        </Button>
      </FieldGroup>
    </form>
  )
}

function CodeStep({ onContinue, onBack }: { onContinue: () => void; onBack: () => void }) {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<z.infer<typeof recoveryCodeSchema>>({
    resolver: zodResolver(recoveryCodeSchema),
    mode: 'onTouched',
    defaultValues: { code: '' }
  })
  return (
    <form noValidate onSubmit={handleSubmit(onContinue, showValidationError)}>
      <FieldGroup className='gap-4'>
        <p id='previewCode' className='text-sm'>
          Preview code: <strong>{previewCode}</strong>. No email was sent.
        </p>
        <Field className='gap-2' data-invalid={Boolean(errors.code)}>
          <FieldLabel htmlFor='recoveryCode'>Verification code</FieldLabel>
          <Controller
            control={control}
            name='code'
            render={({ field }) => (
              <InputOTP
                {...field}
                id='recoveryCode'
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                inputMode='numeric'
                autoComplete='one-time-code'
                required
                aria-invalid={Boolean(errors.code)}
                aria-describedby={`previewCode${errors.code ? ' recoveryCodeError' : ''}`}
              >
                <InputOTPGroup className='w-full'>
                  {Array.from({ length: 6 }, (_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      aria-invalid={Boolean(errors.code)}
                      className='h-11 min-w-0 flex-1 shadow-none motion-reduce:transition-none motion-reduce:[&_div]:animate-none'
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            )}
          />
          <RecoveryError id='recoveryCodeError' message={errors.code?.message} />
        </Field>
        <Button type='submit' className='h-11 w-full'>
          Verify code
        </Button>
        <Button type='button' variant='outline' className='h-11 w-full' onClick={onBack}>
          Change email
        </Button>
      </FieldGroup>
    </form>
  )
}

function PasswordStep({ email, onComplete }: { email: string; onComplete: () => void }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, touchedFields, isSubmitted }
  } = useForm<z.infer<typeof recoveryPasswordSchema>>({
    resolver: zodResolver(recoveryPasswordSchema),
    mode: 'onTouched',
    defaultValues: { email, password: '', confirmPassword: '' }
  })
  const password = watch('password')
  return (
    <form
      noValidate
      onSubmit={handleSubmit(() => {
        reset()
        onComplete()
      }, showValidationError)}
    >
      <FieldGroup className='gap-4'>
        <Field className='gap-2' data-invalid={Boolean(errors.password)}>
          <FieldLabel htmlFor='recoveryPassword'>New password</FieldLabel>
          <Input
            {...register('password', { deps: touchedFields.confirmPassword || isSubmitted ? ['confirmPassword'] : [] })}
            id='recoveryPassword'
            type='password'
            autoComplete='new-password'
            required
            className='h-11'
            aria-invalid={Boolean(errors.password)}
            aria-describedby={`passwordHint${errors.password ? ' recoveryPasswordError' : ''}`}
          />
          <p id='passwordHint' className='text-muted-foreground text-sm'>
            {password.length < 8
              ? 'Use 8–128 characters. Avoid common passwords.'
              : 'For a stronger password, use a long, unique phrase.'}
          </p>
          <RecoveryError id='recoveryPasswordError' message={errors.password?.message} />
        </Field>
        <Field className='gap-2' data-invalid={Boolean(errors.confirmPassword)}>
          <FieldLabel htmlFor='recoveryConfirmPassword'>Confirm password</FieldLabel>
          <Input
            {...register('confirmPassword')}
            id='recoveryConfirmPassword'
            type='password'
            autoComplete='new-password'
            required
            className='h-11'
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={errors.confirmPassword ? 'recoveryConfirmPasswordError' : undefined}
          />
          <RecoveryError id='recoveryConfirmPasswordError' message={errors.confirmPassword?.message} />
        </Field>
        <Button type='submit' className='h-11 w-full'>
          Finish preview
        </Button>
      </FieldGroup>
    </form>
  )
}

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    headingRef.current?.focus()
  }, [step])

  const titles = ['Forgot password', 'Verify your email', 'Choose a password', 'Preview complete']
  return (
    <main className='bg-background flex min-h-dvh items-center justify-center px-4 py-8 sm:px-6'>
      <Card className='w-full max-w-md shadow-none'>
        <CardHeader>
          <CardDescription>Inventory Management System</CardDescription>
          {step < 4 && <p className='text-muted-foreground text-sm'>Step {step} of 3</p>}
          <h1 ref={headingRef} tabIndex={-1} className='text-2xl font-semibold outline-none'>
            {titles[step - 1]}
          </h1>
          <CardDescription>
            {step === 4
              ? 'No password was changed. Return to login to continue.'
              : 'UI preview only. No emails are sent or passwords saved.'}
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {step === 1 && (
            <EmailStep
              email={email}
              onContinue={value => {
                setEmail(value)
                setStep(2)
              }}
            />
          )}
          {step === 2 && (
            <>
              <p className='text-sm break-all'>{email}</p>
              <CodeStep onContinue={() => setStep(3)} onBack={() => setStep(1)} />
            </>
          )}
          {step === 3 && (
            <PasswordStep
              email={email}
              onComplete={() => {
                setEmail('')
                setStep(4)
              }}
            />
          )}
          <Button
            variant={step === 4 ? 'default' : 'ghost'}
            className='h-11 w-full'
            render={<Link to='/login' />}
            nativeButton={false}
          >
            Back to login
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
