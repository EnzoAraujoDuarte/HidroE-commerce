'use client'

import { useState } from 'react'
import { ProductGallery } from './product-gallery'
import { BuyZone } from './buy-zone'
import { ProductMaterialStory } from './product-material-story'
import { Container, Section } from '@/components/primitives'
import type { ProductDetail } from '@/lib/commerce'

interface ProductViewProps {
  product: ProductDetail
}

export function ProductView({ product }: ProductViewProps) {
  const [selectedVariantImage, setSelectedVariantImage] = useState(product.images[0])

  const handleVariantChange = (variantId: string) => {
    const variant = product.variants.find((v) => v.id === variantId)
    if (variant?.image) {
      setSelectedVariantImage(variant.image)
    }
  }

  return (
    <>
      <Section spacing="none" className="pt-24 pb-16 md:pt-28 md:pb-24">
        <Container size="wide">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
          <ProductGallery
            images={product.images}
            selectedVariantImage={selectedVariantImage}
            transitionKey={`/product/${product.handle}`}
          />
            <div className="lg:ml-auto lg:max-w-md lg:sticky lg:top-28 lg:self-start">
              <BuyZone product={product} onVariantChange={handleVariantChange} />
            </div>
          </div>
        </Container>
      </Section>
      <ProductMaterialStory product={product} />
    </>
  )
}
