'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { DURATION, EASE, gsap, prefersReducedMotion } from '@/lib/motion/gsap'
import { cn } from '@/lib/utils/cn'

export interface EditorialMediaItem {
  src: string
  alt: string
  eyebrow?: string
  title?: string
  caption?: string
}

export interface ViewerOriginRect {
  top: number
  left: number
  width: number
  height: number
}

interface EditorialMediaViewerProps {
  open: boolean
  items: EditorialMediaItem[]
  activeIndex: number
  originRect?: ViewerOriginRect | null
  onIndexChange: (index: number) => void
  onClose: () => void
}

function clampIndex(index: number, length: number) {
  if (length === 0) {
    return 0
  }

  if (index < 0) {
    return length - 1
  }

  if (index >= length) {
    return 0
  }

  return index
}

function getViewportTarget() {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const horizontalInset = viewportWidth < 768 ? 18 : 80
  const verticalInset = viewportWidth < 768 ? 96 : 72
  const width = Math.min(viewportWidth - horizontalInset * 2, viewportWidth < 768 ? 520 : 1120)
  const height = Math.min(viewportHeight - verticalInset * 2, viewportHeight < 768 ? viewportHeight - 180 : viewportHeight - 144)

  return {
    left: (viewportWidth - width) / 2,
    top: (viewportHeight - height) / 2,
    width,
    height,
  }
}

export function EditorialMediaViewer({
  open,
  items,
  activeIndex,
  originRect,
  onIndexChange,
  onClose,
}: EditorialMediaViewerProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const snapshotRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const closeHandlerRef = useRef<() => void>(() => {})
  const closingRef = useRef(false)
  const [mounted, setMounted] = useState(false)

  const currentItem = items[activeIndex]
  const hasMultipleItems = items.length > 1

  useEffect(() => {
    if (!open) {
      return
    }

    setMounted(true)
  }, [open])

  useEffect(() => {
    if (!mounted || !open) {
      return
    }

    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = ''
    }
  }, [mounted, open])

  useEffect(() => {
    if (!mounted || !open || !currentItem) {
      return
    }

    if (prefersReducedMotion()) {
      gsap.set(overlayRef.current, { opacity: 1 })
      gsap.set(frameRef.current, { opacity: 1, y: 0, scale: 1 })
      gsap.set(snapshotRef.current, { opacity: 0 })
      return
    }

    const overlay = overlayRef.current
    const frame = frameRef.current
    const snapshot = snapshotRef.current
    const targetRect = getViewportTarget()

    const tl = gsap.timeline()

    tl.fromTo(
      overlay,
      { opacity: 0 },
      { opacity: 1, duration: DURATION.fast, ease: EASE.out },
      0
    )

    tl.fromTo(
      frame,
      { opacity: 0, y: 32, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: DURATION.editorial,
        ease: EASE.editorial,
      },
      0.06
    )

    if (originRect && snapshot) {
      gsap.set(snapshot, {
        opacity: 1,
        left: originRect.left,
        top: originRect.top,
        width: originRect.width,
        height: originRect.height,
      })

      tl.to(
        snapshot,
        {
          left: targetRect.left,
          top: targetRect.top,
          width: targetRect.width,
          height: targetRect.height,
          duration: DURATION.editorial,
          ease: EASE.editorial,
        },
        0
      ).to(
        snapshot,
        {
          opacity: 0,
          duration: DURATION.fast,
          ease: EASE.out,
        },
        0.28
      )
    }

    return () => {
      tl.kill()
    }
  }, [mounted, open, currentItem, originRect])

  useEffect(() => {
    if (!mounted || !open || !mediaRef.current) {
      return
    }

    if (prefersReducedMotion()) {
      return
    }

    gsap.fromTo(
      mediaRef.current,
      { opacity: 0.65, scale: 1.02 },
      {
        opacity: 1,
        scale: 1,
        duration: DURATION.normal,
        ease: EASE.out,
      }
    )
  }, [activeIndex, mounted, open])

  useEffect(() => {
    if (!mounted || !open) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeHandlerRef.current()
      }

      if (event.key === 'ArrowRight' && hasMultipleItems) {
        event.preventDefault()
        onIndexChange(clampIndex(activeIndex + 1, items.length))
      }

      if (event.key === 'ArrowLeft' && hasMultipleItems) {
        event.preventDefault()
        onIndexChange(clampIndex(activeIndex - 1, items.length))
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeIndex, hasMultipleItems, items.length, mounted, open, onIndexChange])

  function handleClose() {
    if (closingRef.current) {
      return
    }

    closingRef.current = true

    if (prefersReducedMotion()) {
      closingRef.current = false
      setMounted(false)
      onClose()
      return
    }

    const targetRect = originRect
    const tl = gsap.timeline({
      onComplete: () => {
        closingRef.current = false
        setMounted(false)
        onClose()
      },
    })

    tl.to(overlayRef.current, {
      opacity: 0,
      duration: DURATION.fast,
      ease: EASE.out,
    }, 0)

    tl.to(frameRef.current, {
      opacity: 0,
      y: 20,
      scale: 0.98,
      duration: DURATION.fast,
      ease: EASE.out,
    }, 0)

    if (targetRect && snapshotRef.current) {
      gsap.set(snapshotRef.current, {
        opacity: 0.9,
        left: getViewportTarget().left,
        top: getViewportTarget().top,
        width: getViewportTarget().width,
        height: getViewportTarget().height,
      })

      tl.to(snapshotRef.current, {
        opacity: 1,
        left: targetRect.left,
        top: targetRect.top,
        width: targetRect.width,
        height: targetRect.height,
        duration: DURATION.editorial,
        ease: EASE.editorial,
      }, 0)
    }
  }

  closeHandlerRef.current = handleClose

  if (!mounted || !open || !currentItem) {
    return null
  }

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[90] bg-[rgba(10,10,10,0.92)] text-text-inverse"
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={snapshotRef}
        className="pointer-events-none fixed z-[91] hidden overflow-hidden md:block"
        style={{
          backgroundImage: `url(${currentItem.src})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      />

      <div className="absolute inset-x-0 top-0 z-[92] flex items-start justify-between gap-6 px-4 pt-4 md:px-8 md:pt-7">
        <div className="max-w-md">
          <p className="text-[10px] uppercase tracking-[0.32em] text-text-inverse/45">
            {String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </p>
          {(currentItem.eyebrow || currentItem.title) && (
            <div className="mt-3">
              {currentItem.eyebrow && (
                <p className="text-[10px] uppercase tracking-[0.28em] text-text-inverse/42">
                  {currentItem.eyebrow}
                </p>
              )}
              {currentItem.title && (
                <p className="mt-1 text-sm text-text-inverse/82 md:text-base">
                  {currentItem.title}
                </p>
              )}
            </div>
          )}
        </div>

        <button
          ref={closeButtonRef}
          onClick={handleClose}
          className="ui-icon-button inline-flex h-11 w-11 items-center justify-center rounded-full border border-text-inverse/14 bg-text-inverse/6 text-text-inverse transition-colors duration-200 hover:bg-text-inverse/12"
          aria-label="Close media viewer"
          data-cursor-label="Close"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <line x1="4" y1="4" x2="14" y2="14" />
            <line x1="14" y1="4" x2="4" y2="14" />
          </svg>
        </button>
      </div>

      <div className="flex min-h-screen items-center justify-center px-4 pb-24 pt-24 md:px-8 md:pb-28 md:pt-28">
        <div
          ref={frameRef}
          className="relative w-full max-w-[1120px]"
        >
          <div
            ref={mediaRef}
            className="relative aspect-[4/5] w-full overflow-hidden bg-[#111] md:aspect-[16/10]"
          >
            <Image
              src={currentItem.src}
              alt={currentItem.alt}
              fill
              priority
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {currentItem.caption && (
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-text-inverse/62 md:text-base">
              {currentItem.caption}
            </p>
          )}
        </div>
      </div>

      {hasMultipleItems && (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between px-5 md:flex">
            <button
              onClick={() => onIndexChange(clampIndex(activeIndex - 1, items.length))}
              className="ui-icon-button pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-text-inverse/14 bg-text-inverse/6 text-text-inverse transition-colors duration-200 hover:bg-text-inverse/12"
              aria-label="Previous image"
              data-cursor-label="Prev"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => onIndexChange(clampIndex(activeIndex + 1, items.length))}
              className="ui-icon-button pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-text-inverse/14 bg-text-inverse/6 text-text-inverse transition-colors duration-200 hover:bg-text-inverse/12"
              aria-label="Next image"
              data-cursor-label="Next"
            >
              <ChevronRight />
            </button>
          </div>

          <div className="absolute inset-x-0 bottom-4 flex justify-center px-4 md:bottom-7">
            <div className="flex max-w-full gap-2 overflow-x-auto rounded-full border border-text-inverse/12 bg-text-inverse/6 px-3 py-3 backdrop-blur-sm">
              {items.map((item, index) => (
                <button
                  key={`${item.src}-${index}`}
                  onClick={() => onIndexChange(index)}
                  className={cn(
                    'ui-thumbnail relative h-14 w-11 flex-shrink-0 overflow-hidden rounded-[999px] border transition-all duration-300 md:h-16 md:w-12',
                    index === activeIndex
                      ? 'border-text-inverse/70 opacity-100'
                      : 'border-transparent opacity-45 hover:opacity-70'
                  )}
                  aria-label={`View image ${index + 1}`}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>,
    document.body
  )
}

function ChevronLeft() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4 6 9l5 5" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7 4 5 5-5 5" />
    </svg>
  )
}
