import { cn } from '@/lib/utils/cn'
import { ProductCard } from './product-card'
import type { ProductCard as ProductCardType } from '@/lib/commerce'

interface ProductGridProps {
  products: ProductCardType[]
  className?: string
}

export function ProductGrid({ products, className }: ProductGridProps) {
  return (
    <div
      className={cn(
        'grid gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12',
        'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
        className
      )}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < 4}
        />
      ))}
    </div>
  )
}
