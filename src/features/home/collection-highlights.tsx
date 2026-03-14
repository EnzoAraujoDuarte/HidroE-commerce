'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Container, Section, Eyebrow, Heading } from '@/components/primitives'
import { collectionHighlights } from '@/lib/data/mock-data'
import { DURATION, EASE, gsap } from '@/lib/motion/gsap'
import { useScrollScene } from '@/lib/motion/use-scroll-scene'
import { cn } from '@/lib/utils/cn'

export function CollectionHighlights() {
  const sectionRef = useRef<HTMLElement>(null)

  useScrollScene(sectionRef, () => {
    gsap.fromTo(
      '[data-card]',
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: DURATION.editorial,
        ease: EASE.editorial,
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          once: true,
        },
      }
    )
  })

  return (
    <Section ref={sectionRef} spacing="xl" className="bg-bg-muted">
      <Container size="wide">
        <div className="text-center mb-16">
          <Eyebrow className="mb-4">Explore</Eyebrow>
          <Heading as="h2" size="lg">
            Collection Highlights
          </Heading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {collectionHighlights.map((item) => (
            <CollectionCard key={item.id} {...item} />
          ))}
        </div>
      </Container>
    </Section>
  )
}

interface CollectionCardProps {
  id: string
  title: string
  image: string
  href: string
}

function CollectionCard({ title, image, href }: CollectionCardProps) {
  return (
    <Link
      href={href}
      data-card
      data-cursor="card"
      className={cn(
        'group ui-card relative block overflow-hidden rounded-[1.75rem]',
        'aspect-[3/4]'
      )}
    >
      <Image
        src={image}
        alt={title}
        fill
        className={cn(
          'object-cover transition-transform duration-700 ease-out',
          'group-hover:scale-105'
        )}
        sizes="(max-width: 768px) 100vw, 33vw"
      />

      {/* Overlay */}
      <div
        className={cn(
          'absolute inset-0 bg-bg-inverse/20',
          'transition-opacity duration-300',
          'group-hover:bg-bg-inverse/30'
        )}
      />

      {/* Title */}
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3
          className={cn(
            'text-lg font-medium text-text-inverse',
            'transform transition-transform duration-300',
            'group-hover:translate-y-[-4px]'
          )}
        >
          {title}
        </h3>
        <span
          className={cn(
            'inline-block text-sm text-text-inverse/70 mt-2',
            'opacity-0 transform translate-y-2',
            'transition-all duration-300',
            'group-hover:opacity-100 group-hover:translate-y-0'
          )}
        >
          View collection
        </span>
      </div>
    </Link>
  )
}
