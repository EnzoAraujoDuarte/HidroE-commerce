'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap'

interface LenisProviderProps {
  children: React.ReactNode
}

export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (prefersReducedMotion()) {
      return
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.1,
    })

    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const update = (time: number) => {
      lenis.raf(time * 1000)
    }

    const handleRefresh = () => {
      lenis.resize()
    }

    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    ScrollTrigger.addEventListener('refresh', handleRefresh)
    ScrollTrigger.refresh()

    return () => {
      ScrollTrigger.removeEventListener('refresh', handleRefresh)
      gsap.ticker.remove(update)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return <>{children}</>
}
