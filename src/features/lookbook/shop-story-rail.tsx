'use client'

import Link from 'next/link'
import { Button, Eyebrow, Heading, Text } from '@/components/primitives'
import { ProductCard } from '@/components/commerce/product-card'
import type { Collection } from '@/lib/commerce'

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
      <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
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
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
