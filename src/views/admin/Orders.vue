<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '../../lib/supabase'

interface Order {
  id: number
  user_id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  shipping_address: string | null
  city: string | null
  postal_code: string | null
  country: string | null
  payment_method: string | null
  status: string
  total: number
  created_at: string
}

const orders = ref<Order[]>([])
const loading = ref(true)
const error = ref('')

const loadOrders = async () => {
  loading.value = true
  error.value = ''

  try {
    const { data, error: ordersError } = await supabase
      .from('orders')
      .select(`
        id,
        user_id,
        first_name,
        last_name,
        email,
        shipping_address,
        city,
        postal_code,
        country,
        payment_method,
        status,
        total,
        created_at
      `)
      .order('created_at', { ascending: false })

    if (ordersError) {
      throw ordersError
    }

    orders.value = (data ?? []).map(order => ({
      ...order,
      total: Number(order.total),
    }))
  } catch (err: any) {
    console.error('Error loading admin orders:', err)
    error.value = err?.message || 'Failed to load orders.'
  } finally {
    loading.value = false
  }
}

const updateStatus = async (order: Order) => {
  const { error: updateError } = await supabase
    .from('orders')
    .update({ status: order.status })
    .eq('id', order.id)

  if (updateError) {
    console.error('Error updating order:', updateError)
    error.value = updateError.message
    await loadOrders()
    return
  }

  console.log(`Order #${order.id} updated to ${order.status}`)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

onMounted(loadOrders)
</script>

<template>
  <section class="container admin-page">
    <div class="page-heading">
      <div>
        <span class="eyebrow">Admin</span>
        <h1>Order management</h1>
      </div>

      <p class="page-copy">
        Manage orders and review customer purchases.
      </p>
    </div>

    <p v-if="loading">
      Loading orders...
    </p>

    <p v-else-if="error">
      {{ error }}
    </p>

    <div v-else class="table-card">
      <div v-if="orders.length === 0" class="empty-state">
        <h2>No orders yet</h2>
        <p>Customer orders will appear here.</p>
      </div>

      <table v-else>
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Email</th>
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
            <td>#{{ order.id }}</td>

            <td>
              {{ order.first_name || '' }}
              {{ order.last_name || '' }}
            </td>

            <td>
              {{ order.email || '—' }}
            </td>

            <td>
              {{ formatDate(order.created_at) }}
            </td>

            <td>
              <select
                v-model="order.status"
                @change="updateStatus(order)"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </td>

            <td>
              ${{ order.total.toFixed(2) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>