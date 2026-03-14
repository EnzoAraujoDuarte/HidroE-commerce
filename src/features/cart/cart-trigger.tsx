'use client'

import { useEffect, useRef } from 'react'
import { useCart } from '@/lib/cart'
import { DURATION, EASE, gsap, prefersReducedMotion } from '@/lib/motion/gsap'
import { cn } from '@/lib/utils/cn'

export function CartTrigger() {
  const { cart, toggleCart, isOpen } = useCart()
  const itemCount = cart?.totalQuantity ?? 0
  const badgeRef = useRef<HTMLSpanElement>(null)
  const previousCountRef = useRef(itemCount)

  useEffect(() => {
    if (
      prefersReducedMotion() ||
      !badgeRef.current ||
      itemCount === 0 ||
      itemCount === previousCountRef.current
    ) {
      previousCountRef.current = itemCount
      return
    }

    gsap.fromTo(
      badgeRef.current,
      { scale: 0.76, y: -3 },
      {
        scale: 1,
        y: 0,
        duration: DURATION.fast,
        ease: EASE.editorial,
      }
    )

    previousCountRef.current = itemCount
  }, [itemCount])

  return (
    <button
      onClick={toggleCart}
      className="ui-icon-button relative rounded-full p-2 text-current"
      aria-label={`Open cart, ${itemCount} items`}
      aria-expanded={isOpen}
      data-cursor-label="Cart"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 5h13l-1.25 7.5H6.25z" />
        <circle cx="7.5" cy="16.5" r="1" />
        <circle cx="15" cy="16.5" r="1" />
        <path d="M5 5L4.25 2.5H2" />
      </svg>

      {itemCount > 0 && (
        <span
          ref={badgeRef}
          className={cn(
            'absolute top-0 right-0 min-w-[18px] h-[18px] px-1',
            'flex items-center justify-center',
            'text-[10px] font-medium leading-none',
            'rounded-full bg-accent text-text-inverse shadow-[0_10px_18px_rgba(12,10,9,0.16)]'
          )}
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  )
}
