import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { HugeiconsIcon } from '@hugeicons/react'
import { AlertCircleIcon, LockPasswordIcon, UserIcon, ViewIcon, ViewOffIcon } from '@hugeicons/core-free-icons'
import { toast } from 'sonner'
import type { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
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
    <main className='bg-background flex min-h-dvh items-center justify-center px-4 py-8 sm:px-6'>
      <Card className='w-full max-w-md shadow-none'>
        <CardHeader>
          <h1 className='text-2xl font-semibold'>Login</h1>
          <CardDescription>Inventory Management System</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            noValidate
            onSubmit={handleSubmit(
              () => toast.info('UI preview only. Authentication is not connected.'),
              () => toast.error('Please fix the highlighted fields.')
            )}
          >
            <FieldGroup className='gap-4'>
              <Field data-invalid={Boolean(errors.username)} className='gap-2'>
                <FieldLabel htmlFor='loginUsername'>Username</FieldLabel>
                <InputGroup className='h-11'>
                  <InputGroupAddon>
                    <HugeiconsIcon icon={UserIcon} aria-hidden='true' />
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
                <InputGroup className='h-11'>
                  <InputGroupAddon>
                    <HugeiconsIcon icon={LockPasswordIcon} aria-hidden='true' />
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
                      className='size-11'
                      aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                      aria-controls='loginPassword'
                      onClick={() => setIsPasswordVisible(isVisible => !isVisible)}
                    >
                      <HugeiconsIcon icon={isPasswordVisible ? ViewOffIcon : ViewIcon} aria-hidden='true' />
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
                {errors.password && (
                  <FieldError id='loginPasswordError' className='flex items-start gap-2'>
                    <HugeiconsIcon icon={AlertCircleIcon} className='size-4 shrink-0' aria-hidden='true' />
                    {errors.password.message}
                  </FieldError>
                )}
                <Link
                  to='/forgot-password'
                  className='focus-visible:ring-ring inline-flex min-h-11 w-fit items-center rounded-md text-sm underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:outline-none'
                >
                  Forgot Password
                </Link>
              </Field>
              <Button type='submit' className='h-11 w-full'>
                Login
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
