'use client'

import { useEffect, useRef, useState } from 'react'
import { EASE, gsap, prefersReducedMotion } from './gsap'

type CursorMode = 'default' | 'interactive' | 'media'

interface CursorIntent {
  hidden: boolean
  mode: CursorMode
  label: string
}

const POINTER_QUERY = '(hover: hover) and (pointer: fine)'
const INTERACTIVE_SELECTOR =
  '[data-cursor], a[href], button:not([disabled]), [role="button"], summary'
const IGNORE_SELECTOR =
  'input, textarea, select, option, [contenteditable="true"], [data-cursor="hidden"]'

function resolveIntent(target: EventTarget | null): CursorIntent {
  const element = target instanceof Element
    ? target.closest<HTMLElement>(INTERACTIVE_SELECTOR)
    : null

  if (!element) {
    return { hidden: false, mode: 'default', label: '' }
  }

  if (element.matches(IGNORE_SELECTOR) || element.closest(IGNORE_SELECTOR)) {
    return { hidden: true, mode: 'default', label: '' }
  }

  const declaredMode = element.dataset.cursor
  const mode: CursorMode =
    declaredMode === 'media' || declaredMode === 'card' ? 'media' : 'interactive'

  const label =
    element.dataset.cursorLabel ??
    (declaredMode === 'card' ? 'Open' : declaredMode === 'media' ? 'View' : '')

  return { hidden: false, mode, label }
}

export function CursorSystem() {
  const rootRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const visibleRef = useRef(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || prefersReducedMotion()) {
      return
    }

    const media = window.matchMedia(POINTER_QUERY)
    const update = () => setEnabled(media.matches)

    update()
    media.addEventListener('change', update)

    return () => {
      media.removeEventListener('change', update)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [])

  useEffect(() => {
    const root = rootRef.current
    const ring = ringRef.current
    const dot = dotRef.current
    const bubble = bubbleRef.current
    const label = labelRef.current

    if (!enabled || !root || !ring || !dot || !bubble || !label) {
      document.documentElement.classList.remove('has-custom-cursor')
      return
    }

    gsap.set(root, { xPercent: 0, yPercent: 0, autoAlpha: 0, scale: 1 })
    gsap.set([ring, dot], { xPercent: -50, yPercent: -50, transformOrigin: 'center center' })
    gsap.set(ring, { scale: 1, opacity: 0.42 })
    gsap.set(dot, { scale: 1, opacity: 0.9 })
    gsap.set(bubble, { autoAlpha: 0, scale: 0.86, x: 12, y: -14 })

    const moveX = gsap.quickTo(root, 'x', {
      duration: 0.2,
      ease: EASE.smooth,
    })
    const moveY = gsap.quickTo(root, 'y', {
      duration: 0.2,
      ease: EASE.smooth,
    })

    const applyIntent = (intent: CursorIntent) => {
      if (intent.hidden) {
        gsap.to(root, {
          autoAlpha: 0,
          duration: 0.16,
          ease: EASE.out,
        })
        visibleRef.current = false
        return
      }

      if (!visibleRef.current) {
        document.documentElement.classList.add('has-custom-cursor')
        gsap.to(root, {
          autoAlpha: 1,
          duration: 0.18,
          ease: EASE.out,
        })
        visibleRef.current = true
      }

      const showBubble = intent.label.length > 0

      if (label.textContent !== intent.label) {
        label.textContent = intent.label
      }

      gsap.to(ring, {
        scale: intent.mode === 'media' ? 1.9 : intent.mode === 'interactive' ? 1.28 : 1,
        opacity: intent.mode === 'media' ? 0.24 : intent.mode === 'interactive' ? 0.56 : 0.42,
        duration: 0.24,
        ease: EASE.smooth,
      })

      gsap.to(dot, {
        scale: intent.mode === 'media' ? 0.16 : intent.mode === 'interactive' ? 1.18 : 1,
        opacity: intent.mode === 'media' ? 0 : 0.9,
        duration: 0.2,
        ease: EASE.smooth,
      })

      gsap.to(bubble, {
        autoAlpha: showBubble ? 1 : 0,
        scale: showBubble ? 1 : 0.86,
        x: showBubble ? 18 : 12,
        y: showBubble ? -20 : -14,
        duration: 0.24,
        ease: EASE.smooth,
      })
    }

    const showDefault = () => {
      applyIntent({ hidden: false, mode: 'default', label: '' })
    }

    const handlePointerMove = (event: PointerEvent) => {
      moveX(event.clientX)
      moveY(event.clientY)

      if (!visibleRef.current) {
        document.documentElement.classList.add('has-custom-cursor')
        gsap.to(root, {
          autoAlpha: 1,
          duration: 0.18,
          ease: EASE.out,
        })
        visibleRef.current = true
      }
    }

    const handlePointerOver = (event: PointerEvent) => {
      applyIntent(resolveIntent(event.target))
    }

    const handlePointerDown = () => {
      gsap.to(root, {
        scale: 0.92,
        duration: 0.12,
        ease: EASE.out,
      })
    }

    const handlePointerUp = () => {
      gsap.to(root, {
        scale: 1,
        duration: 0.18,
        ease: EASE.smooth,
      })
    }

    const handlePointerLeave = () => {
      visibleRef.current = false
      document.documentElement.classList.remove('has-custom-cursor')
      gsap.to(root, {
        autoAlpha: 0,
        duration: 0.16,
        ease: EASE.out,
      })
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.addEventListener('pointerover', handlePointerOver)
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)
    document.documentElement.addEventListener('mouseleave', handlePointerLeave)
    window.addEventListener('blur', handlePointerLeave)

    showDefault()

    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerover', handlePointerOver)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
      document.documentElement.removeEventListener('mouseleave', handlePointerLeave)
      window.removeEventListener('blur', handlePointerLeave)
    }
  }, [enabled])

  if (!enabled) {
    return null
  }

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed left-0 top-0 z-[110]"
      aria-hidden="true"
    >
      <div
        ref={ringRef}
        className="absolute left-0 top-0 h-7 w-7 rounded-full border border-[rgba(12,10,9,0.18)] bg-[rgba(250,250,249,0.24)] shadow-[0_10px_28px_rgba(12,10,9,0.08)] backdrop-blur-[10px]"
      />
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-2.5 w-2.5 rounded-full bg-[rgba(12,10,9,0.88)]"
      />
      <div
        ref={bubbleRef}
        className="absolute left-4 top-[-1.4rem] rounded-full border border-[rgba(12,10,9,0.08)] bg-[rgba(250,250,249,0.88)] px-3 py-1.5 shadow-[0_18px_42px_rgba(12,10,9,0.12)] backdrop-blur-[16px]"
      >
        <span
          ref={labelRef}
          className="block whitespace-nowrap text-[9px] uppercase tracking-[0.28em] text-text"
        />
      </div>
    </div>
  )
}
