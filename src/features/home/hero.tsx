'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { DURATION, EASE, MEDIA, gsap } from '@/lib/motion/gsap'
import { useScrollScene } from '@/lib/motion/use-scroll-scene'
import { Container, Eyebrow, Heading, Text, Button } from '@/components/primitives'
import { heroData } from '@/lib/data/mock-data'

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)

  useScrollScene(sectionRef, ({ mm }) => {
      const tl = gsap.timeline({ defaults: { ease: EASE.editorial } })
      const revealItems = contentRef.current?.querySelectorAll('[data-hero-reveal]')

      tl.fromTo(
        imageRef.current,
        { scale: 1.1, opacity: 0.2 },
        { scale: 1, opacity: 1, duration: 1.3 }
      )

      if (revealItems?.length) {
        tl.fromTo(
          revealItems,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: DURATION.storytelling, stagger: 0.12 },
          '-=0.8'
        )
      }

      if (scrollIndicatorRef.current) {
        tl.fromTo(
          scrollIndicatorRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          '-=0.3'
        )
      }

      mm.add(MEDIA.desktop, () => {
        gsap.to(imageRef.current, {
          yPercent: 14,
          scale: 1.05,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
          },
        })

        gsap.to('[data-hero-fade]', {
          y: 48,
          opacity: 0.15,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '55% top',
            scrub: 0.5,
          },
        })
      })
  })

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-end overflow-hidden pb-16 md:pb-24"
    >
      <div ref={imageRef} className="absolute inset-0">
        <Image
          src={heroData.media.src}
          alt={heroData.media.alt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,10,9,0.14)_0%,rgba(12,10,9,0.28)_42%,rgba(12,10,9,0.78)_100%)]" />
      </div>

      <Container size="wide" className="relative z-10">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div ref={contentRef} className="max-w-3xl">
            <Eyebrow
              data-hero-reveal
              data-hero-fade
              className="mb-4 text-text-inverse/70"
            >
              {heroData.eyebrow}
            </Eyebrow>

            <Heading
              as="h1"
              size="display"
              data-hero-reveal
              data-hero-fade
              className="mb-6 whitespace-pre-line text-text-inverse"
            >
              {heroData.title}
            </Heading>

            <Text
              data-hero-reveal
              data-hero-fade
              size="lg"
              className="mb-10 max-w-md text-text-inverse/80"
            >
              {heroData.subtitle}
            </Text>

            <div data-hero-reveal data-hero-fade className="flex flex-wrap gap-4">
              <Link href={heroData.cta.href}>
                <Button
                  variant="secondary"
                  size="lg"
                  className="border-text-inverse/30 text-text-inverse hover:bg-text-inverse/10"
                >
                  {heroData.cta.label}
                </Button>
              </Link>

              <Link href={heroData.secondaryCta.href}>
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-text-inverse hover:text-text-inverse/75"
                >
                  {heroData.secondaryCta.label}
                </Button>
              </Link>
            </div>
          </div>

          <div
            data-hero-reveal
            data-hero-fade
            className="hidden justify-self-end border-t border-text-inverse/20 pt-5 lg:block"
          >
            <p className="text-[10px] uppercase tracking-[0.28em] text-text-inverse/55">
              Spring chapter
            </p>
            <p className="mt-3 max-w-xs text-base leading-relaxed text-text-inverse/72">
              A slower opening frame for a collection shaped by material clarity, softened silhouettes and precise restraint.
            </p>
          </div>
        </div>
      </Container>

      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-3"
      >
        <span className="text-[10px] uppercase tracking-widest text-text-inverse/50">
          Scroll
        </span>
        <div className="w-px h-12 bg-text-inverse/20 relative overflow-hidden">
          <div className="absolute top-0 w-full h-6 bg-text-inverse/60 animate-[scroll-hint_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  )
}
