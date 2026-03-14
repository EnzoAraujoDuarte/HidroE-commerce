import { cn } from '@/lib/utils/cn'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'default' | 'narrow' | 'wide' | 'full'
  as?: 'div' | 'section' | 'article'
}

export function Container({
  children,
  className,
  size = 'default',
  as: Component = 'div',
}: ContainerProps) {
  return (
    <Component
      className={cn(
        'mx-auto w-full px-5 md:px-8 lg:px-12',
        {
          'max-w-[1200px]': size === 'default',
          'max-w-[800px]': size === 'narrow',
          'max-w-[1440px]': size === 'wide',
          'max-w-none': size === 'full',
        },
        className
      )}
    >
      {children}
    </Component>
  )
}
