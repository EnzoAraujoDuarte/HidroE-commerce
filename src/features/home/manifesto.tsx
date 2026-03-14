'use client'

import { useRef } from 'react'
import { Container, Section, Text } from '@/components/primitives'
import { manifestoData } from '@/lib/data/mock-data'
import { DURATION, EASE, gsap } from '@/lib/motion/gsap'
import { useScrollScene } from '@/lib/motion/use-scroll-scene'

export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null)
  const quoteRef = useRef<HTMLQuoteElement>(null)

  useScrollScene(sectionRef, () => {
      gsap.fromTo(
        quoteRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: EASE.editorial,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            once: true,
          },
        }
      )

      gsap.fromTo(
        '[data-attribution]',
        { opacity: 0 },
        {
          opacity: 1,
          duration: DURATION.slow,
          ease: EASE.out,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 50%',
            once: true,
          },
        }
      )
  })

  return (
    <Section ref={sectionRef} spacing="xl" className="bg-bg-inverse">
      <Container size="narrow" className="text-center">
        <blockquote ref={quoteRef} className="mb-8">
          <p className="text-display text-2xl md:text-3xl lg:text-4xl text-text-inverse leading-snug">
            &ldquo;{manifestoData.quote}&rdquo;
          </p>
        </blockquote>

        <Text
          data-attribution
          size="sm"
          className="text-text-inverse/50 uppercase tracking-wider"
        >
          {manifestoData.attribution}
        </Text>
      </Container>
    </Section>
  )
}
