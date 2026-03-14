'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Container, Eyebrow, Heading, Section, Text } from '@/components/primitives'
import { homeStoryChapters } from '@/lib/data/editorial-data'
import { editorialData } from '@/lib/data/mock-data'
import { DURATION, EASE, MEDIA, ScrollTrigger, gsap } from '@/lib/motion/gsap'
import { useScrollScene } from '@/lib/motion/use-scroll-scene'
import { cn } from '@/lib/utils/cn'

export function EditorialSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeChapter, setActiveChapter] = useState(0)

  useScrollScene(sectionRef, ({ mm }) => {
    gsap.fromTo(
      '[data-home-intro]',
      { y: 40, opacity: 0 },
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

    const chapters = gsap.utils.toArray<HTMLElement>('[data-home-chapter]')

    chapters.forEach((chapter, index) => {
      const steps = chapter.querySelectorAll('[data-home-step]')

      gsap.fromTo(
        steps,
        { y: 34, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: DURATION.editorial,
          ease: EASE.editorial,
          stagger: 0.12,
          scrollTrigger: {
            trigger: chapter,
            start: 'top 72%',
            once: true,
          },
        }
      )

      ScrollTrigger.create({
        trigger: chapter,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveChapter(index),
        onEnterBack: () => setActiveChapter(index),
      })
    })

    mm.add(MEDIA.desktop, () => {
      chapters.forEach((chapter) => {
        const media = chapter.querySelector('[data-home-media]')

        if (!media) {
          return
        }

        gsap.fromTo(
          media,
          { y: 60, scale: 1.06 },
          {
            y: -24,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: chapter,
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
    <Section ref={sectionRef} spacing="xl" className="bg-bg">
      <Container size="wide">
        <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow data-home-intro className="mb-5">
              {editorialData.eyebrow}
            </Eyebrow>
            <Heading as="h2" size="xl" data-home-intro className="max-w-md">
              {editorialData.title}
            </Heading>
            <Text
              data-home-intro
              color="secondary"
              size="lg"
              className="mt-6 max-w-md"
            >
              {editorialData.description}
            </Text>

            <div data-home-intro className="mt-10 hidden border-t border-border/80 pt-6 lg:block">
              <p className="text-[11px] uppercase tracking-[0.24em] text-text-muted">
                Active chapter
              </p>
              <div className="mt-4 flex flex-col gap-4">
                {homeStoryChapters.map((chapter, index) => (
                  <div key={chapter.id} className="flex items-center gap-4">
                    <span
                      className={cn(
                        'h-px transition-all duration-300',
                        index === activeChapter ? 'w-12 bg-text' : 'w-6 bg-border'
                      )}
                    />
                    <div>
                      <p
                        className={cn(
                          'text-[10px] uppercase tracking-[0.28em] transition-colors duration-300',
                          index === activeChapter ? 'text-text' : 'text-text-muted'
                        )}
                      >
                        {chapter.index}
                      </p>
                      <p
                        className={cn(
                          'text-sm transition-colors duration-300',
                          index === activeChapter ? 'text-text' : 'text-text-secondary'
                        )}
                      >
                        {chapter.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-10">
            {homeStoryChapters.map((chapter) => (
              <article
                key={chapter.id}
                data-home-chapter
                className="grid gap-6 border border-border/70 bg-bg-muted/40 p-6 md:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8"
              >
                <div
                  data-home-media
                  className="relative aspect-[4/5] overflow-hidden bg-bg md:aspect-[4/4.6]"
                >
                  <Image
                    src={chapter.media.src}
                    alt={chapter.media.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 38vw"
                  />
                </div>

                <div className="flex flex-col justify-between gap-6">
                  <div data-home-step>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-text-muted">
                      {chapter.index} / {chapter.label}
                    </p>
                    <Heading as="h3" size="lg" className="mt-4 max-w-xl">
                      {chapter.title}
                    </Heading>
                    <Text size="lg" color="secondary" className="mt-5 max-w-xl">
                      {chapter.description}
                    </Text>
                  </div>

                  <div className="grid gap-4 border-t border-border/80 pt-5 sm:grid-cols-2">
                    {chapter.details.map((detail) => (
                      <Text
                        key={detail}
                        data-home-step
                        size="sm"
                        color="secondary"
                        className="max-w-xs"
                      >
                        {detail}
                      </Text>
                    ))}
                  </div>

                  <p
                    data-home-step
                    className="text-[11px] uppercase tracking-[0.28em] text-text-muted"
                  >
                    {chapter.caption}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
