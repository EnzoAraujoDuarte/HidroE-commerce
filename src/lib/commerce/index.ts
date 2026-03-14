export { commerce } from './api'
export { CommerceError } from './provider'
export { resolveCommerce } from './safe'
export {
  createCart,
  getCart,
  addToCart,
  updateCartLine,
  removeFromCart,
} from './cart'
export type { CommerceProvider } from './provider'
export type {
  Money,
  ProductImage,
  ProductCard,
  ProductDetail,
  ProductMaterialProfile,
  ProductVariant,
  ProductOption,
  SelectedOption,
  CollectionSummary,
  Collection,
  Cart,
  CartLine,
  CollectionQueryParams,
  ProductsQueryParams,
} from './types'

export function formatPrice(money: { amount: string; currencyCode: string }): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: money.currencyCode,
  }).format(parseFloat(money.amount))
}
