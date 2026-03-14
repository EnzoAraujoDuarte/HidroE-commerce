import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export const DURATION = {
  instant: 0.12,
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  editorial: 0.7,
  storytelling: 1.0,
} as const

export const EASE = {
  out: 'power2.out',
  inOut: 'power2.inOut',
  editorial: 'expo.out',
  smooth: 'power3.out',
} as const

export const MEDIA = {
  desktop: '(min-width: 769px)',
  mobile: '(max-width: 768px)',
  reduce: '(prefers-reduced-motion: reduce)',
} as const

export const revealFromBottom = {
  y: 40,
  opacity: 0,
  duration: DURATION.editorial,
  ease: EASE.editorial,
}

export const revealFromLeft = {
  x: -40,
  opacity: 0,
  duration: DURATION.editorial,
  ease: EASE.editorial,
}

export const fadeIn = {
  opacity: 0,
  duration: DURATION.slow,
  ease: EASE.out,
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 768px)').matches
}

export function createMediaMatcher() {
  return gsap.matchMedia()
}

export function createScrollReveal(
  element: Element | null,
  options?: {
    y?: number
    duration?: number
    delay?: number
    start?: string
  }
) {
  if (!element || prefersReducedMotion()) return

  const { y = 40, duration = DURATION.editorial, delay = 0, start = 'top 80%' } = options || {}

  gsap.fromTo(
    element,
    { y, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration,
      delay,
      ease: EASE.editorial,
      scrollTrigger: {
        trigger: element,
        start,
        once: true,
      },
    }
  )
}

export function createParallax(
  element: Element | null,
  options?: {
    y?: number
    speed?: number
  }
) {
  if (!element || prefersReducedMotion() || isMobile()) return

  const { y = -60, speed = 1 } = options || {}

  gsap.to(element, {
    y: y * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  })
}

export { gsap, ScrollTrigger }
