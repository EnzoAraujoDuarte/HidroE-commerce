'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { formatPrice, type ProductCard as ProductCardType, type ProductVariant } from '@/lib/commerce'
import { Text } from '@/components/primitives'
import { useCart } from '@/lib/cart'

interface ProductCardProps {
  product: ProductCardType
  priority?: boolean
}

type ProductOptionLike = NonNullable<ProductCardType['options']>[number]

// Maps a color name to a CSS background value for the swatch
const COLOR_MAP: Record<string, string> = {
  black: '#111111',
  preto: '#111111',
  white: '#f5f5f4',
  branco: '#f5f5f4',
  'off white': '#f5f0e8',
  'off-white': '#f5f0e8',
  gray: '#9ca3af',
  grey: '#9ca3af',
  cinza: '#9ca3af',
  charcoal: '#4b5563',
  silver: '#c0bfbf',
  prata: '#c0bfbf',
  green: '#4ade80',
  verde: '#4ade80',
  forest: '#166534',
  olive: '#6b7c3e',
  sage: '#a3b899',
  mint: '#86efac',
  blue: '#3b82f6',
  azul: '#3b82f6',
  navy: '#1e3a5f',
  marinho: '#1e3a5f',
  sky: '#7dd3fc',
  pink: '#f9a8d4',
  rosa: '#f9a8d4',
  red: '#ef4444',
  vermelho: '#ef4444',
  burgundy: '#7f1d1d',
  vinho: '#7f1d1d',
  orange: '#fb923c',
  laranja: '#fb923c',
  yellow: '#fde047',
  amarelo: '#fde047',
  beige: '#e8dcc8',
  cream: '#faf5eb',
  creme: '#faf5eb',
  off: '#f5f0e8',
  oat: '#ddd2c2',
  stone: '#d6d3d1',
  sand: '#d6c4a3',
  brown: '#92400e',
  marrom: '#92400e',
  camel: '#c19a6b',
  tan: '#d2b48c',
  purple: '#a855f7',
  roxo: '#a855f7',
  lilac: '#c4b5fd',
  lavender: '#ddd6fe',
  plum: '#7c3f58',
  wine: '#7a2848',
  ivory: '#f9f4e8',
}

const COLOR_KEYS = Object.keys(COLOR_MAP).sort((left, right) => right.length - left.length)

const isColorOption = (name: string) =>
  ['color', 'colour', 'cor', 'color name', 'colour name'].includes(name.toLowerCase())

function matchesOptionValue(
  variant: ProductVariant,
  optionName: string,
  optionValue: string
) {
  return variant.selectedOptions.some(
    (option) => option.name === optionName && option.value === optionValue
  )
}

function getRepresentativeVariant(
  variants: ProductVariant[],
  optionName: string,
  optionValue: string
) {
  const matches = variants.filter((variant) =>
    matchesOptionValue(variant, optionName, optionValue)
  )

  if (matches.length === 0) {
    return null
  }

  return (
    matches.find((variant) => variant.availableForSale && variant.image) ??
    matches.find((variant) => variant.availableForSale) ??
    matches.find((variant) => variant.image) ??
    matches[0]
  )
}

function pickVariantForSelection(
  variants: ProductVariant[],
  optionName: string,
  optionValue: string,
  currentVariant: ProductVariant | null
) {
  const matches = variants.filter((variant) =>
    matchesOptionValue(variant, optionName, optionValue)
  )

  if (matches.length === 0) {
    return null
  }

  return (
    matches.find(
      (variant) =>
        variant.availableForSale &&
        currentVariant?.selectedOptions.every(
          (selectedOption) =>
            selectedOption.name === optionName ||
            variant.selectedOptions.some(
              (option) =>
                option.name === selectedOption.name &&
                option.value === selectedOption.value
            )
        )
    ) ??
    matches.find((variant) => variant.availableForSale && variant.image) ??
    matches.find((variant) => variant.availableForSale) ??
    matches.find((variant) => variant.image) ??
    matches[0]
  )
}

function getMatchedColors(value: string) {
  const normalizedValue = value.toLowerCase().replace(/[_-]+/g, ' ').trim()
  const colors: string[] = []

  for (const key of COLOR_KEYS) {
    if (normalizedValue === key || normalizedValue.includes(key)) {
      const color = COLOR_MAP[key]
      if (!colors.includes(color)) {
        colors.push(color)
      }
    }
  }

  return colors
}

function getSwatchBackground(value: string): string | null {
  const colors = getMatchedColors(value)

  if (colors.length === 0) {
    return null
  }

  if (colors.length === 1) {
    return colors[0]
  }

  return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[0]} 50%, ${colors[1]} 50%, ${colors[1]} 100%)`
}

function looksLikeColorOption(option: ProductOptionLike) {
  const matchedCount = option.values.filter((value) => getSwatchBackground(value)).length

  return (
    isColorOption(option.name) ||
    (option.values.length > 1 && matchedCount >= Math.min(2, option.values.length))
  )
}

function getCardOption(product: ProductCardType) {
  const options = product.options?.filter((option) => option.values.length > 1) ?? []

  if (options.length === 0) {
    return null
  }

  return (
    options.find((option) => looksLikeColorOption(option)) ??
    options.find(
      (option) => !['title', 'default title'].includes(option.name.toLowerCase())
    ) ??
    options[0]
  )
}

function getVariantVisualMode(option: ProductOptionLike, variants: ProductVariant[]) {
  const distinctImages = new Set(
    option.values
      .map((value) => getRepresentativeVariant(variants, option.name, value)?.image?.url)
      .filter((url): url is string => Boolean(url))
  )

  if (looksLikeColorOption(option)) {
    const hasMappedColors = option.values.some((value) => Boolean(getSwatchBackground(value)))

    if (hasMappedColors) {
      return 'color' as const
    }

    return distinctImages.size >= 2 ? ('image' as const) : ('text' as const)
  }

  return distinctImages.size >= 2 ? ('image' as const) : ('text' as const)
}

function getDisplayImageForSelection(
  product: ProductCardType,
  selectedVariant: ProductVariant | null,
  cardOption: ProductOptionLike | null
) {
  if (selectedVariant?.image) {
    return selectedVariant.image
  }

  if (cardOption && product.variants && selectedVariant) {
    const selectedValue = selectedVariant.selectedOptions.find(
      (option) => option.name === cardOption.name
    )?.value

    if (selectedValue) {
      const representativeImage = getRepresentativeVariant(
        product.variants,
        cardOption.name,
        selectedValue
      )?.image

      if (representativeImage) {
        return representativeImage
      }
    }
  }

  return product.image
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const cardOption = getCardOption(product)
  const hasMultipleVariants = (product.variants?.length ?? 0) > 1

  const getInitialVariant = (): ProductVariant | null =>
    product.variants?.find((v) => v.availableForSale) ?? product.variants?.[0] ?? null

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(getInitialVariant)

  // Derived display state — all update together when variant changes
  const displayImage = getDisplayImageForSelection(product, selectedVariant, cardOption)
  const hoverImage = displayImage.url !== product.image.url ? undefined : product.hoverImage
  const displayPrice = selectedVariant?.price ?? product.price
  const displayCompareAt = selectedVariant?.compareAtPrice ?? product.compareAtPrice
  const isAvailable = selectedVariant?.availableForSale ?? product.availableForSale
  const hasDiscount =
    !!displayCompareAt &&
    parseFloat(displayCompareAt.amount) > parseFloat(displayPrice.amount)

  const handleOptionSelect = (optionName: string, optionValue: string) => {
    if (!product.variants) return
    const match = pickVariantForSelection(
      product.variants,
      optionName,
      optionValue,
      selectedVariant
    )
    if (match) setSelectedVariant(match)
  }

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const variantId = selectedVariant?.id ?? product.variants?.[0]?.id
    if (!variantId || !isAvailable) return
    setIsAdding(true)
    await addItem(variantId)
    setIsAdding(false)
  }

  return (
    <article className="group relative" data-product-card>
      {/* Image container */}
      <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-bg-muted">
        <Link
          href={`/product/${product.handle}`}
          className="absolute inset-0 block"
          data-transition-image
          data-transition-src={displayImage.url}
          data-cursor="card"
        >
          <Image
            src={displayImage.url}
            alt={displayImage.altText || product.title}
            fill
            priority={priority}
            className={cn(
              'object-cover transition-all duration-500 ease-out',
              hoverImage && 'group-hover:scale-[1.04] group-hover:opacity-0'
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {hoverImage && (
            <Image
              src={hoverImage.url}
              alt={hoverImage.altText || product.title}
              fill
              className="object-cover transition-all duration-500 ease-out scale-[1.02] opacity-0 group-hover:scale-100 group-hover:opacity-100"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          )}

          {!isAvailable && (
            <div className="absolute inset-0 bg-bg/60 flex items-center justify-center">
              <span className="text-sm font-medium tracking-wide text-text">Sold Out</span>
            </div>
          )}
        </Link>

        {/* Quick Add — above the link via z-index, slides in on hover */}
        {isAvailable && (
          <div className="absolute inset-x-3 bottom-3 z-10 translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            <button
              onClick={handleQuickAdd}
              disabled={isAdding}
              aria-label={`Add ${product.title} to cart`}
              className={cn(
                'relative w-full rounded-full border border-border/40 bg-bg/88 py-2.5 text-xs font-medium tracking-wide text-text backdrop-blur-sm transition-colors hover:bg-bg',
                isAdding && 'text-transparent'
              )}
            >
              Quick Add
              {isAdding && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border border-text/30 border-t-text" />
                </span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="space-y-2.5">
        <Link href={`/product/${product.handle}`} className="block space-y-1">
          {product.vendor && (
            <Text as="span" size="sm" color="muted" className="block tracking-wide uppercase text-xs">
              {product.vendor}
            </Text>
          )}

          <h3
            className={cn(
              'text-sm font-normal text-text leading-snug',
              'transition-colors duration-200 group-hover:text-text-secondary'
            )}
          >
            {product.title}
          </h3>

          <div className="flex items-center gap-2">
            <span className={cn('text-sm', hasDiscount ? 'text-text font-medium' : 'text-text-secondary')}>
              {formatPrice(displayPrice)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-text-muted line-through">
                {formatPrice(displayCompareAt!)}
              </span>
            )}
          </div>
        </Link>

        {/* Variant picker */}
        {hasMultipleVariants && cardOption && (
          <VariantPicker
            option={cardOption}
            variants={product.variants!}
            selectedVariant={selectedVariant}
            onSelect={handleOptionSelect}
          />
        )}
      </div>
    </article>
  )
}

function VariantPicker({
  option,
  variants,
  selectedVariant,
  onSelect,
}: {
  option: ProductOptionLike
  variants: ProductVariant[]
  selectedVariant: ProductVariant | null
  onSelect: (name: string, value: string) => void
}) {
  const selectedValue = selectedVariant?.selectedOptions.find(
    (o) => o.name === option.name
  )?.value

  const displayValues = option.values.slice(0, 7)
  const remaining = option.values.length - displayValues.length
  const visualMode = getVariantVisualMode(option, variants)

  return (
    <div className="flex flex-wrap items-center gap-2 pt-0.5">
      {displayValues.map((value) => {
        const variant = getRepresentativeVariant(variants, option.name, value)
        const isSelected = selectedValue === value
        const isAvailable = variant?.availableForSale ?? false
        const swatchBackground = visualMode === 'color' ? getSwatchBackground(value) : null
        const variantImage = variant?.image

        if (visualMode === 'color') {
          // Colour swatch: 28px visual, 36px tap target
          return (
            <button
              key={value}
              onClick={(e) => { e.preventDefault(); onSelect(option.name, value) }}
              disabled={!isAvailable}
              aria-label={value}
              aria-pressed={isSelected}
              title={value}
              style={{ padding: 4 }} // expands tap area to ~36px with the 28px inner swatch
              className={cn(
                'relative flex-shrink-0 rounded-full transition-all duration-150',
                isSelected
                  ? 'outline outline-2 outline-offset-1 outline-text'
                  : 'outline outline-2 outline-offset-1 outline-transparent hover:outline-border',
                !isAvailable && 'pointer-events-none opacity-35'
              )}
            >
              {/* inner swatch circle: 28px */}
              <span
                className="block h-7 w-7 rounded-full border border-black/10"
                style={
                  swatchBackground
                    ? { background: swatchBackground }
                    : variantImage
                    ? undefined
                    : { backgroundColor: '#d6d3d1' }
                }
              >
                {!swatchBackground && variantImage && (
                  <span className="relative block h-full w-full overflow-hidden rounded-full">
                    <Image
                      src={variantImage.url}
                      alt={value}
                      fill
                      className="object-cover"
                      sizes="28px"
                    />
                  </span>
                )}
              </span>

              {/* Unavailable diagonal strike */}
              {!isAvailable && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                >
                  <span className="block h-px w-5 rotate-45 bg-text-muted/70" />
                </span>
              )}
            </button>
          )
        }

        // Non-colour option: image thumbnail fallback or text chip
        if (visualMode === 'image' && variantImage) {
          return (
            <button
              key={value}
              onClick={(e) => { e.preventDefault(); onSelect(option.name, value) }}
              disabled={!isAvailable}
              aria-label={value}
              aria-pressed={isSelected}
              title={value}
              className={cn(
                'relative h-9 w-7 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-150',
                isSelected
                  ? 'border-text shadow-sm'
                  : 'border-transparent hover:border-border',
                !isAvailable && 'pointer-events-none opacity-35'
              )}
            >
              <Image
                src={variantImage.url}
                alt={value}
                fill
                className="object-cover"
                sizes="28px"
              />
            </button>
          )
        }

        // Text chip — minimum 36px tap target via py-2
        return (
          <button
            key={value}
            onClick={(e) => { e.preventDefault(); onSelect(option.name, value) }}
            disabled={!isAvailable}
            aria-pressed={isSelected}
            className={cn(
              'min-h-[36px] rounded-md border px-3 py-2 text-[11px] font-medium leading-none transition-all duration-150',
              isSelected
                ? 'border-text bg-text text-text-inverse'
                : 'border-border text-text-secondary hover:border-text-secondary',
              !isAvailable && 'pointer-events-none opacity-35 line-through'
            )}
          >
            {value}
          </button>
        )
      })}

      {remaining > 0 && (
        <span className="text-[11px] text-text-muted">+{remaining}</span>
      )}
    </div>
  )
}
