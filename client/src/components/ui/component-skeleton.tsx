import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

import { Skeleton } from './skeleton'

interface ComponentSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  lines?: number
}

export function ComponentSkeleton({
  lines = 3,
  className,
  ...props
}: ComponentSkeletonProps) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  )
}
