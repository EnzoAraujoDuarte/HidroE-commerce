'use client'

import { useRef } from 'react'
import { Container, Section, Eyebrow, Heading } from '@/components/primitives'
import { ProductGrid } from '@/components/commerce'
import { DURATION, EASE, gsap } from '@/lib/motion/gsap'
import { useScrollScene } from '@/lib/motion/use-scroll-scene'
import type { ProductCard } from '@/lib/commerce'

interface RelatedProductsProps {
  products: ProductCard[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useScrollScene(sectionRef, () => {
    gsap.fromTo(
      '[data-related-reveal]',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: DURATION.editorial,
        ease: EASE.editorial,
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      }
    )
  })

  if (products.length === 0) return null

  return (
    <Section ref={sectionRef} spacing="xl" className="bg-bg-muted">
      <Container size="wide">
        <div className="text-center mb-12" data-related-reveal>
          <Eyebrow className="mb-4">You may also like</Eyebrow>
          <Heading as="h2" size="lg">
            Related Products
          </Heading>
        </div>
        <div data-related-reveal>
          <ProductGrid products={products.slice(0, 4)} />
        </div>
      </Container>
    </Section>
  )
}
