import { cn } from '@/lib/utils/cn'

interface DividerProps {
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

export function Divider({
  className,
  orientation = 'horizontal',
}: DividerProps) {
  return (
    <div
      className={cn(
        'bg-border',
        {
          'h-px w-full': orientation === 'horizontal',
          'h-full w-px': orientation === 'vertical',
        },
        className
      )}
      role="separator"
    />
  )
}
