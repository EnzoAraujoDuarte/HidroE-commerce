import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface SectionProps {
  children: React.ReactNode
  className?: string
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

const spacingMap = {
  none: '',
  sm: 'py-12 md:py-16',
  md: 'py-16 md:py-24',
  lg: 'py-24 md:py-32',
  xl: 'py-32 md:py-48',
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  function Section({ children, className, spacing = 'lg' }, ref) {
    return (
      <section ref={ref} className={cn(spacingMap[spacing], className)}>
        {children}
      </section>
    )
  }
)
