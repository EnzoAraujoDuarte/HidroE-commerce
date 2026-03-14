// GraphQL fragments for Shopify Storefront API / Mock.shop
// These fragments define the data shape for each surface

export const MONEY_FRAGMENT = /* GraphQL */ `
  fragment MoneyFragment on MoneyV2 {
    amount
    currencyCode
  }
`

export const IMAGE_FRAGMENT = /* GraphQL */ `
  fragment ImageFragment on Image {
    url
    altText
    width
    height
  }
`

export const PRODUCT_CARD_FRAGMENT = /* GraphQL */ `
  fragment ProductCardFragment on Product {
    id
    handle
    title
    vendor
    availableForSale
    featuredImage {
      ...ImageFragment
    }
    images(first: 2) {
      edges {
        node {
          ...ImageFragment
        }
      }
    }
    priceRange {
      minVariantPrice {
        ...MoneyFragment
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyFragment
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
`

export const PRODUCT_DETAIL_FRAGMENT = /* GraphQL */ `
  fragment ProductDetailFragment on Product {
    id
    handle
    title
    vendor
    description
    descriptionHtml
    availableForSale
    tags
    featuredImage {
      ...ImageFragment
    }
    images(first: 10) {
      edges {
        node {
          ...ImageFragment
        }
      }
    }
    priceRange {
      minVariantPrice {
        ...MoneyFragment
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyFragment
      }
    }
    options {
      id
      name
      values
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          price {
            ...MoneyFragment
          }
          compareAtPrice {
            ...MoneyFragment
          }
          selectedOptions {
            name
            value
          }
          image {
            ...ImageFragment
          }
        }
      }
    }
  }
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
`

export const COLLECTION_SUMMARY_FRAGMENT = /* GraphQL */ `
  fragment CollectionSummaryFragment on Collection {
    id
    handle
    title
    description
    image {
      ...ImageFragment
    }
  }
  ${IMAGE_FRAGMENT}
`
