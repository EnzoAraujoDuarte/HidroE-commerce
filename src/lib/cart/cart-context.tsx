'use client'

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import {
  createCart,
  addToCart as addToCartAPI,
  updateCartLine as updateCartLineAPI,
  removeFromCart as removeFromCartAPI,
  getCart,
  type Cart,
} from '@/lib/commerce'

const CART_ID_KEY = 'hydrogen-cart-id'

interface CartState {
  cart: Cart | null
  isOpen: boolean
  isLoading: boolean
  error: string | null
}

type CartAction =
  | { type: 'SET_CART'; cart: Cart | null }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'TOGGLE_CART' }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, cart: action.cart, isLoading: false, error: null }
    case 'SET_LOADING':
      return { ...state, isLoading: action.isLoading }
    case 'SET_ERROR':
      return { ...state, error: action.error, isLoading: false }
    case 'OPEN_CART':
      return { ...state, isOpen: true }
    case 'CLOSE_CART':
      return { ...state, isOpen: false }
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }
    default:
      return state
  }
}

interface CartContextValue extends CartState {
  addItem: (variantId: string, quantity?: number) => Promise<void>
  updateItem: (lineId: string, quantity: number) => Promise<void>
  removeItem: (lineId: string) => Promise<void>
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    cart: null,
    isOpen: false,
    isLoading: false,
    error: null,
  })

  useEffect(() => {
    const cartId = localStorage.getItem(CART_ID_KEY)
    if (cartId) {
      getCart(cartId)
        .then((cart) => {
          if (cart) {
            dispatch({ type: 'SET_CART', cart })
          } else {
            localStorage.removeItem(CART_ID_KEY)
          }
        })
        .catch(() => localStorage.removeItem(CART_ID_KEY))
    }
  }, [])

  const addItem = useCallback(
    async (variantId: string, quantity: number = 1) => {
      dispatch({ type: 'SET_LOADING', isLoading: true })
      dispatch({ type: 'SET_ERROR', error: null })

      try {
        let cart: Cart

        if (state.cart?.id) {
          cart = await addToCartAPI(state.cart.id, variantId, quantity)
        } else {
          cart = await createCart(variantId, quantity)
          localStorage.setItem(CART_ID_KEY, cart.id)
        }

        dispatch({ type: 'SET_CART', cart })
        dispatch({ type: 'OPEN_CART' })
      } catch (err) {
        dispatch({
          type: 'SET_ERROR',
          error: err instanceof Error ? err.message : 'Failed to add item',
        })
      }
    },
    [state.cart?.id]
  )

  const updateItem = useCallback(
    async (lineId: string, quantity: number) => {
      if (!state.cart?.id) return

      dispatch({ type: 'SET_LOADING', isLoading: true })

      try {
        const cart = await updateCartLineAPI(state.cart.id, lineId, quantity)
        dispatch({ type: 'SET_CART', cart })
      } catch (err) {
        dispatch({
          type: 'SET_ERROR',
          error: err instanceof Error ? err.message : 'Failed to update item',
        })
      }
    },
    [state.cart?.id]
  )

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!state.cart?.id) return

      dispatch({ type: 'SET_LOADING', isLoading: true })

      try {
        const cart = await removeFromCartAPI(state.cart.id, lineId)
        dispatch({ type: 'SET_CART', cart })
      } catch (err) {
        dispatch({
          type: 'SET_ERROR',
          error: err instanceof Error ? err.message : 'Failed to remove item',
        })
      }
    },
    [state.cart?.id]
  )

  const openCart = useCallback(() => dispatch({ type: 'OPEN_CART' }), [])
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE_CART' }), [])
  const toggleCart = useCallback(() => dispatch({ type: 'TOGGLE_CART' }), [])

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        updateItem,
        removeItem,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
