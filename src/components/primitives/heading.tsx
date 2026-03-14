import { cn } from '@/lib/utils/cn'

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4'

interface HeadingProps {
  children: React.ReactNode
  as?: HeadingLevel
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'display'
  className?: string
}

const sizeMap = {
  sm: 'text-xl md:text-2xl',
  md: 'text-2xl md:text-3xl',
  lg: 'text-3xl md:text-4xl',
  xl: 'text-4xl md:text-5xl',
  '2xl': 'text-5xl md:text-6xl lg:text-7xl',
  display: 'text-6xl md:text-7xl lg:text-8xl',
}

export function Heading({
  children,
  as: Component = 'h2',
  size = 'lg',
  className,
}: HeadingProps) {
  return (
    <Component
      className={cn(
        'text-display text-text',
        sizeMap[size],
        className
      )}
    >
      {children}
    </Component>
  )
}
