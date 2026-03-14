'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { formatPrice, type ProductCard as ProductCardType } from '@/lib/commerce'
import { Text } from '@/components/primitives'

interface ProductCardProps {
  product: ProductCardType
  priority?: boolean
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const hasHoverImage = !!product.hoverImage
  const hasDiscount = !!product.compareAtPrice

  return (
    <Link
      href={`/product/${product.handle}`}
      className="group ui-card block"
      data-product-card
      data-cursor="card"
    >
      <div
        className="relative mb-4 aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-bg-muted"
        data-transition-image
        data-transition-src={product.image.url}
      >
        <Image
          src={product.image.url}
          alt={product.image.altText || product.title}
          fill
          priority={priority}
          className={cn(
            'object-cover transition-all duration-500 ease-out',
            hasHoverImage && 'group-hover:scale-[1.04] group-hover:opacity-0'
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {hasHoverImage && (
          <Image
            src={product.hoverImage!.url}
            alt={product.hoverImage!.altText || product.title}
            fill
            className={cn(
              'object-cover transition-all duration-500 ease-out',
              'scale-[1.02] opacity-0 group-hover:scale-100 group-hover:opacity-100'
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}

        {!product.availableForSale && (
          <div className="absolute inset-0 bg-bg/60 flex items-center justify-center">
            <span className="text-sm font-medium tracking-wide text-text">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        {product.vendor && (
          <Text
            as="span"
            size="sm"
            color="muted"
            className="block tracking-wide uppercase text-xs"
          >
            {product.vendor}
          </Text>
        )}

        <h3
          className={cn(
            'text-sm font-normal text-text leading-snug',
            'transition-colors duration-200',
            'group-hover:text-text-secondary'
          )}
        >
          {product.title}
        </h3>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-sm',
              hasDiscount ? 'text-text' : 'text-text-secondary'
            )}
          >
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-text-muted line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
