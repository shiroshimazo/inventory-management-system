import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger
} from '@/components/ui/stepper'
import { cn } from '@/lib/utils'

const recoverySteps = [
  { step: 1, label: 'Email' },
  { step: 2, label: 'Verify code' },
  { step: 3, label: 'New password' }
] as const

const totalRecoverySteps = recoverySteps.length

type RecoveryStepperProps = {
  step: number
  className?: string
}

function RecoveryStepTrigger({
  label,
  step,
  currentStep,
  showLabel
}: {
  label: string
  step: number
  currentStep: number
  showLabel: boolean
}) {
  const isCompleted = step < currentStep

  return (
    <StepperTrigger
      aria-current={step === currentStep ? 'step' : undefined}
      aria-label={`Step ${step} of ${totalRecoverySteps}: ${label}${isCompleted ? ' (completed)' : ''}`}
      className={showLabel ? 'min-h-11 w-full justify-start gap-[5px] px-1' : 'size-11 justify-center'}
    >
      <StepperIndicator />
      {showLabel && <StepperTitle>{label}</StepperTitle>}
    </StepperTrigger>
  )
}

function RecoveryStepList({ step, showLabel = false }: { step: number; showLabel?: boolean }) {
  return recoverySteps.map(recoveryStep => (
    <StepperItem
      key={recoveryStep.step}
      className={showLabel ? undefined : 'not-last:flex-1'}
      disabled
      step={recoveryStep.step}
    >
      <RecoveryStepTrigger
        currentStep={step}
        label={recoveryStep.label}
        showLabel={showLabel}
        step={recoveryStep.step}
      />
      {recoveryStep.step < totalRecoverySteps && <StepperSeparator />}
    </StepperItem>
  ))
}

export default function RecoveryStepper({ step, className }: RecoveryStepperProps) {
  return (
    <nav aria-label='Password recovery progress' className={cn('w-full', className)}>
      <Stepper className='xl:hidden' orientation='horizontal' value={step}>
        <RecoveryStepList step={step} />
      </Stepper>
      <Stepper className='hidden xl:flex' orientation='vertical' value={step}>
        <RecoveryStepList showLabel step={step} />
      </Stepper>
    </nav>
  )
}
