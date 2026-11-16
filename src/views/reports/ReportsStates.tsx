import * as React from 'react'

import { Button } from '@/components/ui/button'

export type SectionState = 'loading' | 'empty' | 'error' | 'ready'

const DEFAULT_EMPTY_MESSAGE = 'No data for this range.'

const FIXED_STATE_MESSAGES: Record<Exclude<SectionState, 'ready' | 'empty'>, string> = {
  loading: 'Loading…',
  error: 'Could not load report.'
}

export default function ReportsState({
  state,
  emptyMessage = DEFAULT_EMPTY_MESSAGE,
  onClearFilters
}: {
  state: SectionState
  emptyMessage?: string
  onClearFilters: () => void
}): React.JSX.Element | null {
  if (state === 'ready') return null

  const message = state === 'empty' ? emptyMessage : FIXED_STATE_MESSAGES[state]

  return (
    <div className='flex flex-col items-center justify-center gap-2 py-8 text-center'>
      <p className='text-muted-foreground text-sm'>{message}</p>
      {state === 'empty' ? (
        <Button
          type='button'
          variant='link'
          className='h-auto min-h-11 shrink-0 whitespace-normal'
          onClick={onClearFilters}
        >
          Clear filters
        </Button>
      ) : null}
    </div>
  )
}
