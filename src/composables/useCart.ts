import { computed, ref } from 'vue'
import type { Product } from '../types/product'

export interface CartItem {
  product: Product
  quantity: number
}

const STORAGE_KEY = 'novastore-cart'

const loadCart = (): CartItem[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const cartItems = ref<CartItem[]>(loadCart())

const saveCart = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems.value))
}

export function useCart() {
  const addToCart = (product: Product, quantity = 1) => {
    const existing = cartItems.value.find(
      item => item.product.id === product.id
    )

    if (existing) {
      existing.quantity = Math.min(
        existing.quantity + quantity,
        product.stock
      )
    } else {
      cartItems.value.push({
        product,
        quantity: Math.min(quantity, product.stock),
      })
    }

    saveCart()
  }

  const removeFromCart = (productId: number) => {
    cartItems.value = cartItems.value.filter(
      item => item.product.id !== productId
    )

    saveCart()
  }

  const updateQuantity = (productId: number, quantity: number) => {
    const item = cartItems.value.find(
      item => item.product.id === productId
    )

    if (!item) return

    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    item.quantity = Math.min(quantity, item.product.stock)

    saveCart()
  }

  const clearCart = () => {
    cartItems.value = []
    saveCart()
  }

  const itemCount = computed(() =>
    cartItems.value.reduce(
      (total, item) => total + item.quantity,
      0
    )
  )

  const subtotal = computed(() =>
    cartItems.value.reduce(
      (total, item) =>
        total + item.product.price * item.quantity,
      0
    )
  )

  const shipping = computed(() =>
    cartItems.value.length > 0 ? 12 : 0
  )

  const total = computed(() =>
    subtotal.value + shipping.value
  )

  return {
    cartItems,
    itemCount,
    subtotal,
    shipping,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }
}