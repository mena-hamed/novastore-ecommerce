```vue
<script setup lang="ts">
import { useCart } from '../composables/useCart'
import CartItem from '../components/CartItem.vue'

const {
  cartItems,
  subtotal,
  shipping,
  total,
  updateQuantity,
  removeFromCart,
} = useCart()

const handleQuantityUpdate = (payload: {
  id: number
  quantity: number
}) => {
  console.log('CART UPDATE RECEIVED:', payload)

  updateQuantity(payload.id, payload.quantity)
}

const handleRemove = (id: number) => {
  removeFromCart(id)
}
</script>

<template>
  <section class="container cart-page">

    <div class="page-heading">
      <div>
        <span class="eyebrow">Cart</span>
        <h1>Your bag</h1>
      </div>

      <p class="page-copy">
        Review items, change quantities, or continue to checkout.
      </p>
    </div>

    <div v-if="cartItems.length" class="cart-layout">

      <div class="cart-list">

        <CartItem
          v-for="item in cartItems"
          :key="item.product.id"
          :product="item.product"
          :quantity="item.quantity"
          @remove="handleRemove"
          @update-quantity="handleQuantityUpdate"
        />

      </div>

      <aside class="cart-summary">

        <div class="summary-card">

          <h2>Order summary</h2>

          <div class="summary-row">
            <span>Subtotal</span>
            <strong>${{ subtotal.toFixed(2) }}</strong>
          </div>

          <div class="summary-row">
            <span>Shipping</span>
            <strong>${{ shipping.toFixed(2) }}</strong>
          </div>

          <div class="summary-row total-row">
            <span>Total</span>
            <strong>${{ total.toFixed(2) }}</strong>
          </div>

          <router-link
            to="/checkout"
            class="button full-width"
          >
            Proceed to checkout
          </router-link>

        </div>

      </aside>

    </div>

    <div v-else class="empty-state">

      <h2>Your cart is empty</h2>

      <p>Add products to start your order.</p>

      <router-link
        to="/products"
        class="button"
      >
        Shop products
      </router-link>

    </div>

  </section>
</template>
```
