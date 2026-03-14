import { cn } from '@/lib/utils/cn'

interface TextProps {
  children: React.ReactNode
  size?: 'sm' | 'base' | 'lg'
  color?: 'default' | 'secondary' | 'muted'
  className?: string
  as?: 'p' | 'span' | 'div'
}

const sizeMap = {
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg md:text-xl',
}

const colorMap = {
  default: 'text-text',
  secondary: 'text-text-secondary',
  muted: 'text-text-muted',
}

export function Text({
  children,
  size = 'base',
  color = 'default',
  className,
  as: Component = 'p',
}: TextProps) {
  return (
    <Component
      className={cn(
        'leading-relaxed',
        sizeMap[size],
        colorMap[color],
        className
      )}
    >
      {children}
    </Component>
  )
}
