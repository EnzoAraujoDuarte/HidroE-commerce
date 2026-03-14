import { commerceFetch } from './client'
import {
  CREATE_CART_MUTATION,
  ADD_TO_CART_MUTATION,
  UPDATE_CART_MUTATION,
  REMOVE_FROM_CART_MUTATION,
  GET_CART_QUERY,
} from './graphql/mutations'
import type { Cart, CartLine, Money, ProductImage } from './types'

interface RawCartLine {
  id: string
  quantity: number
  cost: { totalAmount: { amount: string; currencyCode: string } }
  merchandise: {
    id: string
    title: string
    selectedOptions: Array<{ name: string; value: string }>
    image?: { url: string; altText: string | null }
    price: { amount: string; currencyCode: string }
    product: { id: string; handle: string; title: string; vendor?: string }
  }
}

interface RawCart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: { subtotalAmount: { amount: string; currencyCode: string } }
  lines: { edges: Array<{ node: RawCartLine }> }
}

function mapCart(raw: RawCart): Cart {
  return {
    id: raw.id,
    checkoutUrl: raw.checkoutUrl,
    totalQuantity: raw.totalQuantity,
    subtotal: {
      amount: raw.cost.subtotalAmount.amount,
      currencyCode: raw.cost.subtotalAmount.currencyCode,
    },
    lines: raw.lines.edges.map((edge) => mapCartLine(edge.node)),
  }
}

function mapCartLine(raw: RawCartLine): CartLine {
  return {
    id: raw.id,
    quantity: raw.quantity,
    totalPrice: {
      amount: raw.cost.totalAmount.amount,
      currencyCode: raw.cost.totalAmount.currencyCode,
    },
    product: {
      id: raw.merchandise.product.id,
      handle: raw.merchandise.product.handle,
      title: raw.merchandise.product.title,
      vendor: raw.merchandise.product.vendor,
      price: raw.merchandise.price as Money,
      image: {
        url: raw.merchandise.image?.url ?? '/placeholder.jpg',
        altText: raw.merchandise.image?.altText ?? '',
      } as ProductImage,
      availableForSale: true,
    },
    variant: {
      id: raw.merchandise.id,
      title: raw.merchandise.title,
      price: raw.merchandise.price as Money,
      availableForSale: true,
      selectedOptions: raw.merchandise.selectedOptions,
    },
  }
}

export async function createCart(variantId: string, quantity: number = 1): Promise<Cart> {
  const data = await commerceFetch<{
    cartCreate: { cart: RawCart; userErrors: Array<{ message: string }> }
  }>(
    CREATE_CART_MUTATION,
    { input: { lines: [{ merchandiseId: variantId, quantity }] } },
    { cache: 'no-store' }
  )

  if (data.cartCreate.userErrors.length) {
    throw new Error(data.cartCreate.userErrors[0].message)
  }

  return mapCart(data.cartCreate.cart)
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await commerceFetch<{ cart: RawCart | null }>(
    GET_CART_QUERY,
    { cartId },
    { cache: 'no-store' }
  )

  return data.cart ? mapCart(data.cart) : null
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number = 1
): Promise<Cart> {
  const data = await commerceFetch<{
    cartLinesAdd: { cart: RawCart; userErrors: Array<{ message: string }> }
  }>(
    ADD_TO_CART_MUTATION,
    { cartId, lines: [{ merchandiseId: variantId, quantity }] },
    { cache: 'no-store' }
  )

  if (data.cartLinesAdd.userErrors.length) {
    throw new Error(data.cartLinesAdd.userErrors[0].message)
  }

  return mapCart(data.cartLinesAdd.cart)
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<Cart> {
  const data = await commerceFetch<{
    cartLinesUpdate: { cart: RawCart; userErrors: Array<{ message: string }> }
  }>(
    UPDATE_CART_MUTATION,
    { cartId, lines: [{ id: lineId, quantity }] },
    { cache: 'no-store' }
  )

  if (data.cartLinesUpdate.userErrors.length) {
    throw new Error(data.cartLinesUpdate.userErrors[0].message)
  }

  return mapCart(data.cartLinesUpdate.cart)
}

export async function removeFromCart(cartId: string, lineId: string): Promise<Cart> {
  const data = await commerceFetch<{
    cartLinesRemove: { cart: RawCart; userErrors: Array<{ message: string }> }
  }>(
    REMOVE_FROM_CART_MUTATION,
    { cartId, lineIds: [lineId] },
    { cache: 'no-store' }
  )

  if (data.cartLinesRemove.userErrors.length) {
    throw new Error(data.cartLinesRemove.userErrors[0].message)
  }

  return mapCart(data.cartLinesRemove.cart)
}
