import { commerceFetch } from './client'
import {
  PRODUCTS_QUERY,
  PRODUCT_QUERY,
  COLLECTION_QUERY,
  COLLECTIONS_QUERY,
} from './graphql/queries'
import {
  mapProductCard,
  mapProductDetail,
  mapCollection,
  mapCollectionSummary,
} from './mappers'
import type {
  ProductCard,
  ProductDetail,
  Collection,
  CollectionSummary,
  CollectionQueryParams,
  ProductsQueryParams,
} from './types'
import type { CommerceProvider } from './provider'

// Cache settings
const CATALOG_REVALIDATE = 60 // 1 minute for catalog data

// API implementation following the CommerceProvider interface
export const commerce: CommerceProvider = {
  async getProducts(params?: ProductsQueryParams): Promise<ProductCard[]> {
    const { first = 20, sortKey, reverse, query } = params ?? {}

    const data = await commerceFetch<{
      products: { edges: Array<{ node: unknown }> }
    }>(
      PRODUCTS_QUERY,
      {
        first,
        sortKey: sortKey ?? 'BEST_SELLING',
        reverse: reverse ?? false,
        query,
      },
      { revalidate: CATALOG_REVALIDATE }
    )

    return data.products.edges.map((edge) =>
      mapProductCard(edge.node as Parameters<typeof mapProductCard>[0])
    )
  },

  async getProduct(handle: string): Promise<ProductDetail | null> {
    const data = await commerceFetch<{
      product: unknown | null
    }>(
      PRODUCT_QUERY,
      { handle },
      { revalidate: CATALOG_REVALIDATE }
    )

    if (!data.product) return null

    return mapProductDetail(
      data.product as Parameters<typeof mapProductDetail>[0]
    )
  },

  async getCollection(params: CollectionQueryParams): Promise<Collection | null> {
    const { handle, first = 50, sortKey, reverse } = params

    const data = await commerceFetch<{
      collection: unknown | null
    }>(
      COLLECTION_QUERY,
      {
        handle,
        first,
        sortKey: sortKey ?? 'BEST_SELLING',
        reverse: reverse ?? false,
      },
      { revalidate: CATALOG_REVALIDATE }
    )

    if (!data.collection) return null

    return mapCollection(
      data.collection as Parameters<typeof mapCollection>[0]
    )
  },

  async getCollections(): Promise<CollectionSummary[]> {
    const data = await commerceFetch<{
      collections: { edges: Array<{ node: unknown }> }
    }>(
      COLLECTIONS_QUERY,
      { first: 20 },
      { revalidate: CATALOG_REVALIDATE }
    )

    return data.collections.edges.map((edge) =>
      mapCollectionSummary(edge.node as Parameters<typeof mapCollectionSummary>[0])
    )
  },
}
