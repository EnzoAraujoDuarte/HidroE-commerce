'use client'

import { useState, useEffect, useRef } from 'react'
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
  const mainImageRef = useRef<HTMLDivElement>(null)

  const allImages = selectedVariantImage
    ? [selectedVariantImage, ...images.filter((img) => img.url !== selectedVariantImage.url)]
    : images

  const currentImage = allImages[selectedIndex] || allImages[0]
  const viewerItems: EditorialMediaItem[] = allImages.map((image, index) => ({
    src: image.url,
    alt: image.altText || '',
    eyebrow: 'Product View',
    title: `Frame ${String(index + 1).padStart(2, '0')}`,
    caption: image.altText || 'Editorial full-screen product study.',
  }))

  useEffect(() => {
    if (selectedVariantImage) {
      setSelectedIndex(0)
    }
  }, [selectedVariantImage])

  const handleThumbnailClick = (index: number) => {
    if (index === selectedIndex) return

    gsap.to(mainImageRef.current, {
      opacity: 0,
      duration: DURATION.fast,
      ease: EASE.out,
      onComplete: () => {
        setSelectedIndex(index)
        gsap.to(mainImageRef.current, {
          opacity: 1,
          duration: DURATION.normal,
          ease: EASE.out,
        })
      },
    })
  }

  const openViewer = (index: number, element: HTMLElement | null) => {
    const rect = element?.getBoundingClientRect()

    setViewerIndex(index)
    setViewerOriginRect(
      rect
        ? {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          }
        : null
    )
  }

  return (
    <>
      <div className="flex flex-col-reverse gap-4 lg:flex-row">
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto lg:max-h-[600px] lg:flex-col lg:overflow-y-auto">
          {allImages.map((image, index) => (
            <button
              key={image.url}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                'ui-thumbnail relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-[1.5rem] border lg:h-24 lg:w-20',
                'transition-all duration-300',
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
          <Image
            src={currentImage.url}
            alt={currentImage.altText || ''}
            fill
            priority
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
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
