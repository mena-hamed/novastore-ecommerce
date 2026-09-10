<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '../lib/supabase'

interface Order {
  id: string
  orderNumber: number
  created_at: string
  status: string
  total: number
}

const orders = ref<Order[]>([])
const loading = ref(true)
const error = ref('')

const loadOrders = async () => {
  loading.value = true
  error.value = ''

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      throw userError
    }

    if (!user) {
      error.value = 'Please log in to view your orders.'
      return
    }

    const { data, error: ordersError } = await supabase
      .from('orders')
      .select('id, created_at, status, total')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (ordersError) {
      throw ordersError
    }

    const customerOrders = (data ?? []).map((order, index) => ({
  id: order.id,
  orderNumber: index + 1,
  created_at: order.created_at,
  status: order.status,
  total: Number(order.total),
}))

orders.value = customerOrders.reverse()

orders.value = customerOrders
  } catch (err: any) {
    console.error('Error loading orders:', err)
    error.value = err?.message || 'Failed to load orders.'
  } finally {
    loading.value = false
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

onMounted(loadOrders)
</script>

<template>
  <section class="container orders-page">

    <div class="page-heading">
      <div>
        <span class="eyebrow">Orders</span>
        <h1>Your orders</h1>
      </div>

      <p class="page-copy">
        Review recent orders or check details for each purchase.
      </p>
    </div>

    <p v-if="loading">
      Loading your orders...
    </p>

    <p v-else-if="error">
      {{ error }}
    </p>

    <div
      v-else-if="orders.length"
      class="table-card"
    >
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Date</th>
            <th>Status</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="order in orders"
            :key="order.id"
          >
            <td>#{{ order.orderNumber }}</td>

            <td>
              {{ formatDate(order.created_at) }}
            </td>

            <td>
              {{ order.status }}
            </td>

            <td>
              ${{ order.total.toFixed(2) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-else
      class="empty-state"
    >
      <h2>No orders yet</h2>

      <p>
        Your completed purchases will appear here.
      </p>

      <router-link
        to="/products"
        class="button"
      >
        Shop products
      </router-link>
    </div>

  </section>
</template>