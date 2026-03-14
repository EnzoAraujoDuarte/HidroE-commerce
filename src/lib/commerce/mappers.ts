import type {
  Money,
  ProductImage,
  ProductCard,
  ProductDetail,
  ProductVariant,
  ProductOption,
  CollectionSummary,
  Collection,
} from './types'
import { buildMaterialProfile } from './materials'

// Raw types from GraphQL response (Shopify/Mock.shop schema)
interface RawMoney {
  amount: string
  currencyCode: string
}

interface RawImage {
  url: string
  altText: string | null
  width?: number
  height?: number
}

interface RawVariant {
  id: string
  title: string
  availableForSale: boolean
  price: RawMoney
  compareAtPrice?: RawMoney
  selectedOptions: Array<{ name: string; value: string }>
  image?: RawImage
}

interface RawProduct {
  id: string
  handle: string
  title: string
  vendor?: string
  description?: string
  descriptionHtml?: string
  availableForSale: boolean
  tags?: string[]
  featuredImage?: RawImage
  images: {
    edges: Array<{ node: RawImage }>
  }
  priceRange: {
    minVariantPrice: RawMoney
  }
  compareAtPriceRange?: {
    minVariantPrice: RawMoney
  }
  options?: Array<{
    id: string
    name: string
    values: string[]
  }>
  variants?: {
    edges: Array<{
      node: RawVariant
    }>
  }
}

interface RawCollection {
  id: string
  handle: string
  title: string
  description?: string
  image?: RawImage
  products?: {
    edges: Array<{ node: RawProduct }>
  }
}

// Mappers
export function mapMoney(raw: RawMoney): Money {
  return {
    amount: raw.amount,
    currencyCode: raw.currencyCode,
  }
}

export function mapImage(raw: RawImage | null | undefined): ProductImage {
  return {
    url: raw?.url ?? '/placeholder.jpg',
    altText: raw?.altText ?? '',
    width: raw?.width,
    height: raw?.height,
  }
}

export function mapProductCard(raw: RawProduct): ProductCard {
  const images = raw.images.edges.map((e) => mapImage(e.node))
  const hasCompareAtPrice =
    raw.compareAtPriceRange?.minVariantPrice &&
    parseFloat(raw.compareAtPriceRange.minVariantPrice.amount) >
      parseFloat(raw.priceRange.minVariantPrice.amount)

  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    vendor: raw.vendor,
    price: mapMoney(raw.priceRange.minVariantPrice),
    compareAtPrice: hasCompareAtPrice
      ? mapMoney(raw.compareAtPriceRange!.minVariantPrice)
      : undefined,
    image: images[0] ?? mapImage(raw.featuredImage),
    hoverImage: images[1],
    availableForSale: raw.availableForSale,
  }
}

export function mapProductVariant(raw: RawVariant): ProductVariant {
  return {
    id: raw.id,
    title: raw.title,
    price: mapMoney(raw.price),
    compareAtPrice: raw.compareAtPrice ? mapMoney(raw.compareAtPrice) : undefined,
    availableForSale: raw.availableForSale,
    selectedOptions: raw.selectedOptions,
    image: raw.image ? mapImage(raw.image) : undefined,
  }
}

export function mapProductOption(raw: {
  id: string
  name: string
  values: string[]
}): ProductOption {
  return {
    id: raw.id,
    name: raw.name,
    values: raw.values,
  }
}

export function mapProductDetail(raw: RawProduct): ProductDetail {
  const card = mapProductCard(raw)
  const images = raw.images.edges.map((e) => mapImage(e.node))
  const variants = raw.variants?.edges.map((e) => mapProductVariant(e.node)) ?? []
  const options = raw.options?.map(mapProductOption) ?? []

  return {
    ...card,
    description: raw.description ?? '',
    descriptionHtml: raw.descriptionHtml,
    images,
    variants,
    options,
    tags: raw.tags ?? [],
    materialProfile: buildMaterialProfile({
      description: raw.description,
      descriptionHtml: raw.descriptionHtml,
      tags: raw.tags,
    }),
  }
}

export function mapCollectionSummary(raw: RawCollection): CollectionSummary {
  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    description: raw.description,
    image: raw.image ? mapImage(raw.image) : undefined,
  }
}

export function mapCollection(raw: RawCollection): Collection {
  const summary = mapCollectionSummary(raw)
  const products = raw.products?.edges.map((e) => mapProductCard(e.node)) ?? []

  return {
    ...summary,
    products,
    productsCount: products.length,
  }
}
