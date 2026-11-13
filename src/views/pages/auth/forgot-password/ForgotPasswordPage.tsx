import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { AlertCircleIcon, ViewIcon, ViewOffIcon } from '@hugeicons/core-free-icons'
import { toast } from 'sonner'
import type { z } from 'zod'

import { OTPInput } from '@/components/motion/otp-input'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { HugeiconsIcon } from '@/components/ui/hugeicons'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import PasswordStrengthMeter from './PasswordStrengthMeter'
import RecoveryStepper from './RecoveryStepper'
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
            className='h-11 border-transparent shadow-none focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-transparent aria-invalid:ring-0'
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
          <Controller
            control={control}
            name='code'
            render={({ field }) => (
              <OTPInput
                aria-describedby={`previewCode${errors.code ? ' recoveryCodeError' : ''}`}
                aria-label='Verification code'
                label='Verification code'
                onBlur={field.onBlur}
                onChange={field.onChange}
                status={errors.code ? 'error' : 'idle'}
                value={field.value}
              />
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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
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
          <InputGroup className='h-11 border-transparent has-[[data-slot=input-group-control]:focus-visible]:border-transparent has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot=input-group-control]:focus-visible]:ring-transparent has-[[data-slot][aria-invalid=true]]:ring-0'>
            <InputGroupInput
              {...register('password', {
                deps: touchedFields.confirmPassword || isSubmitted ? ['confirmPassword'] : []
              })}
              id='recoveryPassword'
              type={isPasswordVisible ? 'text' : 'password'}
              autoComplete='new-password'
              required
              aria-invalid={Boolean(errors.password)}
              aria-describedby={`passwordStrength${errors.password ? ' recoveryPasswordError' : ''}`}
            />
            <InputGroupAddon align='inline-end' className='pr-0'>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='size-11 bg-transparent hover:bg-transparent dark:hover:bg-transparent'
                aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                aria-controls='recoveryPassword'
                onClick={() => setIsPasswordVisible(isVisible => !isVisible)}
              >
                <HugeiconsIcon
                  icon={isPasswordVisible ? ViewOffIcon : ViewIcon}
                  strokeWidth={2}
                  className='size-[17.5px]'
                  aria-hidden='true'
                />
              </Button>
            </InputGroupAddon>
          </InputGroup>
          <RecoveryError id='recoveryPasswordError' message={errors.password?.message} />
          <PasswordStrengthMeter id='passwordStrength' password={password} />
        </Field>
        <Field className='gap-2' data-invalid={Boolean(errors.confirmPassword)}>
          <FieldLabel htmlFor='recoveryConfirmPassword'>Confirm password</FieldLabel>
          <Input
            {...register('confirmPassword')}
            id='recoveryConfirmPassword'
            type='password'
            autoComplete='new-password'
            required
            className='h-11 border-transparent shadow-none focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-transparent aria-invalid:ring-0'
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
    <main className='dark text-foreground grid min-h-dvh lg:grid-cols-[45%_1fr]' style={{ backgroundColor: '#171717' }}>
      <aside className='relative isolate hidden items-end justify-center overflow-hidden rounded-3xl px-16 pt-32 pb-64 lg:flex'>
        <div
          className='absolute inset-0 z-0'
          style={{ background: 'radial-gradient(circle at 50% 90%, #171717 40%, #7c3aed 100%)' }}
        />
        <div className='relative z-10 flex w-full max-w-sm flex-col items-center text-center'>
          <h2 className='text-4xl font-semibold tracking-tight'>Inventory Management System</h2>
          <p className='mt-4 text-lg'>Reset your password to manage your inventory.</p>
        </div>
      </aside>
      <section
        aria-labelledby='recoveryHeading'
        className='relative isolate flex items-center justify-center px-6 py-12 sm:px-12 lg:static'
      >
        <div
          className='absolute inset-0 z-0 lg:hidden'
          style={{ background: 'radial-gradient(circle at 50% 90%, #171717 40%, #7c3aed 100%)' }}
        />
        <div className='relative z-10 grid w-full max-w-md gap-6 xl:max-w-[38rem] xl:grid-cols-[9rem_minmax(0,1fr)] xl:gap-x-4 xl:gap-y-8'>
          <header className='xl:col-start-2 xl:row-start-1'>
            <h1
              ref={headingRef}
              tabIndex={-1}
              id='recoveryHeading'
              className='text-4xl font-semibold tracking-tight outline-none'
            >
              {titles[step - 1]}
            </h1>
            <p className='text-muted-foreground mt-2 text-base'>Inventory Management System</p>
            {step === 4 ? (
              <p className='text-muted-foreground mt-1 text-sm'>
                No password was changed. Return to login to continue.
              </p>
            ) : (
              <p className='text-muted-foreground mt-1 text-sm'>
                UI preview only. No emails are sent or passwords saved.
              </p>
            )}
          </header>
          <RecoveryStepper className='xl:col-start-1 xl:row-span-2 xl:row-start-1' step={step} />
          <div className='space-y-4 xl:col-start-2 xl:row-start-2'>
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
          </div>
        </div>
      </section>
    </main>
  )
}
