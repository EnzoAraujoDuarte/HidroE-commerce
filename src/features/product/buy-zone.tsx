'use client'

import { useState, useMemo } from 'react'
import { Eyebrow, Heading, Divider, Text } from '@/components/primitives'
import { VariantSelector } from './variant-selector'
import { AddToCartButton } from './add-to-cart-button'
import { ProductDetails } from './product-details'
import { ProductMaterialSummary } from './product-material-summary'
import { formatPrice, type ProductDetail, type SelectedOption } from '@/lib/commerce'
import { cn } from '@/lib/utils/cn'

interface BuyZoneProps {
  product: ProductDetail
  onVariantChange?: (variantId: string) => void
}

export function BuyZone({ product, onVariantChange }: BuyZoneProps) {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>(() => {
    if (product.variants.length > 0) {
      return product.variants[0].selectedOptions
    }
    return []
  })

  const selectedVariant = useMemo(() => {
    return product.variants.find((variant) =>
      variant.selectedOptions.every((opt) =>
        selectedOptions.some(
          (sel) => sel.name === opt.name && sel.value === opt.value
        )
      )
    )
  }, [product.variants, selectedOptions])

  const handleOptionChange = (name: string, value: string) => {
    setSelectedOptions((prev) =>
      prev.map((opt) => (opt.name === name ? { ...opt, value } : opt))
    )

    const newVariant = product.variants.find((variant) =>
      variant.selectedOptions.every((opt) => {
        if (opt.name === name) return opt.value === value
        return selectedOptions.some(
          (sel) => sel.name === opt.name && sel.value === opt.value
        )
      })
    )

    if (newVariant && onVariantChange) {
      onVariantChange(newVariant.id)
    }
  }

  const price = selectedVariant?.price ?? product.price
  const compareAtPrice = selectedVariant?.compareAtPrice ?? product.compareAtPrice
  const hasDiscount =
    compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount)
  const isAvailable = selectedVariant?.availableForSale ?? product.availableForSale

  return (
    <div className="space-y-5">
      {/* Brand + title */}
      <div className="space-y-2">
        {product.vendor && <Eyebrow>{product.vendor}</Eyebrow>}
        <Heading as="h1" size="xl">
          {product.title}
        </Heading>
      </div>

      {/* Price block */}
      <div className="flex items-baseline gap-3">
        <span
          className={cn(
            'text-2xl font-medium tracking-tight',
            hasDiscount ? 'text-text' : 'text-text'
          )}
        >
          {formatPrice(price)}
        </span>
        {hasDiscount && (
          <>
            <span className="text-base text-text-muted line-through">
              {formatPrice(compareAtPrice!)}
            </span>
            <span className="rounded-full bg-bg-muted px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-text-secondary">
              Sale
            </span>
          </>
        )}
      </div>

      {/* Availability badge */}
      {!isAvailable && (
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-text-muted" />
          <Text size="sm" color="muted">
            Currently unavailable
          </Text>
        </div>
      )}

      <ProductMaterialSummary materialProfile={product.materialProfile} />

      {/* Variant selector */}
      {product.options.length > 0 && (
        <>
          <Divider />
          <VariantSelector
            options={product.options}
            variants={product.variants}
            selectedOptions={selectedOptions}
            onOptionChange={handleOptionChange}
          />
        </>
      )}

      <Divider />

      {/* Add to cart */}
      <AddToCartButton
        variantId={selectedVariant?.id ?? product.variants[0]?.id ?? ''}
        availableForSale={isAvailable}
      />

      {/* Details accordion */}
      <ProductDetails
        description={product.description}
        descriptionHtml={product.descriptionHtml}
        materialProfile={product.materialProfile}
      />
    </div>
  )
}
