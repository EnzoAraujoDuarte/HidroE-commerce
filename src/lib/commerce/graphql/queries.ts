import {
  PRODUCT_CARD_FRAGMENT,
  PRODUCT_DETAIL_FRAGMENT,
  COLLECTION_SUMMARY_FRAGMENT,
} from './fragments'

export const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($first: Int!, $sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
    products(first: $first, sortKey: $sortKey, reverse: $reverse, query: $query) {
      edges {
        node {
          ...ProductCardFragment
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`

export const PRODUCT_QUERY = /* GraphQL */ `
  query Product($handle: String!) {
    product(handle: $handle) {
      ...ProductDetailFragment
    }
  }
  ${PRODUCT_DETAIL_FRAGMENT}
`

export const COLLECTION_QUERY = /* GraphQL */ `
  query Collection($handle: String!, $first: Int!, $sortKey: ProductCollectionSortKeys, $reverse: Boolean) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        url
        altText
        width
        height
      }
      products(first: $first, sortKey: $sortKey, reverse: $reverse) {
        edges {
          node {
            ...ProductCardFragment
          }
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`

export const COLLECTIONS_QUERY = /* GraphQL */ `
  query Collections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          ...CollectionSummaryFragment
        }
      }
    }
  }
  ${COLLECTION_SUMMARY_FRAGMENT}
`
