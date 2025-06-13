import { Loader2 } from 'lucide-react'
import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export function LoadingSpinner({
  className,
  ...props
}: HTMLAttributes<SVGElement>) {
  return (
    <Loader2
      aria-label="Loading"
      role="status"
      className={cn('h-5 w-5 animate-spin', className)}
      {...props}
    />
  )
}
