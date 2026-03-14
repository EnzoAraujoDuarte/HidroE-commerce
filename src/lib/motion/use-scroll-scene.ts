'use client'

import { useEffect, useRef, type RefObject } from 'react'
import { createMediaMatcher, gsap, prefersReducedMotion } from './gsap'

type MatchMediaContext = ReturnType<typeof createMediaMatcher>

export function useScrollScene<T extends Element>(
  scope: RefObject<T | null>,
  setup: (context: { mm: MatchMediaContext }) => void | (() => void)
) {
  const setupRef = useRef(setup)
  setupRef.current = setup

  useEffect(() => {
    const element = scope.current

    if (!element || prefersReducedMotion()) {
      return
    }

    const ctx = gsap.context(() => {
      const mm = createMediaMatcher()
      const cleanup = setupRef.current({ mm })

      return () => {
        cleanup?.()
        mm.revert()
      }
    }, element)

    return () => ctx.revert()
  }, [scope])
}
