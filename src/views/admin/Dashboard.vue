<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '../../lib/supabase'

interface Stat {
  label: string
  value: string | number
  route?: string
}

interface Order {
  id: number
  user_id: string | null
  status: string | null
  total: number
  created_at: string | null
  customer: string
}

const stats = ref<Stat[]>([
  { label: 'Products', value: 0 },
  { label: 'Orders', value: 0 },
  { label: 'Revenue', value: '$0.00' },
  { label: 'Customers', value: 0 },
])

const recentOrders = ref<Order[]>([])

const loading = ref(true)
const errorMessage = ref('')

const loadDashboard = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    // -----------------------------
    // 1. Get products
    // -----------------------------
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, stock')

    if (productsError) {
      throw productsError
    }

    // -----------------------------
    // 2. Get orders
    // -----------------------------
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, user_id, status, total, created_at')
      .order('created_at', { ascending: false })

    if (ordersError) {
      throw ordersError
    }

    // -----------------------------
    // 3. Get customers
    // -----------------------------
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, role')

    if (profilesError) {
      throw profilesError
    }

    // -----------------------------
    // 4. Calculate statistics
    // -----------------------------
    const productCount = products?.length ?? 0

    const orderCount = orders?.length ?? 0

    const totalStock =
      products?.reduce((sum, product) => {
        return sum + (product.stock ?? 0)
      }, 0) ?? 0

    const customerCount =
      profiles?.filter(profile => profile.role === 'customer').length ?? 0

    /*const revenue =
      orders
        ?.filter(order => order.status !== 'cancelled')
        .reduce((sum, order) => {
          return sum + Number(order.total ?? 0)
        }, 0) ?? 0*/

    stats.value = [
      {
        label: 'Products',
        value: productCount,
        route: '/admin/products',
      },
      {
        label: 'Orders',
        value: orderCount,
        route: '/admin/orders',
      },
      {
        label: 'Stock',
        value: totalStock,
        route: '/admin/products',
      },
      {
        label: 'Customers',
        value: customerCount,
        route: '/admin/customers',
      },
    ]

    // -----------------------------
    // 5. Get recent orders
    // -----------------------------
    const profileMap = new Map(
      profiles?.map(profile => [
        profile.id,
        profile.full_name || 'Unknown customer',
      ])
    )

    recentOrders.value = (orders ?? [])
      .slice(0, 5)
      .map(order => ({
        id: order.id,
        user_id: order.user_id,
        status: order.status,
        total: Number(order.total ?? 0),
        created_at: order.created_at,
        customer: order.user_id
          ? profileMap.get(order.user_id) || 'Unknown customer'
          : 'Guest',
      }))
  } catch (error: any) {
    console.error('Dashboard error:', error)

    errorMessage.value =
      error?.message || 'Failed to load dashboard data.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboard()
})
</script>

<template>
  <section class="container admin-dashboard-page">

    <div class="page-heading">
      <div>
        <span class="eyebrow">Admin</span>
        <h1>Dashboard</h1>
      </div>

      <p class="page-copy">
        An overview of store performance and recent activity.
      </p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="table-card">
      Loading dashboard...
    </div>

    <!-- Error -->
    <div v-else-if="errorMessage" class="table-card">
      <p>{{ errorMessage }}</p>
    </div>

    <template v-else>

      <!-- Statistics -->
      <div class="admin-stats">
        <router-link
         v-for="item in stats"
        :key="item.label"
        :to="item.route || '#'"
        class="stat-card"
        :class="{ clickable: item.route }"
>
  <span>{{ item.label }}</span>
  <strong>{{ item.value }}</strong>
</router-link>
      </div>

      <!-- Recent orders -->
      <div class="table-card">

        <div class="table-card-header">
          <div>
            <h2>Recent orders</h2>
            <p>
              Track recent checkouts and order status.
            </p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>

            <tr
              v-for="order in recentOrders"
              :key="order.id"
            >
              <td>
                #{{ order.id }}
              </td>

              <td>
                {{ order.customer }}
              </td>

              <td>
                {{ order.status || 'Pending' }}
              </td>

              <td>
                ${{ order.total.toFixed(2) }}
              </td>
            </tr>

            <tr v-if="recentOrders.length === 0">
              <td colspan="4">
                No orders yet.
              </td>
            </tr>

          </tbody>
        </table>

      </div>

    </template>

  </section>
</template>