import { cn } from '@/lib/utils/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      data-cursor="action"
      className={cn(
        'ui-press inline-flex items-center justify-center overflow-hidden rounded-full font-medium',
        'transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-accent text-text-inverse hover:bg-accent-hover': variant === 'primary',
          'border border-border bg-transparent text-text hover:border-text/10 hover:bg-surface-hover': variant === 'secondary',
          'bg-transparent text-text hover:text-text-secondary': variant === 'ghost',
        },
        {
          'h-9 px-4 text-sm': size === 'sm',
          'h-11 px-6 text-sm': size === 'md',
          'h-13 px-8 text-base': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
