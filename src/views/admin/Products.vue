<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '../../lib/supabase'

interface Product {
  id: number
  name: string
  price: number
  stock: number
  category: {
    name: string
  } | null
}

const products = ref<Product[]>([])
const loading = ref(true)
const errorMessage = ref('')
const deletingId = ref<number | null>(null)

const loadProducts = async () => {
  loading.value = true
  errorMessage.value = ''

  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      price,
      stock,
      category:categories (
        name
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error loading products:', error)
    errorMessage.value = error.message
    loading.value = false
    return
  }

  products.value = (data ?? []).map(product => ({
  id: Number(product.id),
  name: product.name,
  price: Number(product.price),
  stock: Number(product.stock),
  category: Array.isArray(product.category)
    ? product.category[0] ?? null
    : product.category ?? null,
}))
  loading.value = false
}

const deleteProduct = async (id: number) => {
  const confirmed = window.confirm(
    'Are you sure you want to delete this product?'
  )

  if (!confirmed) return

  deletingId.value = id

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting product:', error)
    errorMessage.value = error.message
    deletingId.value = null
    return
  }

  products.value = products.value.filter(
    product => product.id !== id
  )

  deletingId.value = null
}

onMounted(() => {
  loadProducts()
})
</script>

<template>
  <section class="container admin-page">

    <div class="page-heading">
      <div>
        <span class="eyebrow">Admin</span>
        <h1>Product management</h1>
      </div>

      <p class="page-copy">
        View and manage products in the storefront catalog.
      </p>
    </div>

    <div class="table-card admin-table-card">

      <div class="table-card-header">
        <div>
          <h2>Products</h2>
          <p>
            Manage your store catalog and inventory.
          </p>
        </div>

        <router-link
          class="button"
          to="/admin/products/add"
        >
          Add product
        </router-link>
      </div>

      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <div v-if="loading">
        Loading products...
      </div>

      <table v-else>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          <tr
            v-for="product in products"
            :key="product.id"
          >
            <td>
              {{ product.name }}
            </td>

            <td>
              {{ product.category?.name || 'Uncategorized' }}
            </td>

            <td>
              {{ product.stock }}
            </td>

            <td>
              ${{ Number(product.price).toFixed(2) }}
            </td>

            <td class="actions-cell">

              <router-link
                class="text-link"
                :to="`/admin/products/edit/${product.id}`"
              >
                Edit
              </router-link>

              <button
                class="text-button"
                type="button"
                :disabled="deletingId === product.id"
                @click="deleteProduct(product.id)"
              >
                {{
                  deletingId === product.id
                    ? 'Deleting...'
                    : 'Delete'
                }}
              </button>

            </td>
          </tr>

          <tr v-if="products.length === 0">
            <td colspan="5">
              No products found.
            </td>
          </tr>

        </tbody>
      </table>

    </div>
  </section>
</template>