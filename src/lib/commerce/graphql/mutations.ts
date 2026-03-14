import { MONEY_FRAGMENT, IMAGE_FRAGMENT } from './fragments'

export const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        ...MoneyFragment
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              ...MoneyFragment
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              image {
                ...ImageFragment
              }
              price {
                ...MoneyFragment
              }
              product {
                id
                handle
                title
                vendor
              }
            }
          }
        }
      }
    }
  }
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
`

export const CREATE_CART_MUTATION = /* GraphQL */ `
  mutation CreateCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`

export const ADD_TO_CART_MUTATION = /* GraphQL */ `
  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`

export const UPDATE_CART_MUTATION = /* GraphQL */ `
  mutation UpdateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`

export const REMOVE_FROM_CART_MUTATION = /* GraphQL */ `
  mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`

export const GET_CART_QUERY = /* GraphQL */ `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFragment
    }
  }
  ${CART_FRAGMENT}
`
