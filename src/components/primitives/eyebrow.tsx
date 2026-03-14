import { cn } from '@/lib/utils/cn'

interface EyebrowProps {
  children: React.ReactNode
  className?: string
}

export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <span
      className={cn(
        'text-eyebrow inline-block',
        className
      )}
    >
      {children}
    </span>
  )
}
