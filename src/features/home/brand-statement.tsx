'use client'

import { useRef } from 'react'
import { Container, Section, Heading, Text } from '@/components/primitives'
import { DURATION, EASE, gsap } from '@/lib/motion/gsap'
import { useScrollScene } from '@/lib/motion/use-scroll-scene'

export function BrandStatement() {
  const sectionRef = useRef<HTMLElement>(null)

  useScrollScene(sectionRef, () => {
    gsap.fromTo(
      '[data-brand-reveal]',
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: DURATION.editorial,
        ease: EASE.editorial,
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          once: true,
        },
      }
    )
  })

  return (
    <Section
      ref={sectionRef}
      spacing="xl"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#f4f0e8_0%,#efe9de_100%)]"
    >
      <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(214,202,186,0.55),transparent_68%)]" />
      <Container size="narrow" className="relative text-center">
        <Text
          data-brand-reveal
          size="sm"
          color="muted"
          className="uppercase tracking-widest mb-8"
        >
          Our Philosophy
        </Text>
        <Heading
          as="h2"
          size="xl"
          data-brand-reveal
          className="mb-8 leading-tight"
        >
          Where contemporary design meets timeless craft
        </Heading>
        <Text
          data-brand-reveal
          size="lg"
          color="secondary"
          className="max-w-lg mx-auto"
        >
          Each piece is considered. Every detail intentional. We create for those
          who appreciate the quiet confidence of well-made clothes.
        </Text>
      </Container>
    </Section>
  )
}
