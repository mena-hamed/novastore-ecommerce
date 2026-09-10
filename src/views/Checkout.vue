<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { useCart } from '../composables/useCart'

const router = useRouter()

const {
  cartItems,
  subtotal,
  shipping,
  total,
  clearCart,
} = useCart()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const address = ref('')
const city = ref('')
const postal = ref('')
const country = ref('')
const paymentMethod = ref('Credit card')

const placingOrder = ref(false)
const errorMessage = ref('')

const orderSummary = computed(() => cartItems.value)

const placeOrder = async () => {
  errorMessage.value = ''

  if (!cartItems.value.length) {
    errorMessage.value = 'Your cart is empty.'
    return
  }

  placingOrder.value = true

  try {
    // 1. Get the currently logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      throw userError
    }

    if (!user) {
      errorMessage.value = 'You must be logged in to place an order.'
      router.push('/login')
      return
    }

    // 2. Prepare the cart items for Supabase
    const items = cartItems.value.map(item => ({
      product_id: Number(item.product.id),
      quantity: item.quantity,
    }))

    // 3. Create the order through the database function
    const { data: orderId, error: orderError } = await supabase.rpc(
      'create_order',
      {
        p_user_id: user.id,
        p_first_name: firstName.value,
        p_last_name: lastName.value,
        p_email: email.value,
        p_shipping_address: address.value,
        p_city: city.value,
        p_postal_code: postal.value,
        p_country: country.value,
        p_payment_method: paymentMethod.value,
        p_items: items,
      }
    )

    if (orderError) {
      throw orderError
    }

    console.log('ORDER CREATED:', orderId)

    // 4. Clear the cart
    clearCart()

    // 5. Go to customer orders
    router.push('/orders')

  } catch (error: any) {
  console.error('FULL ORDER ERROR:', error)

  errorMessage.value =
    error?.message ||
    error?.details ||
    error?.hint ||
    'Something went wrong while placing your order.'
   } finally {
    placingOrder.value = false
  }
}
</script>

<template>
  <section class="container checkout-page">

    <div class="page-heading">
      <div>
        <span class="eyebrow">Checkout</span>
        <h1>Customer information</h1>
      </div>

      <p class="page-copy">
        Fill out your shipping details and place your order.
      </p>
    </div>

    <div
      v-if="errorMessage"
      class="error-message"
    >
      {{ errorMessage }}
    </div>

    <div
      v-if="!cartItems.length"
      class="empty-state"
    >
      <h2>Your cart is empty</h2>

      <p>
        Add products before checking out.
      </p>

      <router-link
        to="/products"
        class="button"
      >
        Shop products
      </router-link>
    </div>

    <div
      v-else
      class="checkout-layout"
    >

      <form
        class="checkout-form"
        @submit.prevent="placeOrder"
      >

        <div class="form-group">
          <label>First name</label>
          <input
            v-model="firstName"
            placeholder="Jane"
            required
          />
        </div>

        <div class="form-group">
          <label>Last name</label>
          <input
            v-model="lastName"
            placeholder="Doe"
            required
          />
        </div>

        <div class="form-group full-width">
          <label>Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="jane@example.com"
            required
          />
        </div>

        <div class="form-group full-width">
          <label>Shipping address</label>
          <input
            v-model="address"
            placeholder="123 Main Street"
            required
          />
        </div>

        <div class="form-row">

          <div class="form-group">
            <label>City</label>
            <input
              v-model="city"
              required
            />
          </div>

          <div class="form-group">
            <label>Postal code</label>
            <input
              v-model="postal"
              required
            />
          </div>

        </div>

        <div class="form-group full-width">
          <label>Country</label>
          <input
            v-model="country"
            placeholder="United States"
            required
          />
        </div>

        <div class="form-group full-width">
          <label>Payment method</label>

          <select v-model="paymentMethod">
            <option>Credit card</option>
            <option>PayPal</option>
            <option>Apple Pay</option>
          </select>
        </div>

        <button
          class="button full-width"
          type="submit"
          :disabled="placingOrder"
        >
          {{ placingOrder ? 'Placing order...' : 'Place order' }}
        </button>

      </form>

      <aside class="checkout-summary">

        <div class="summary-card">

          <h2>Order summary</h2>

          <div
            v-for="item in orderSummary"
            :key="item.product.id"
            class="summary-row"
          >
            <span>
              {{ item.product.name }}
              × {{ item.quantity }}
            </span>

            <strong>
              ${{ (item.product.price * item.quantity).toFixed(2) }}
            </strong>
          </div>

          <div class="summary-row">
            <span>Subtotal</span>
            <strong>
              ${{ subtotal.toFixed(2) }}
            </strong>
          </div>

          <div class="summary-row">
            <span>Shipping</span>
            <strong>
              ${{ shipping.toFixed(2) }}
            </strong>
          </div>

          <div class="summary-row total-row">
            <span>Total</span>
            <strong>
              ${{ total.toFixed(2) }}
            </strong>
          </div>

        </div>

      </aside>

    </div>

  </section>
</template>