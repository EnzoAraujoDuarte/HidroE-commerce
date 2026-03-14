'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Button,
  Container,
  EditorialMediaViewer,
  Heading,
  Text,
  type EditorialMediaItem,
  type ViewerOriginRect,
} from '@/components/primitives'
import { lookbookData } from '@/lib/data/editorial-data'
import { ShopStoryRail } from './shop-story-rail'
import { DURATION, EASE, MEDIA, ScrollTrigger, gsap } from '@/lib/motion/gsap'
import { useScrollScene } from '@/lib/motion/use-scroll-scene'
import { cn } from '@/lib/utils/cn'
import type { Collection } from '@/lib/commerce'

interface LookbookExperienceProps {
  shopCollectionsByHandle: Record<string, Collection>
}

export function LookbookExperience({
  shopCollectionsByHandle,
}: LookbookExperienceProps) {
  const pageRef = useRef<HTMLDivElement>(null)
  const [activeChapter, setActiveChapter] = useState(0)
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  const [viewerOriginRect, setViewerOriginRect] = useState<ViewerOriginRect | null>(null)

  const viewerItems: EditorialMediaItem[] = lookbookData.chapters.map((chapter) => ({
    src: chapter.media.src,
    alt: chapter.media.alt,
    eyebrow: chapter.label,
    title: chapter.title,
    caption: chapter.intro,
  }))

  useScrollScene(pageRef, ({ mm }) => {
    gsap.fromTo(
      '[data-lookbook-reveal]',
      { y: 36, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: DURATION.editorial,
        ease: EASE.editorial,
        stagger: 0.12,
      }
    )

    const chapters = gsap.utils.toArray<HTMLElement>('[data-lookbook-chapter]')

    chapters.forEach((chapter, index) => {
      const steps = chapter.querySelectorAll('[data-lookbook-step]')

      gsap.fromTo(
        steps,
        { y: 36, opacity: 0 },
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
        const media = chapter.querySelector('[data-lookbook-media]')

        if (!media) {
          return
        }

        gsap.fromTo(
          media,
          { y: 72, scale: 1.08 },
          {
            y: -36,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: chapter,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
            },
          }
        )
      })
    })
  })

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
    <div ref={pageRef} className="bg-bg text-text">
      <div className="pointer-events-none fixed right-6 top-24 z-40 hidden xl:flex">
        <div className="flex min-w-[200px] flex-col gap-5 rounded-[2rem] border border-border/70 bg-bg/72 px-5 py-5 shadow-[0_20px_60px_rgba(12,10,9,0.08)] backdrop-blur-xl">
          {lookbookData.chapters.map((chapter, index) => {
            const isActive = index === activeChapter

            return (
              <div key={chapter.id} className="flex items-center gap-3">
                <span
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300',
                    isActive ? 'w-10 bg-text' : 'w-4 bg-border'
                  )}
                />
                <div>
                  <p
                    className={cn(
                      'text-[10px] uppercase tracking-[0.28em] transition-colors duration-300',
                      isActive ? 'text-text' : 'text-text-muted'
                    )}
                  >
                    {chapter.index}
                  </p>
                  <p
                    className={cn(
                      'text-xs transition-colors duration-300',
                      isActive ? 'text-text' : 'text-text-secondary'
                    )}
                  >
                    {chapter.label}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 xl:hidden">
        <div className="flex w-full max-w-sm items-center justify-between gap-3 rounded-full border border-border/70 bg-bg/88 px-4 py-3 shadow-[0_18px_40px_rgba(12,10,9,0.08)] backdrop-blur-xl">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-text-muted">
              Chapter
            </p>
            <p className="mt-1 text-sm text-text">
              {lookbookData.chapters[activeChapter]?.label}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {lookbookData.chapters.map((chapter, index) => (
              <span
                key={chapter.id}
                className={cn(
                  'block h-1.5 rounded-full transition-all duration-300',
                  index === activeChapter ? 'w-8 bg-text' : 'w-2.5 bg-border'
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <section className="relative min-h-[100svh] overflow-hidden bg-bg-inverse text-text-inverse">
        <div className="absolute inset-0">
          <Image
            src={lookbookData.hero.media.src}
            alt={lookbookData.hero.media.alt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,10,9,0.18)_0%,rgba(12,10,9,0.42)_45%,rgba(12,10,9,0.78)_100%)]" />
        </div>

        <Container
          size="wide"
          className="relative z-10 flex min-h-[100svh] flex-col justify-end pb-16 pt-32 md:pb-20 md:pt-40"
        >
          <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div className="max-w-3xl">
              <p
                data-lookbook-reveal
                className="mb-5 text-[11px] uppercase tracking-[0.32em] text-text-inverse/68"
              >
                {lookbookData.hero.eyebrow}
              </p>
              <Heading
                as="h1"
                size="display"
                data-lookbook-reveal
                className="max-w-4xl text-text-inverse"
              >
                {lookbookData.hero.title}
              </Heading>
              <Text
                size="lg"
                data-lookbook-reveal
                className="mt-6 max-w-xl text-text-inverse/76"
              >
                {lookbookData.hero.subtitle}
              </Text>
              <div data-lookbook-reveal className="mt-10 flex flex-wrap gap-4">
                <Link href={lookbookData.hero.primaryCta.href}>
                  <Button size="lg">{lookbookData.hero.primaryCta.label}</Button>
                </Link>
                <Link href={lookbookData.hero.secondaryCta.href}>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="border-text-inverse/24 text-text-inverse hover:bg-text-inverse/10"
                  >
                    {lookbookData.hero.secondaryCta.label}
                  </Button>
                </Link>
              </div>
            </div>

            <div
              data-lookbook-reveal
              className="hidden max-w-sm justify-self-end border-t border-text-inverse/18 pt-5 lg:block"
            >
              <p className="text-[10px] uppercase tracking-[0.28em] text-text-inverse/56">
                Three chapters
              </p>
              <p className="mt-3 text-base leading-relaxed text-text-inverse/74">
                A scroll-led editorial route built to deepen material confidence before the shopper returns to product.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {lookbookData.chapters.map((chapter, index) => (
        <section
          key={chapter.id}
          data-lookbook-chapter
          className="border-b border-border/70 bg-bg"
        >
          <Container size="wide" className="py-16 md:py-20 lg:py-28">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              <div className={cn(index % 2 === 1 && 'lg:order-2')}>
                <div className="lg:sticky lg:top-28">
                  <button
                    data-lookbook-media
                    onClick={(event) => openViewer(index, event.currentTarget)}
                    className="group relative block aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-bg-muted md:aspect-[5/6]"
                    aria-label={`Open ${chapter.label} media in fullscreen`}
                    data-cursor="media"
                    data-cursor-label="Open"
                  >
                    <Image
                      src={chapter.media.src}
                      alt={chapter.media.alt}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      sizes="(max-width: 1024px) 100vw, 45vw"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,10,9,0.04)_0%,rgba(12,10,9,0.22)_100%)]" />
                    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                      <span className="rounded-full border border-text-inverse/18 bg-text-inverse/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.28em] text-text-inverse backdrop-blur-sm">
                        {chapter.index}
                      </span>
                      <span className="rounded-full border border-text-inverse/18 bg-text-inverse/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.28em] text-text-inverse backdrop-blur-sm">
                        Open
                      </span>
                    </div>
                  </button>
                  <div className="mt-4 flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.22em] text-text-muted">
                    <span>{chapter.label}</span>
                    <span>{chapter.index}</span>
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  'flex flex-col justify-center gap-10 lg:min-h-[140svh] lg:py-16',
                  index % 2 === 1 && 'lg:order-1'
                )}
              >
                <div data-lookbook-step className="max-w-2xl">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-text-muted">
                    {chapter.index} / {chapter.label}
                  </p>
                  <Heading as="h2" size="2xl" className="mt-5">
                    {chapter.title}
                  </Heading>
                  <Text size="lg" color="secondary" className="mt-6 max-w-xl">
                    {chapter.intro}
                  </Text>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  {chapter.notes.map((note) => (
                    <div
                      key={note.label}
                      data-lookbook-step
                      className="border-t border-border/80 pt-5"
                    >
                      <p className="text-[11px] uppercase tracking-[0.24em] text-text-muted">
                        {note.label}
                      </p>
                      <p className="mt-3 text-base leading-relaxed text-text-secondary">
                        {note.value}
                      </p>
                    </div>
                  ))}
                </div>

                <Text
                  as="div"
                  data-lookbook-step
                  size="lg"
                  color="secondary"
                  className="max-w-xl"
                >
                  {chapter.body}
                </Text>

                <div data-lookbook-step>
                  <Link href={chapter.cta.href}>
                    <Button variant="secondary" size="lg">
                      {chapter.cta.label}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Container>

          {chapter.shopCollectionHandle &&
            shopCollectionsByHandle[chapter.shopCollectionHandle] && (
              <Container size="wide" className="pb-16 md:pb-20 lg:pb-28">
                <ShopStoryRail
                  collection={shopCollectionsByHandle[chapter.shopCollectionHandle]}
                  eyebrow="Shop the story"
                  title={chapter.shopTitle}
                  description={chapter.shopDescription}
                />
              </Container>
            )}
        </section>
      ))}

      <section className="bg-bg-inverse py-24 text-text-inverse md:py-32">
        <Container size="wide">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_0.85fr] lg:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-text-inverse/52">
                {lookbookData.closing.eyebrow}
              </p>
              <Heading as="h2" size="2xl" className="mt-5 text-text-inverse">
                {lookbookData.closing.title}
              </Heading>
            </div>
            <div className="lg:max-w-xl lg:justify-self-end">
              <Text size="lg" className="text-text-inverse/74">
                {lookbookData.closing.description}
              </Text>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href={lookbookData.closing.primaryCta.href}>
                  <Button size="lg">{lookbookData.closing.primaryCta.label}</Button>
                </Link>
                <Link href={lookbookData.closing.secondaryCta.href}>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="border-text-inverse/24 text-text-inverse hover:bg-text-inverse/10"
                  >
                    {lookbookData.closing.secondaryCta.label}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

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
    </div>
  )
}
