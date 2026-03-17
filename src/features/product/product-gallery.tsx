'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { gsap, DURATION, EASE } from '@/lib/motion/gsap'
import {
  EditorialMediaViewer,
  type EditorialMediaItem,
  type ViewerOriginRect,
} from '@/components/primitives'
import { cn } from '@/lib/utils/cn'
import type { ProductImage } from '@/lib/commerce'

interface ProductGalleryProps {
  images: ProductImage[]
  selectedVariantImage?: ProductImage
  transitionKey?: string
}

export function ProductGallery({
  images,
  selectedVariantImage,
  transitionKey,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  const [viewerOriginRect, setViewerOriginRect] = useState<ViewerOriginRect | null>(null)
  const [imageKey, setImageKey] = useState(0) // increment to trigger fade-in CSS
  const mainImageRef = useRef<HTMLDivElement>(null)

  const allImages = selectedVariantImage
    ? [selectedVariantImage, ...images.filter((img) => img.url !== selectedVariantImage.url)]
    : images

  const currentImage = allImages[selectedIndex] ?? allImages[0]

  const viewerItems: EditorialMediaItem[] = allImages.map((image, index) => ({
    src: image.url,
    alt: image.altText || '',
    eyebrow: 'Product View',
    title: `Frame ${String(index + 1).padStart(2, '0')}`,
    caption: image.altText || 'Editorial full-screen product study.',
  }))

  // When variant image changes: reset to first frame, trigger a gentle fade-in
  useEffect(() => {
    if (selectedVariantImage) {
      setSelectedIndex(0)
      setImageKey((k) => k + 1)
    }
  }, [selectedVariantImage?.url]) // eslint-disable-line react-hooks/exhaustive-deps

  // Thumbnail click: immediate swap + subtle brightness flash (no blank frame)
  const handleThumbnailClick = useCallback(
    (index: number) => {
      if (index === selectedIndex) return
      setSelectedIndex(index)
      setImageKey((k) => k + 1)

      // Subtle scale-punch on the wrapper so the switch feels snappy
      if (mainImageRef.current) {
        gsap.fromTo(
          mainImageRef.current,
          { opacity: 0.8 },
          { opacity: 1, duration: DURATION.instant, ease: EASE.out }
        )
      }
    },
    [selectedIndex]
  )

  const openViewer = (index: number, element: HTMLElement | null) => {
    const rect = element?.getBoundingClientRect()
    setViewerIndex(index)
    setViewerOriginRect(
      rect
        ? { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
        : null
    )
  }

  return (
    <>
      <div className="flex flex-col-reverse gap-4 lg:flex-row">
        {allImages.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1 lg:max-h-[600px] lg:flex-col lg:overflow-y-auto lg:pb-0">
            {allImages.map((image, index) => (
              <button
                key={image.url}
                onClick={() => handleThumbnailClick(index)}
                className={cn(
                  'ui-thumbnail relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-[1.5rem] border lg:h-24 lg:w-20',
                  'transition-all duration-200',
                  index === selectedIndex
                    ? 'border-text opacity-100'
                    : 'border-transparent opacity-45 hover:opacity-75'
                )}
              >
                <Image
                  src={image.url}
                  alt={image.altText || ''}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
                {index === selectedIndex && (
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(12,10,9,0.12))]" />
                )}
              </button>
            ))}
          </div>
        )}

        <div
          ref={mainImageRef}
          className="relative flex-1 overflow-hidden bg-bg-muted"
          data-route-visual-target={transitionKey}
        >
          <button
            onClick={(event) => openViewer(selectedIndex, event.currentTarget)}
            className="group ui-card relative block aspect-[3/4] w-full overflow-hidden lg:aspect-[4/5]"
            aria-label="Open full-screen product media"
            data-cursor="media"
            data-cursor-label="View"
          >
            {/* key-based remount for immediate crossfade; CSS handles the fade-in */}
            <Image
              key={`${currentImage.url}-${imageKey}`}
              src={currentImage.url}
              alt={currentImage.altText || ''}
              fill
              priority
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] animate-[galleryCrossfade_0.18s_ease-out]"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,10,9,0)_0%,rgba(12,10,9,0.12)_100%)]" />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 md:p-5">
              <span className="rounded-full border border-text-inverse/18 bg-text-inverse/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.28em] text-text-inverse backdrop-blur-sm">
                {String(selectedIndex + 1).padStart(2, '0')} / {String(allImages.length).padStart(2, '0')}
              </span>
              <span className="rounded-full border border-text-inverse/18 bg-text-inverse/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.28em] text-text-inverse backdrop-blur-sm">
                Fullscreen
              </span>
            </div>
          </button>
        </div>
      </div>

      <EditorialMediaViewer
        open={viewerIndex !== null}
        items={viewerItems}
        activeIndex={viewerIndex ?? 0}
        originRect={viewerOriginRect}
        onIndexChange={setViewerIndex}
        onClose={() => {
          setViewerIndex(null)
          setViewerOriginRect(null)
        }}
      />
    </>
  )
}
