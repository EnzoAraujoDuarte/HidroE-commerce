'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button, Eyebrow, Heading, Text } from '@/components/primitives'
import { formatPrice, type Collection } from '@/lib/commerce'

interface ShopStoryRailProps {
  collection: Collection
  eyebrow: string
  title: string
  description: string
}

export function ShopStoryRail({
  collection,
  eyebrow,
  title,
  description,
}: ShopStoryRailProps) {
  const products = collection.products.slice(0, 3)

  if (products.length === 0) {
    return null
  }

  return (
    <section className="border-t border-border/70 bg-[linear-gradient(180deg,rgba(250,250,249,0)_0%,rgba(245,245,244,0.8)_100%)] p-6 md:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
        <div className="max-w-sm">
          <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
          <Heading as="h3" size="sm" className="max-w-xs">
            {title}
          </Heading>
          <Text color="secondary" className="mt-4">
            {description}
          </Text>
          <div className="mt-6">
            <Link href={`/collection/${collection.handle}`}>
              <Button variant="secondary" size="sm">
                View collection
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {products.map((product, index) => (
            <Link
              key={product.id}
              href={`/product/${product.handle}`}
              className="group ui-card block"
              data-cursor="card"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-bg">
                <Image
                  src={product.image.url}
                  alt={product.image.altText || product.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 24vw"
                />
                <div className="absolute left-3 top-3 rounded-full border border-text-inverse/18 bg-text-inverse/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-text-inverse backdrop-blur-sm">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>

              <div className="mt-3 space-y-1">
                <p className="text-[11px] uppercase tracking-[0.24em] text-text-muted">
                  {collection.title}
                </p>
                <p className="text-sm text-text transition-colors duration-200 group-hover:text-text-secondary">
                  {product.title}
                </p>
                <p className="text-sm text-text-secondary">
                  {formatPrice(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
