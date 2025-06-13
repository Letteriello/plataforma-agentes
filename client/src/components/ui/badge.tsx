import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive/10 text-destructive hover:bg-destructive/20 dark:bg-destructive/20 dark:text-destructive-foreground',
        outline: 'border-border bg-transparent text-foreground hover:bg-accent',

        // Status variants with modern styling
        success:
          'border-transparent bg-success/10 text-success-foreground hover:bg-success/20 dark:bg-success/20 dark:text-success-foreground',
        error:
          'border-transparent bg-destructive/10 text-destructive hover:bg-destructive/20 dark:bg-destructive/20 dark:text-destructive-foreground',
        warning:
          'border-transparent bg-warning/10 text-warning-foreground hover:bg-warning/20 dark:bg-warning/20 dark:text-warning-foreground',
        info: 'border-transparent bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',

        // Agent status variants
        online:
          'border-transparent bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
        offline:
          'border-transparent bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        pending:
          'border-transparent bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
        deployed:
          'border-transparent bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',

        // LLM specific
        llm: 'border-transparent bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
        tool: 'border-transparent bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
        user: 'border-transparent bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-[10px]',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
}

function Badge({ className, variant, size, icon, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{props.children}</span>
    </div>
  )
}

export { Badge, badgeVariants }
