'use client'

import { useEffect, useRef } from 'react'
import { useCart } from '@/lib/cart'
import { formatPrice } from '@/lib/commerce'
import { CartLineItem } from './cart-line-item'
import { Button, Text } from '@/components/primitives'
import { cn } from '@/lib/utils/cn'

export function CartDrawer() {
  const { cart, isOpen, isLoading, error, closeCart } = useCart()
  const drawerRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeCart])

  const isEmpty = !cart || cart.lines.length === 0

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 bg-bg-inverse/40 z-50 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeCart}
        aria-hidden="true"
      />

      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={cn(
          'fixed top-0 right-0 h-full w-full max-w-md border-l border-border/70 bg-bg z-50 shadow-[0_30px_80px_rgba(12,10,9,0.14)]',
          'flex flex-col',
          'transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-border">
          <h2 className="text-sm uppercase tracking-wider text-text-muted">
            Cart
            {cart && cart.totalQuantity > 0 && (
              <span className="ml-1">({cart.totalQuantity})</span>
            )}
          </h2>
          <button
            ref={closeButtonRef}
            onClick={closeCart}
            className="ui-icon-button rounded-full p-2 -mr-2 text-text-secondary hover:text-text transition-colors"
            aria-label="Close cart"
            data-cursor-label="Close"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <line x1="4" y1="4" x2="16" y2="16" />
              <line x1="16" y1="4" x2="4" y2="16" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="px-5 py-3 bg-red-50 border-b border-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-5 py-16">
              <div className="w-14 h-14 mb-5 rounded-full bg-bg-muted flex items-center justify-center">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-text-muted"
                >
                  <path d="M5 5h14l-1.5 9H6.5z" />
                  <circle cx="8" cy="19" r="1" />
                  <circle cx="17" cy="19" r="1" />
                  <path d="M5 5L4 2H1" />
                </svg>
              </div>
              <Text color="secondary" size="sm" className="mb-5">
                Your cart is empty
              </Text>
              <Button variant="secondary" size="sm" onClick={closeCart}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {cart.lines.map((line) => (
                <CartLineItem key={line.id} line={line} />
              ))}
            </div>
          )}
        </div>

        {!isEmpty && (
          <div className="border-t border-border px-5 py-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-text-secondary">Subtotal</span>
              <span className="text-base font-medium">
                {formatPrice(cart.subtotal)}
              </span>
            </div>

            <Text size="sm" color="muted" className="mb-4">
              Shipping and taxes calculated at checkout.
            </Text>

            <a
              href={cart.checkoutUrl}
              className={cn(
                'ui-press flex h-12 w-full items-center justify-center rounded-full',
                'text-sm font-medium',
                'bg-accent text-text-inverse',
                'hover:bg-accent-hover transition-colors',
                isLoading && 'opacity-50 pointer-events-none'
              )}
              data-cursor-label="Checkout"
            >
              {isLoading ? 'Updating...' : 'Checkout'}
            </a>
          </div>
        )}
      </div>
    </>
  )
}
