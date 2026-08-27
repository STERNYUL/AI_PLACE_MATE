import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/components/ui/utils'

const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center gap-1 rounded-chip border px-2 py-0.5 text-xs leading-tight font-medium',
  {
    variants: {
      tone: {
        neutral: 'border-line bg-canvas text-ink-muted',
        fact: 'border-transparent bg-fact-soft text-fact',
        warn: 'border-warn-line bg-warn-soft text-warn',
        halt: 'border-halt-line bg-halt-soft text-halt',
        notice: 'border-notice-line bg-notice-soft text-notice',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
)

function Badge({
  className,
  tone,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ tone }), className)} {...props} />
}

export { Badge, badgeVariants }
