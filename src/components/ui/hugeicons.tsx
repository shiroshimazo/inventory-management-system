import { HugeiconsIcon as HugeiconsIconPrimitive, type HugeiconsIconProps } from '@hugeicons/react'

const DEFAULT_STROKE_WIDTH = 2

function HugeiconsIcon({ strokeWidth = DEFAULT_STROKE_WIDTH, ...props }: HugeiconsIconProps) {
  return <HugeiconsIconPrimitive {...props} strokeWidth={strokeWidth} />
}

export { HugeiconsIcon }
