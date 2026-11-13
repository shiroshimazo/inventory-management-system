import { createContext, useContext } from 'react'
import { Tick02Icon } from '@hugeicons/core-free-icons'

import { HugeiconsIcon } from '@/components/ui/hugeicons'
import { cn } from '@/lib/utils'

type StepperOrientation = 'horizontal' | 'vertical'
type StepperStepState = 'active' | 'completed' | 'inactive'

type StepperContextValue = {
  activeStep: number
  onStepSelect?: (step: number) => void
  orientation: StepperOrientation
}

const StepperContext = createContext<StepperContextValue | null>(null)

function useStepper() {
  const context = useContext(StepperContext)
  if (!context) {
    throw new Error('Stepper parts must be used inside Stepper.')
  }
  return context
}

type StepperItemContextValue = {
  step: number
  state: StepperStepState
  isDisabled: boolean
}

const StepperItemContext = createContext<StepperItemContextValue | null>(null)

function useStepperItem() {
  const context = useContext(StepperItemContext)
  if (!context) {
    throw new Error('Stepper item parts must be used inside StepperItem.')
  }
  return context
}

function Stepper({
  value,
  onValueChange,
  orientation = 'horizontal',
  className,
  ...props
}: React.ComponentProps<'div'> & {
  value: number
  onValueChange?: (step: number) => void
  orientation?: StepperOrientation
}) {
  return (
    <StepperContext.Provider value={{ activeStep: value, onStepSelect: onValueChange, orientation }}>
      <div
        data-slot='stepper'
        data-orientation={orientation}
        className={cn('inline-flex w-full', orientation === 'horizontal' ? 'flex-row' : 'flex-col', className)}
        {...props}
      />
    </StepperContext.Provider>
  )
}

function StepperItem({
  step,
  disabled = false,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  step: number
  disabled?: boolean
}) {
  const { activeStep, orientation } = useStepper()
  const state: StepperStepState = step < activeStep ? 'completed' : step === activeStep ? 'active' : 'inactive'

  return (
    <StepperItemContext.Provider value={{ step, state, isDisabled: disabled }}>
      <div
        data-slot='stepper-item'
        data-state={state}
        className={cn(
          'group/step flex',
          orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col',
          className
        )}
        {...props}
      />
    </StepperItemContext.Provider>
  )
}

function StepperTrigger({ className, type = 'button', ...props }: React.ComponentProps<'button'>) {
  const { onStepSelect } = useStepper()
  const { step, isDisabled } = useStepperItem()

  return (
    <button
      type={type}
      data-slot='stepper-trigger'
      className={cn(
        'focus-visible:border-ring focus-visible:ring-ring/50 hover:bg-muted/40 group-data-[state=inactive]/step:text-muted-foreground inline-flex items-center rounded-md text-left transition-colors outline-none focus-visible:ring-3 disabled:pointer-events-none',
        className
      )}
      onClick={() => onStepSelect?.(step)}
      disabled={isDisabled}
      {...props}
    />
  )
}

function StepperIndicator({ className, ...props }: React.ComponentProps<'span'>) {
  const { state, step } = useStepperItem()

  return (
    <span
      data-slot='stepper-indicator'
      data-state={state}
      className={cn(
        'bg-muted text-muted-foreground data-[state=active]:bg-primary data-[state=completed]:bg-primary data-[state=active]:text-primary-foreground data-[state=completed]:text-primary-foreground relative flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium tabular-nums transition-colors',
        className
      )}
      {...props}
    >
      <span className='transition-all group-data-[state=completed]/step:scale-0 group-data-[state=completed]/step:opacity-0 motion-reduce:transition-none'>
        {step}
      </span>
      <HugeiconsIcon
        icon={Tick02Icon}
        aria-hidden='true'
        className='absolute size-4 scale-0 opacity-0 transition-all group-data-[state=completed]/step:scale-100 group-data-[state=completed]/step:opacity-100 motion-reduce:transition-none'
      />
    </span>
  )
}

function StepperTitle({ className, ...props }: React.ComponentProps<'span'>) {
  return <span data-slot='stepper-title' className={cn('text-sm font-medium', className)} {...props} />
}

function StepperSeparator({ className, ...props }: React.ComponentProps<'div'>) {
  const { orientation } = useStepper()

  if (orientation === 'vertical') {
    return (
      <div data-slot='stepper-separator' className={cn('flex h-12 w-6 justify-center', className)} {...props}>
        <span className='bg-muted group-data-[state=completed]/step:bg-primary w-0.5 transition-colors motion-reduce:transition-none' />
      </div>
    )
  }

  return (
    <div
      data-slot='stepper-separator'
      className={cn(
        'bg-muted group-data-[state=completed]/step:bg-primary mx-2 h-0.5 flex-1 transition-colors motion-reduce:transition-none',
        className
      )}
      {...props}
    />
  )
}

export { Stepper, StepperIndicator, StepperItem, StepperSeparator, StepperTitle, StepperTrigger }
