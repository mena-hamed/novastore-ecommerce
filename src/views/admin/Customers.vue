<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '../../lib/supabase'

interface Customer {
  id: string
  full_name: string | null
  role: string | null
  created_at: string | null
}

const customers = ref<Customer[]>([])
const loading = ref(true)
const errorMessage = ref('')

const loadCustomers = async () => {
  loading.value = true
  errorMessage.value = ''

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, created_at')
    .eq('role', 'customer')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error loading customers:', error)
    errorMessage.value = error.message
    loading.value = false
    return
  }

  customers.value = data ?? []
  loading.value = false
}

const formatDate = (date: string | null) => {
  if (!date) return '—'

  return new Date(date).toLocaleDateString()
}

onMounted(() => {
  loadCustomers()
})
</script>

<template>
  <section class="container admin-page">

    <div class="page-heading">
      <div>
        <span class="eyebrow">Admin</span>
        <h1>Customer management</h1>
      </div>

      <p class="page-copy">
        View registered customers and their account information.
      </p>
    </div>

    <div class="table-card admin-table-card">

      <div class="table-card-header">
        <div>
          <h2>Customers</h2>
          <p>
            {{ customers.length }} registered customer<span
              v-if="customers.length !== 1"
            >s</span>.
          </p>
        </div>
      </div>

      <p
        v-if="errorMessage"
        class="error-message"
      >
        {{ errorMessage }}
      </p>

      <div v-if="loading">
        Loading customers...
      </div>

      <table v-else>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Joined</th>
          </tr>
        </thead>

        <tbody>

          <tr
            v-for="customer in customers"
            :key="customer.id"
          >
            <td>
              {{ customer.full_name || 'Unnamed customer' }}
            </td>

            <td>
              {{ customer.role }}
            </td>

            <td>
              {{ formatDate(customer.created_at) }}
            </td>
          </tr>

          <tr v-if="customers.length === 0">
            <td colspan="3">
              No customers found.
            </td>
          </tr>

        </tbody>
      </table>

    </div>

  </section>
</template>