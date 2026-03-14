'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart'
import { Button } from '@/components/primitives'
import { cn } from '@/lib/utils/cn'

interface AddToCartButtonProps {
  variantId: string
  availableForSale: boolean
}

export function AddToCartButton({ variantId, availableForSale }: AddToCartButtonProps) {
  const { addItem, isLoading } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleClick = async () => {
    setIsAdding(true)
    await addItem(variantId)
    setIsAdding(false)
  }

  const showLoading = isAdding || isLoading

  if (!availableForSale) {
    return (
      <Button disabled size="lg" className="w-full opacity-50 cursor-not-allowed">
        Sold Out
      </Button>
    )
  }

  return (
    <Button
      onClick={handleClick}
      disabled={showLoading}
      size="lg"
      className={cn('w-full relative', showLoading && 'text-transparent')}
      data-cursor-label="Add"
      aria-busy={showLoading}
    >
      Add to Cart
      {showLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-text-inverse/30 border-t-text-inverse rounded-full animate-spin" />
        </div>
      )}
    </Button>
  )
}
