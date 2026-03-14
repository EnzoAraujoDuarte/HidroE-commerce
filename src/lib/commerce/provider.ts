import type {
  Collection,
  CollectionSummary,
  ProductCard,
  ProductDetail,
  CollectionQueryParams,
  ProductsQueryParams,
} from './types'

// Commerce provider interface - allows swapping between Mock.shop, Shopify, etc.
export interface CommerceProvider {
  // Catalog queries
  getProducts(params?: ProductsQueryParams): Promise<ProductCard[]>
  getProduct(handle: string): Promise<ProductDetail | null>
  getCollection(params: CollectionQueryParams): Promise<Collection | null>
  getCollections(): Promise<CollectionSummary[]>
}

// Error types
export class CommerceError extends Error {
  constructor(
    message: string,
    public code: 'NETWORK' | 'NOT_FOUND' | 'INVALID_QUERY' | 'UNKNOWN'
  ) {
    super(message)
    this.name = 'CommerceError'
  }
}
