import type { RefObject } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircleIcon } from '@hugeicons/core-free-icons'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { HugeiconsIcon } from '@/components/ui/hugeicons'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { USER_ROLES, USER_STATUSES, getUserJoinedDate, type User } from './UsersData'
import { createUserSchema, userFieldLabels, userFieldPlaceholders, type UserDraft } from './UsersSchema'

export default function UserDialog({
  users,
  user,
  onSave,
  onClose,
  returnFocus
}: {
  users: User[]
  user?: User
  onSave: (user: User) => void
  onClose: () => void
  returnFocus: RefObject<HTMLButtonElement | null>
}) {
  const form = useForm<UserDraft>({
    resolver: zodResolver(createUserSchema(users.filter(item => item.id !== user?.id))),
    mode: 'onTouched',
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      role: user?.role ?? 'Staff',
      status: user?.status ?? 'Active'
    }
  })
  const saveUser = form.handleSubmit(
    draft => {
      onSave({ ...draft, id: user?.id ?? crypto.randomUUID(), joinedAt: user?.joinedAt ?? getUserJoinedDate() })
      onClose()
      toast.success(user ? 'User updated.' : 'User added.')
    },
    () => toast.error('Please fix the highlighted fields.')
  )
  return (
    <DialogContent
      finalFocus={() => (returnFocus.current?.isConnected ? returnFocus.current : document.getElementById('add-user'))}
      className='duration-200 ease-out motion-reduce:animate-none [&>[data-slot=dialog-close]]:size-11'
    >
      <DialogHeader>
        <DialogTitle className='text-xl font-semibold'>{user ? 'Edit user' : 'Add user'}</DialogTitle>
        <DialogDescription>Set the account role and status.</DialogDescription>
      </DialogHeader>
      <form noValidate onSubmit={saveUser} className='space-y-6'>
        {(['name', 'email', 'role', 'status'] as const).map(name => (
          <Controller
            key={name}
            name={name}
            control={form.control}
            render={({ field, fieldState }) => {
              const id = `user-${name}`
              const accessibility = {
                id,
                'aria-invalid': !!fieldState.error,
                'aria-describedby': fieldState.error ? `${id}-error` : undefined
              }
              const options = name === 'role' ? USER_ROLES : USER_STATUSES
              return (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor={id}>{userFieldLabels[name]}</FieldLabel>
                  {name === 'name' || name === 'email' ? (
                    <Input
                      {...field}
                      {...accessibility}
                      type={name === 'email' ? 'email' : 'text'}
                      autoComplete={name === 'email' ? 'email' : 'name'}
                      placeholder={userFieldPlaceholders[name]}
                      className='focus-visible:border-foreground h-11 shadow-none focus-visible:ring-0 aria-invalid:ring-0'
                    />
                  ) : (
                    <Select value={field.value} onValueChange={value => field.onChange(value ?? '')}>
                      <SelectTrigger
                        {...accessibility}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        className='focus-visible:border-foreground w-full shadow-none focus-visible:ring-0 aria-invalid:ring-0 data-[size=default]:h-11'
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className='animate-none shadow-none'>
                        {options.map(option => (
                          <SelectItem key={option} value={option} className='min-h-11'>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {fieldState.error && (
                    <FieldError id={`${id}-error`} className='flex items-start gap-1'>
                      <HugeiconsIcon icon={AlertCircleIcon} className='size-4 shrink-0' aria-hidden='true' />
                      {fieldState.error.message}
                    </FieldError>
                  )}
                </Field>
              )
            }}
          />
        ))}
        <div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
          <Button type='button' variant='outline' className='h-11' onClick={onClose}>
            Cancel
          </Button>
          <Button type='submit' className='h-11'>
            {user ? 'Save user' : 'Add user'}
          </Button>
        </div>
      </form>
    </DialogContent>
  )
}
