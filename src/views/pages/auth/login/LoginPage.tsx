import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { HugeiconsIcon } from '@/components/ui/hugeicons'
import { AlertCircleIcon, LockPasswordIcon, UserRoundIcon, ViewIcon, ViewOffIcon } from '@hugeicons/core-free-icons'
import { toast } from 'sonner'
import type { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { loginSchema } from './LoginSchema'

export default function LoginPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { username: '', password: '' }
  })

  return (
    <main
      className='dark text-foreground grid min-h-dvh lg:grid-cols-[45%_1fr]'
      style={{ backgroundColor: '#171717' }}
    >
      <aside className='relative isolate hidden items-end justify-center overflow-hidden rounded-3xl px-16 pt-32 pb-64 lg:flex'>
        <div
          className='absolute inset-0 z-0'
          style={{ background: 'radial-gradient(circle at 50% 90%, #171717 40%, #7c3aed 100%)' }}
        />
        <div className='relative z-10 flex w-full max-w-sm flex-col items-center text-center'>
          <h2 className='text-4xl font-semibold tracking-tight'>Inventory Management System</h2>
          <p className='mt-4 text-lg'>Sign in to manage your inventory.</p>
        </div>
      </aside>
      <section aria-labelledby='loginHeading' className='relative isolate flex items-center justify-center px-6 py-12 sm:px-12 lg:static'>
        <div
          className='absolute inset-0 z-0 lg:hidden'
          style={{ background: 'radial-gradient(circle at 50% 90%, #171717 40%, #7c3aed 100%)' }}
        />
        <div className='relative z-10 w-full max-w-md'>
          <header className='mb-8'>
            <h1 id='loginHeading' className='text-4xl font-semibold tracking-tight'>
              Sign in
            </h1>
            <p className='text-muted-foreground mt-2 text-base'>Inventory Management System</p>
          </header>
          <form
            noValidate
            onSubmit={handleSubmit(
              () => toast.info('UI preview only. Authentication is not connected.'),
              () => toast.error('Please fix the highlighted fields.')
            )}
          >
            <FieldGroup className='gap-6'>
              <Field data-invalid={Boolean(errors.username)} className='gap-2'>
                <FieldLabel htmlFor='loginUsername'>Username</FieldLabel>
                <InputGroup className='h-11 border-transparent has-[[data-slot=input-group-control]:focus-visible]:border-transparent has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot=input-group-control]:focus-visible]:ring-transparent'>
                  <InputGroupAddon>
                    <HugeiconsIcon icon={UserRoundIcon} strokeWidth={2} className='size-[17.5px]' aria-hidden='true' />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...register('username')}
                    id='loginUsername'
                    autoComplete='username'
                    autoCapitalize='none'
                    spellCheck={false}
                    required
                    placeholder='Enter your username'
                    aria-invalid={Boolean(errors.username)}
                    aria-describedby={errors.username ? 'loginUsernameError' : undefined}
                    className='h-11'
                  />
                </InputGroup>
                {errors.username && (
                  <FieldError id='loginUsernameError' className='flex items-start gap-2'>
                    <HugeiconsIcon icon={AlertCircleIcon} className='size-4 shrink-0' aria-hidden='true' />
                    {errors.username.message}
                  </FieldError>
                )}
              </Field>
              <Field data-invalid={Boolean(errors.password)} className='gap-2'>
                <FieldLabel htmlFor='loginPassword'>Password</FieldLabel>
                <InputGroup className='h-11 border-transparent has-[[data-slot=input-group-control]:focus-visible]:border-transparent has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot=input-group-control]:focus-visible]:ring-transparent'>
                  <InputGroupAddon>
                    <HugeiconsIcon
                      icon={LockPasswordIcon}
                      strokeWidth={2}
                      className='size-[17.5px]'
                      aria-hidden='true'
                    />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...register('password')}
                    id='loginPassword'
                    type={isPasswordVisible ? 'text' : 'password'}
                    autoComplete='current-password'
                    required
                    placeholder='Enter your password'
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? 'loginPasswordError' : undefined}
                    className='h-11'
                  />
                  <InputGroupAddon align='inline-end' className='pr-0'>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='size-11 bg-transparent hover:bg-transparent dark:hover:bg-transparent'
                      aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                      aria-controls='loginPassword'
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
                {errors.password && (
                  <FieldError id='loginPasswordError' className='flex items-start gap-2'>
                    <HugeiconsIcon icon={AlertCircleIcon} className='size-4 shrink-0' aria-hidden='true' />
                    {errors.password.message}
                  </FieldError>
                )}
              </Field>
              <div className='flex justify-end'>
                <Link
                  to='/forgot-password'
                  className='text-foreground focus-visible:ring-ring inline-flex min-h-11 w-fit items-center rounded-md text-sm underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:outline-none'
                >
                  Forgot password?
                </Link>
              </div>
              <Button type='submit' className='h-11 w-full'>
                Sign in
              </Button>
            </FieldGroup>
          </form>
        </div>
      </section>
    </main>
  )
}
