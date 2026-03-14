'use client'

import { useMemo, useRef } from 'react'
import Image from 'next/image'
import { Container, Eyebrow, Heading, Section, Text } from '@/components/primitives'
import { DURATION, EASE, MEDIA, gsap } from '@/lib/motion/gsap'
import { useScrollScene } from '@/lib/motion/use-scroll-scene'
import type { ProductDetail } from '@/lib/commerce'

interface ProductMaterialStoryProps {
  product: ProductDetail
}

export function ProductMaterialStory({ product }: ProductMaterialStoryProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const media = useMemo(() => {
    if (product.images.length > 1) {
      return product.images.slice(0, 2)
    }

    return product.images.length
      ? [product.images[0], product.images[0]]
      : []
  }, [product.images])

  useScrollScene(sectionRef, ({ mm }) => {
    gsap.fromTo(
      '[data-material-reveal]',
      { y: 36, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: DURATION.editorial,
        ease: EASE.editorial,
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
          once: true,
        },
      }
    )

    mm.add(MEDIA.desktop, () => {
      gsap.utils.toArray<HTMLElement>('[data-material-media]').forEach((item) => {
        gsap.fromTo(
          item,
          { y: 60, scale: 1.05 },
          {
            y: -28,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.55,
            },
          }
        )
      })
    })
  })

  if (!product.materialProfile || media.length === 0) {
    return null
  }

  return (
    <Section ref={sectionRef} spacing="xl" className="border-t border-border/70 bg-bg-muted/50">
      <Container size="wide">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow data-material-reveal className="mb-5">
              Material Focus
            </Eyebrow>
            <Heading as="h2" size="xl" data-material-reveal className="max-w-md">
              Materiality, made explicit.
            </Heading>
            <Text
              size="lg"
              color="secondary"
              data-material-reveal
              className="mt-6 max-w-md"
            >
              {product.materialProfile.notes[0] ??
                'Store description and product tags are surfaced here to make fabrication easier to read before purchase.'}
            </Text>

            {product.materialProfile.composition.length > 0 && (
              <div
                data-material-reveal
                className="mt-8 flex flex-wrap gap-2 border-t border-border/80 pt-6"
              >
                {product.materialProfile.composition.map((entry) => (
                  <span
                    key={entry}
                    className="inline-flex items-center rounded-full border border-border bg-bg px-3 py-1.5 text-xs text-text-secondary"
                  >
                    {entry}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div
              data-material-media
              className="relative aspect-[4/5] overflow-hidden bg-bg md:row-span-2"
            >
              <Image
                src={media[0].url}
                alt={media[0].altText || product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 42vw"
              />
            </div>

            <div
              data-material-reveal
              className="flex flex-col justify-between border border-border/80 bg-bg px-6 py-6"
            >
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-text-muted">
                  Composition
                </p>
                <Heading as="h3" size="sm" className="mt-4 max-w-xs">
                  {product.materialProfile.composition[0] ?? 'Store-sourced notes'}
                </Heading>
              </div>
              <Text color="secondary" className="mt-5">
                {product.materialProfile.notes[1] ??
                  'The product copy now feeds a dedicated material layer instead of disappearing inside generic accordion text.'}
              </Text>
            </div>

            <div
              data-material-media
              className="relative aspect-[4/3] overflow-hidden bg-bg"
            >
              <Image
                src={media[1].url}
                alt={media[1].altText || product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
