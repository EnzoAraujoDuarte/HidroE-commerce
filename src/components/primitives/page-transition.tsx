'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, DURATION, EASE } from '@/lib/motion/gsap'

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) return

    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: DURATION.slow, ease: EASE.out }
    )
  }, [])

  return <div ref={ref}>{children}</div>
}
