'use client'

import * as React from 'react'

export const AXIS_TICK_MAX_CHARS = 18

export const reportYAxisProps = {
  axisLine: false,
  tickLine: false,
  width: 'auto',
  tickMargin: 8,
  minTickGap: 8
} as const

export function truncateTick(value: string | number, maxChars: number = AXIS_TICK_MAX_CHARS): string {
  const text = String(value).trim()

  if (!text) {
    return ''
  }

  const characters = Array.from(text)
  const limit = Math.max(0, maxChars)

  return characters.length > limit ? `${characters.slice(0, limit).join('')}…` : text
}

export function useIsNarrowChart(): boolean {
  const [isNarrow, setIsNarrow] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }

    const mediaQuery = window.matchMedia('(max-width: 640px)')
    setIsNarrow(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => setIsNarrow(event.matches)

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }

    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [])

  return isNarrow
}

export function useIsRtl(): boolean {
  const [isRtl, setIsRtl] = React.useState(false)

  React.useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    setIsRtl(document.dir === 'rtl' || document.documentElement.dir === 'rtl')
  }, [])

  return isRtl
}

export function getChartMargins(isRtl: boolean): { top: number; right: number; bottom: number; left: number } {
  return { top: 8, right: isRtl ? 8 : 16, bottom: 8, left: isRtl ? 16 : 8 }
}

export function clampNonNegative(value: number): number {
  return Math.max(0, value)
}
