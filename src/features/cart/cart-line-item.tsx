'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/cart'
import { formatPrice, type CartLine } from '@/lib/commerce'
import { cn } from '@/lib/utils/cn'

interface CartLineItemProps {
  line: CartLine
}

export function CartLineItem({ line }: CartLineItemProps) {
  const { updateItem, removeItem, isLoading } = useCart()

  const handleQuantityChange = (delta: number) => {
    const newQuantity = line.quantity + delta
    if (newQuantity < 1) {
      removeItem(line.id)
    } else {
      updateItem(line.id, newQuantity)
    }
  }

  return (
    <div className="flex gap-4 px-5 py-5">
      <Link
        href={`/product/${line.product.handle}`}
        className="ui-thumbnail relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-[1.25rem] bg-bg-muted"
        data-cursor="card"
      >
        <Image
          src={line.product.image.url}
          alt={line.product.image.altText || line.product.title}
          fill
          className="object-cover"
          sizes="80px"
        />
      </Link>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/product/${line.product.handle}`}
            className="ui-link line-clamp-2 text-sm text-text transition-colors hover:text-text-secondary"
          >
            {line.product.title}
          </Link>
          <button
            onClick={() => removeItem(line.id)}
            disabled={isLoading}
            className="ui-icon-button flex-shrink-0 rounded-full p-1 -mr-1 text-text-muted hover:text-text transition-colors"
            aria-label="Remove item"
            data-cursor-label="Remove"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <line x1="3" y1="3" x2="11" y2="11" />
              <line x1="11" y1="3" x2="3" y2="11" />
            </svg>
          </button>
        </div>

        {line.variant.title !== 'Default Title' && (
          <p className="text-xs text-text-muted mt-1">
            {line.variant.selectedOptions.map((opt) => opt.value).join(' / ')}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3">
          <div className="flex h-8 items-center rounded-full border border-border">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={isLoading}
              className={cn(
                'ui-icon-button h-full w-8 flex items-center justify-center rounded-full text-sm text-text-secondary',
                'hover:text-text transition-colors',
                'disabled:opacity-40'
              )}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-8 h-full flex items-center justify-center text-sm border-x border-border">
              {line.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={isLoading}
              className={cn(
                'ui-icon-button h-full w-8 flex items-center justify-center rounded-full text-sm text-text-secondary',
                'hover:text-text transition-colors',
                'disabled:opacity-40'
              )}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <span className="text-sm">
            {formatPrice(line.totalPrice)}
          </span>
        </div>
      </div>
    </div>
  )
}
