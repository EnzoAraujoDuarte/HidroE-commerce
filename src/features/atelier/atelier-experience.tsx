'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button, Container, Heading, Text } from '@/components/primitives'
import { atelierData } from '@/lib/data/atelier-data'
import { DURATION, EASE, MEDIA, gsap } from '@/lib/motion/gsap'
import { useScrollScene } from '@/lib/motion/use-scroll-scene'

export function AtelierExperience() {
  const pageRef = useRef<HTMLDivElement>(null)

  useScrollScene(pageRef, ({ mm }) => {
    gsap.fromTo(
      '[data-atelier-hero]',
      { y: 34, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: DURATION.storytelling,
        ease: EASE.editorial,
        stagger: 0.12,
      }
    )

    const sections = gsap.utils.toArray<HTMLElement>('[data-atelier-section]')

    sections.forEach((section) => {
      const items = section.querySelectorAll('[data-atelier-reveal]')

      if (!items.length) {
        return
      }

      gsap.fromTo(
        items,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: DURATION.editorial,
          ease: EASE.editorial,
          stagger: 0.12,
          scrollTrigger: {
            trigger: section,
            start: 'top 74%',
            once: true,
          },
        }
      )
    })

    mm.add(MEDIA.desktop, () => {
      gsap.utils.toArray<HTMLElement>('[data-atelier-parallax]').forEach((media) => {
        gsap.fromTo(
          media,
          { y: 54, scale: 1.06 },
          {
            y: -26,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: media.closest('[data-atelier-section]') ?? media,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.55,
            },
          }
        )
      })
    })
  })

  return (
    <div ref={pageRef} className="bg-bg text-text">
      <section className="relative min-h-[100svh] overflow-hidden bg-bg-inverse text-text-inverse">
        <div
          className="absolute inset-0"
          data-route-visual-target="/atelier"
        >
          <Image
            src={atelierData.hero.media.src}
            alt={atelierData.hero.media.alt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,10,9,0.16)_0%,rgba(12,10,9,0.38)_46%,rgba(12,10,9,0.86)_100%)]" />
        </div>

        <Container
          size="wide"
          className="relative z-10 flex min-h-[100svh] flex-col justify-end pb-16 pt-32 md:pb-20 md:pt-40"
        >
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.7fr] lg:items-end">
            <div className="max-w-4xl">
              <p
                data-atelier-hero
                className="mb-5 text-[11px] uppercase tracking-[0.32em] text-text-inverse/68"
              >
                {atelierData.hero.eyebrow}
              </p>
              <Heading
                as="h1"
                size="display"
                data-atelier-hero
                className="max-w-5xl text-text-inverse"
              >
                {atelierData.hero.title}
              </Heading>
              <Text
                size="lg"
                data-atelier-hero
                className="mt-6 max-w-xl text-text-inverse/76"
              >
                {atelierData.hero.subtitle}
              </Text>
            </div>

            <div
              data-atelier-hero
              className="max-w-sm justify-self-end border-t border-text-inverse/18 pt-5"
            >
              <p className="text-[10px] uppercase tracking-[0.28em] text-text-inverse/56">
                {atelierData.hero.supporting.label}
              </p>
              <p className="mt-3 text-base leading-relaxed text-text-inverse/74">
                {atelierData.hero.supporting.value}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section
        data-atelier-section
        className="bg-[linear-gradient(180deg,#f4f0e8_0%,#f8f6f1_100%)]"
      >
        <Container size="wide" className="py-20 md:py-28 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:gap-20">
            <div>
              <p
                data-atelier-reveal
                className="text-[11px] uppercase tracking-[0.28em] text-text-muted"
              >
                {atelierData.manifesto.eyebrow}
              </p>
              <blockquote data-atelier-reveal className="mt-6 max-w-4xl">
                <p className="text-display text-4xl leading-tight text-text md:text-5xl lg:text-6xl">
                  {atelierData.manifesto.quote}
                </p>
              </blockquote>
            </div>

            <div className="grid gap-8 self-end lg:pb-6">
              {atelierData.manifesto.body.map((paragraph) => (
                <Text
                  key={paragraph}
                  data-atelier-reveal
                  size="lg"
                  color="secondary"
                >
                  {paragraph}
                </Text>
              ))}

              <div
                data-atelier-reveal
                className="border-t border-border/80 pt-5"
              >
                <p className="text-[10px] uppercase tracking-[0.28em] text-text-muted">
                  {atelierData.manifesto.note.label}
                </p>
                <p className="mt-3 text-base leading-relaxed text-text-secondary">
                  {atelierData.manifesto.note.value}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section data-atelier-section className="border-t border-border/70 bg-bg">
        <Container size="wide" className="py-20 md:py-28 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 self-start">
              <p
                data-atelier-reveal
                className="text-[11px] uppercase tracking-[0.28em] text-text-muted"
              >
                {atelierData.process.eyebrow}
              </p>
              <Heading
                as="h2"
                size="2xl"
                data-atelier-reveal
                className="mt-5 max-w-3xl"
              >
                {atelierData.process.title}
              </Heading>
              <Text
                size="lg"
                color="secondary"
                data-atelier-reveal
                className="mt-6 max-w-lg"
              >
                {atelierData.process.description}
              </Text>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                {atelierData.process.notes.map((note) => (
                  <div
                    key={note.label}
                    data-atelier-reveal
                    className="border-t border-border/80 pt-5"
                  >
                    <p className="text-[10px] uppercase tracking-[0.28em] text-text-muted">
                      {note.label}
                    </p>
                    <p className="mt-3 text-base leading-relaxed text-text-secondary">
                      {note.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-[0.78fr_0.22fr] md:items-end lg:grid-cols-[0.64fr_0.36fr]">
              <div
                data-atelier-reveal
                className="relative aspect-[4/5] overflow-hidden bg-bg-muted md:aspect-[4/4.8]"
              >
                <div data-atelier-parallax className="absolute inset-0">
                  <Image
                    src={atelierData.process.media[0].src}
                    alt={atelierData.process.media[0].alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 56vw"
                  />
                </div>
              </div>

              <div className="grid gap-6">
                <div
                  data-atelier-reveal
                  className="relative aspect-[3/4] overflow-hidden bg-bg-muted"
                >
                  <div data-atelier-parallax className="absolute inset-0">
                    <Image
                      src={atelierData.process.media[1].src}
                      alt={atelierData.process.media[1].alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 24vw"
                    />
                  </div>
                </div>

                <div
                  data-atelier-reveal
                  className="border-t border-border/80 pt-5"
                >
                  <p className="text-[10px] uppercase tracking-[0.28em] text-text-muted">
                    Atelier study
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-text-secondary">
                    {atelierData.process.caption}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section data-atelier-section className="bg-bg-inverse text-text-inverse">
        <Container size="wide" className="py-20 md:py-28 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
            <div>
              <p
                data-atelier-reveal
                className="text-[11px] uppercase tracking-[0.28em] text-text-inverse/56"
              >
                {atelierData.materiality.eyebrow}
              </p>
              <Heading
                as="h2"
                size="2xl"
                data-atelier-reveal
                className="mt-5 max-w-3xl text-text-inverse"
              >
                {atelierData.materiality.title}
              </Heading>
              <Text
                size="lg"
                data-atelier-reveal
                className="mt-6 max-w-xl text-text-inverse/72"
              >
                {atelierData.materiality.description}
              </Text>
            </div>

            <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
              {atelierData.materiality.principles.map((principle) => (
                <div
                  key={principle.title}
                  data-atelier-reveal
                  className="border-t border-text-inverse/14 pt-5"
                >
                  <p className="text-[10px] uppercase tracking-[0.28em] text-text-inverse/50">
                    {principle.title}
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-text-inverse/72">
                    {principle.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-[1.14fr_0.86fr] lg:items-start">
            <div
              data-atelier-reveal
              className="relative aspect-[16/10] overflow-hidden bg-text-inverse/5"
            >
              <div data-atelier-parallax className="absolute inset-0">
                <Image
                  src={atelierData.materiality.media.src}
                  alt={atelierData.materiality.media.alt}
                  fill
                  className="object-cover opacity-90"
                  sizes="(max-width: 768px) 100vw, 58vw"
                />
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,10,9,0.08)_0%,rgba(12,10,9,0.32)_100%)]" />
            </div>

            <div className="grid gap-6">
              {atelierData.materiality.markers.map((marker) => (
                <div
                  key={marker.label}
                  data-atelier-reveal
                  className="border-t border-text-inverse/14 pt-5"
                >
                  <p className="text-[10px] uppercase tracking-[0.28em] text-text-inverse/50">
                    {marker.label}
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-text-inverse/72">
                    {marker.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section data-atelier-section className="border-t border-border/70 bg-bg">
        <Container size="wide" className="py-20 md:py-28 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-[1.06fr_0.94fr] lg:items-center">
            <div className="grid gap-6 md:grid-cols-[0.82fr_1.18fr]">
              <div
                data-atelier-reveal
                className="relative aspect-[3/4] overflow-hidden bg-bg-muted md:mt-14"
              >
                <div data-atelier-parallax className="absolute inset-0">
                  <Image
                    src={atelierData.signature.media[0].src}
                    alt={atelierData.signature.media[0].alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 28vw"
                  />
                </div>
              </div>

              <div className="grid gap-6">
                <div
                  data-atelier-reveal
                  className="relative aspect-[4/5] overflow-hidden bg-bg-muted"
                >
                  <div data-atelier-parallax className="absolute inset-0">
                    <Image
                      src={atelierData.signature.media[1].src}
                      alt={atelierData.signature.media[1].alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 32vw"
                    />
                  </div>
                </div>

                <div
                  data-atelier-reveal
                  className="border-t border-border/80 pt-5"
                >
                  <p className="text-[10px] uppercase tracking-[0.28em] text-text-muted">
                    {atelierData.signature.caption.label}
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-text-secondary">
                    {atelierData.signature.caption.value}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:max-w-xl lg:justify-self-end">
              <p
                data-atelier-reveal
                className="text-[11px] uppercase tracking-[0.28em] text-text-muted"
              >
                {atelierData.signature.eyebrow}
              </p>
              <Heading
                as="h2"
                size="2xl"
                data-atelier-reveal
                className="mt-5"
              >
                {atelierData.signature.title}
              </Heading>
              <Text
                size="lg"
                color="secondary"
                data-atelier-reveal
                className="mt-6"
              >
                {atelierData.signature.description}
              </Text>

              <div className="mt-10 grid gap-5">
                {atelierData.signature.callouts.map((callout) => (
                  <div
                    key={callout}
                    data-atelier-reveal
                    className="border-t border-border/80 pt-5"
                  >
                    <p className="text-base leading-relaxed text-text-secondary">
                      {callout}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section
        data-atelier-section
        className="border-t border-border/70 bg-[linear-gradient(180deg,#f3eee7_0%,#f8f6f2_100%)]"
      >
        <Container size="wide" className="py-20 md:py-24 lg:py-28">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_0.85fr] lg:items-end">
            <div>
              <p
                data-atelier-reveal
                className="text-[11px] uppercase tracking-[0.28em] text-text-muted"
              >
                {atelierData.closing.eyebrow}
              </p>
              <Heading
                as="h2"
                size="2xl"
                data-atelier-reveal
                className="mt-5 max-w-3xl"
              >
                {atelierData.closing.title}
              </Heading>
            </div>

            <div className="lg:max-w-xl lg:justify-self-end">
              <Text
                size="lg"
                color="secondary"
                data-atelier-reveal
              >
                {atelierData.closing.description}
              </Text>
              <div data-atelier-reveal className="mt-8 flex flex-wrap gap-4">
                <Link href={atelierData.closing.primaryCta.href}>
                  <Button size="lg">{atelierData.closing.primaryCta.label}</Button>
                </Link>
                <Link href={atelierData.closing.secondaryCta.href}>
                  <Button variant="secondary" size="lg">
                    {atelierData.closing.secondaryCta.label}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
