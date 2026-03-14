'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { EASE, gsap, prefersReducedMotion } from './gsap'

interface RouteTransitionProviderProps {
  children: React.ReactNode
}

interface VisualSnapshot {
  href: string
  imageSrc: string
  sourceRect: {
    top: number
    left: number
    width: number
    height: number
  }
}

function isModifiedEvent(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
}

function getHref(anchor: HTMLAnchorElement) {
  const url = new URL(anchor.href, window.location.href)

  if (url.origin !== window.location.origin) {
    return null
  }

  return `${url.pathname}${url.search}${url.hash}`
}

function captureVisualSnapshot(
  trigger: HTMLElement | null,
  href: string
): VisualSnapshot | null {
  if (!trigger || !href.startsWith('/product/')) {
    return null
  }

  const card = trigger.closest('[data-product-card]') as HTMLElement | null
  const image = card?.querySelector('[data-transition-image]') as HTMLElement | null

  if (!image) {
    return null
  }

  const rect = image.getBoundingClientRect()
  const imageSrc = image.getAttribute('data-transition-src')

  if (!imageSrc || rect.width === 0 || rect.height === 0) {
    return null
  }

  return {
    href,
    imageSrc,
    sourceRect: {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    },
  }
}

export function RouteTransitionProvider({
  children,
}: RouteTransitionProviderProps) {
  const router = useRouter()
  const pathname = usePathname() ?? ''
  const shellRef = useRef<HTMLDivElement>(null)
  const veilRef = useRef<HTMLDivElement>(null)
  const accentRef = useRef<HTMLDivElement>(null)
  const snapshotRef = useRef<HTMLDivElement>(null)
  const transitionStateRef = useRef<{
    href: string
    visual: VisualSnapshot | null
    pushTimeout: number | null
  } | null>(null)
  const previousPathnameRef = useRef(pathname)
  const isTransitioningRef = useRef(false)
  const [snapshotSrc, setSnapshotSrc] = useState<string | null>(null)

  useEffect(() => {
    if (prefersReducedMotion()) {
      return
    }

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || isModifiedEvent(event)) {
        return
      }

      const trigger = event.target as HTMLElement | null
      const anchor = trigger?.closest('a[href]') as HTMLAnchorElement | null

      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) {
        return
      }

      if (anchor.dataset.transition === 'false' || isTransitioningRef.current) {
        return
      }

      const href = getHref(anchor)

      if (!href || href === `${window.location.pathname}${window.location.search}${window.location.hash}`) {
        return
      }

      const isSamePageHash =
        anchor.hash &&
        anchor.pathname === window.location.pathname &&
        anchor.search === window.location.search

      if (isSamePageHash) {
        return
      }

      event.preventDefault()

      const shell = shellRef.current
      const veil = veilRef.current
      const accent = accentRef.current
      const snapshot = snapshotRef.current
      const visual = captureVisualSnapshot(trigger, href)

      transitionStateRef.current = {
        href,
        visual,
        pushTimeout: null,
      }

      isTransitioningRef.current = true
      setSnapshotSrc(visual?.imageSrc ?? null)

      if (visual && snapshot) {
        gsap.set(snapshot, {
          opacity: 1,
          x: visual.sourceRect.left,
          y: visual.sourceRect.top,
          width: visual.sourceRect.width,
          height: visual.sourceRect.height,
        })
      }

      gsap.killTweensOf([shell, veil, accent, snapshot])

      const tl = gsap.timeline()

      if (veil) {
        tl.to(
          veil,
          {
            opacity: 0.14,
            duration: 0.18,
            ease: EASE.out,
          },
          0
        )
      }

      if (accent) {
        tl.fromTo(
          accent,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 0.26,
            ease: EASE.smooth,
          },
          0
        )
      }

      if (shell) {
        tl.to(
          shell,
          {
            opacity: 0.32,
            y: 18,
            filter: 'blur(10px)',
            duration: 0.24,
            ease: EASE.smooth,
          },
          0
        )
      }

      if (visual && snapshot) {
        tl.to(
          snapshot,
          {
            y: visual.sourceRect.top - 18,
            scale: 1.02,
            duration: 0.24,
            ease: EASE.smooth,
          },
          0
        )
      }

      transitionStateRef.current.pushTimeout = window.setTimeout(() => {
        router.push(href)
      }, 170)
    }

    document.addEventListener('click', handleClick, true)

    return () => {
      document.removeEventListener('click', handleClick, true)
    }
  }, [router])

  useEffect(() => {
    if (prefersReducedMotion()) {
      previousPathnameRef.current = pathname
      return
    }

    if (previousPathnameRef.current === pathname) {
      return
    }

    previousPathnameRef.current = pathname

    const shell = shellRef.current
    const veil = veilRef.current
    const accent = accentRef.current
    const snapshot = snapshotRef.current
    const transition = transitionStateRef.current
    const visualTarget = transition?.visual?.href === pathname
      ? document.querySelector<HTMLElement>(
          `[data-route-visual-target="${pathname}"]`
        )
      : null

    gsap.killTweensOf([shell, veil, accent, snapshot, visualTarget])

    const tl = gsap.timeline({
      onComplete: () => {
        if (visualTarget) {
          gsap.set(visualTarget, { clearProps: 'opacity' })
        }

        if (shell) {
          gsap.set(shell, { clearProps: 'opacity,transform,filter' })
        }

        if (veil) {
          gsap.set(veil, { opacity: 0 })
        }

        if (accent) {
          gsap.set(accent, { clearProps: 'transform' })
        }

        if (snapshot) {
          gsap.set(snapshot, { opacity: 0, clearProps: 'transform,width,height' })
        }

        if (transition?.pushTimeout) {
          window.clearTimeout(transition.pushTimeout)
        }

        transitionStateRef.current = null
        isTransitioningRef.current = false
        setSnapshotSrc(null)
      },
    })

    if (shell) {
      tl.fromTo(
        shell,
        { opacity: 0, y: 28, filter: 'blur(12px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.42,
          ease: EASE.editorial,
        },
        0.08
      )
    }

    if (veil) {
      tl.to(
        veil,
        {
          opacity: 0,
          duration: 0.28,
          ease: EASE.out,
        },
        0.08
      )
    }

    if (accent) {
      tl.to(
        accent,
        {
          scaleX: 0,
          transformOrigin: 'right center',
          duration: 0.28,
          ease: EASE.smooth,
        },
        0.06
      )
    }

    if (snapshot && transition?.visual && snapshotSrc) {
      if (visualTarget) {
        const rect = visualTarget.getBoundingClientRect()
        gsap.set(visualTarget, { opacity: 0 })

        tl.to(
          snapshot,
          {
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
            duration: 0.48,
            ease: EASE.editorial,
          },
          0
        )
          .to(
            visualTarget,
            {
              opacity: 1,
              duration: 0.18,
              ease: EASE.out,
            },
            0.28
          )
          .to(
            snapshot,
            {
              opacity: 0,
              duration: 0.16,
              ease: EASE.out,
            },
            0.32
          )
      } else {
        tl.to(
          snapshot,
          {
            opacity: 0,
            y: '-=20',
            duration: 0.18,
            ease: EASE.out,
          },
          0.08
        )
      }
    }
  }, [pathname, snapshotSrc])

  return (
    <>
      <div
        ref={veilRef}
        className="pointer-events-none fixed inset-0 z-[70] opacity-0"
        style={{
          background:
            'radial-gradient(circle at top, rgba(12, 10, 9, 0.08), rgba(12, 10, 9, 0.02) 42%, rgba(12, 10, 9, 0))',
        }}
      />

      <div
        ref={accentRef}
        className="pointer-events-none fixed inset-x-0 top-0 z-[71] h-px scale-x-0 bg-[linear-gradient(90deg,rgba(12,10,9,0),rgba(12,10,9,0.85),rgba(12,10,9,0))]"
      />

      {snapshotSrc && (
        <div
          ref={snapshotRef}
          className="pointer-events-none fixed left-0 top-0 z-[72] overflow-hidden opacity-0"
          style={{
            backgroundImage: `url(${snapshotSrc})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        />
      )}

      <div ref={shellRef} data-route-shell>
        {children}
      </div>
    </>
  )
}
