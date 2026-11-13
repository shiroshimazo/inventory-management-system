import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons'

import { HugeiconsIcon } from '@/components/ui/hugeicons'
import { cn } from '@/lib/utils'
import { passwordChecks } from './RecoverySchema'

const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong']

function getPasswordStrength(password: string) {
  const metCount = passwordChecks.filter(check => check.test(password)).length
  const lengthCheck = passwordChecks.find(check => check.id === 'length')
  const hasEnoughCharacters = lengthCheck?.test(password) ?? false

  if (password.length === 0) {
    return { level: 0, label: '', metCount }
  }
  if (!hasEnoughCharacters) {
    return { level: 1, label: 'Too short', metCount }
  }
  return { level: metCount, label: strengthLabels[metCount], metCount }
}

export default function PasswordStrengthMeter({ id, password }: { id: string; password: string }) {
  const { level, label, metCount } = getPasswordStrength(password)
  const summary = password
    ? `Password strength: ${label}. ${metCount} of ${passwordChecks.length} requirements met.`
    : 'No password entered.'

  return (
    <div id={id} className='space-y-3'>
      <div className='flex items-center gap-3'>
        <div
          role='meter'
          aria-label='Password strength'
          aria-valuemin={0}
          aria-valuemax={4}
          aria-valuenow={level}
          aria-valuetext={label || 'No password yet'}
          className='flex flex-1 gap-1.5'
        >
          {[0, 1, 2, 3].map(index => (
            <span key={index} className='bg-muted h-1 flex-1 overflow-hidden rounded-full'>
              <span
                className={cn(
                  'bg-primary block h-full rounded-full transition-[width] duration-200 ease-out motion-reduce:transition-none',
                  index < level ? 'w-full' : 'w-0'
                )}
              />
            </span>
          ))}
        </div>
        <span aria-hidden='true' className='text-muted-foreground w-20 shrink-0 text-right text-sm'>
          {label}
        </span>
      </div>
      <ul aria-label='Password requirements' className='grid gap-1.5'>
        {passwordChecks.map(check => {
          const isMet = check.test(password)
          return (
            <li
              key={check.id}
              className={cn('flex items-center gap-2 text-sm', isMet ? 'text-foreground' : 'text-muted-foreground')}
            >
              {isMet ? (
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className='size-4 shrink-0' aria-hidden='true' />
              ) : (
                <span aria-hidden='true' className='border-muted-foreground/50 size-4 shrink-0 rounded-full border' />
              )}
              {check.label}
              <span className='sr-only'>{isMet ? ' (met)' : ' (not met)'}</span>
            </li>
          )
        })}
      </ul>
      <p role='status' className='sr-only'>
        {summary}
      </p>
    </div>
  )
}
