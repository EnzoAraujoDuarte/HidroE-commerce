import { cn } from '@/lib/utils/cn'

interface ProductGridSkeletonProps {
  count?: number
  className?: string
}

export function ProductGridSkeleton({
  count = 8,
  className,
}: ProductGridSkeletonProps) {
  return (
    <div
      className={cn(
        'grid gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12',
        'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-[3/4] bg-bg-muted mb-4" />

      {/* Text placeholders */}
      <div className="space-y-2">
        <div className="h-3 w-16 bg-bg-muted rounded" />
        <div className="h-4 w-3/4 bg-bg-muted rounded" />
        <div className="h-4 w-20 bg-bg-muted rounded" />
      </div>
    </div>
  )
}
