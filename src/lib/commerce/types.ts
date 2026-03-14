// Domain models oriented to UI consumption
// These types are provider-agnostic and represent what the interface needs

export interface Money {
  amount: string
  currencyCode: string
}

export interface ProductImage {
  url: string
  altText: string
  width?: number
  height?: number
}

export interface ProductCard {
  id: string
  handle: string
  title: string
  vendor?: string
  price: Money
  compareAtPrice?: Money
  image: ProductImage
  hoverImage?: ProductImage
  availableForSale: boolean
}

export interface ProductMaterialProfile {
  composition: string[]
  notes: string[]
  source: 'description' | 'tags' | 'description+tags'
}

export interface ProductDetail extends ProductCard {
  description: string
  descriptionHtml?: string
  images: ProductImage[]
  variants: ProductVariant[]
  options: ProductOption[]
  tags: string[]
  materialProfile: ProductMaterialProfile | null
}

export interface ProductVariant {
  id: string
  title: string
  price: Money
  compareAtPrice?: Money
  availableForSale: boolean
  selectedOptions: SelectedOption[]
  image?: ProductImage
}

export interface ProductOption {
  id: string
  name: string
  values: string[]
}

export interface SelectedOption {
  name: string
  value: string
}

export interface CollectionSummary {
  id: string
  handle: string
  title: string
  description?: string
  image?: ProductImage
}

export interface Collection extends CollectionSummary {
  products: ProductCard[]
  productsCount: number
}

// Cart types (prepared for future use)
export interface CartLine {
  id: string
  quantity: number
  product: ProductCard
  variant: ProductVariant
  totalPrice: Money
}

export interface Cart {
  id: string
  lines: CartLine[]
  totalQuantity: number
  subtotal: Money
  checkoutUrl: string
}

// Query params
export interface CollectionQueryParams {
  handle: string
  first?: number
  sortKey?: 'TITLE' | 'PRICE' | 'CREATED' | 'BEST_SELLING'
  reverse?: boolean
}

export interface ProductsQueryParams {
  first?: number
  query?: string
  sortKey?: 'TITLE' | 'PRICE' | 'CREATED' | 'BEST_SELLING'
  reverse?: boolean
}
