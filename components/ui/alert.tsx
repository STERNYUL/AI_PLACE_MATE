import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/components/ui/utils'

const alertVariants = cva('rounded-card border px-3 py-2.5 text-sm', {
  variants: {
    tone: {
      warn: 'border-warn-line bg-warn-soft text-warn',
      halt: 'border-halt-line bg-halt-soft text-halt',
      notice: 'border-notice-line bg-notice-soft text-notice',
    },
  },
  defaultVariants: { tone: 'notice' },
})

function Alert({
  className,
  tone,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div data-slot="alert" role="note" className={cn(alertVariants({ tone }), className)} {...props} />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="alert-title" className={cn('font-semibold tracking-tight', className)} {...props} />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn('mt-0.5 leading-relaxed opacity-90', className)}
      {...props}
    />
  )
}

export { Alert, AlertDescription, AlertTitle, alertVariants }
