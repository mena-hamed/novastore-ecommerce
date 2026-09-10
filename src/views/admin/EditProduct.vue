<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../../lib/supabase'

interface Category {
  id: number
  name: string
}

const route = useRoute()
const router = useRouter()

const productId = Number(route.params.id)

const name = ref('')
const categoryId = ref<number | null>(null)
const price = ref(0)
const stock = ref(0)
const description = ref('')
const imageUrl = ref('')

const categories = ref<Category[]>([])

const loading = ref(true)
const saving = ref(false)
const errorMessage = ref('')

const loadCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  if (error) {
    console.error('Error loading categories:', error)
    errorMessage.value = error.message
    return
  }

  categories.value = data ?? []
}

const loadProduct = async () => {
  loading.value = true
  errorMessage.value = ''

  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      category_id,
      price,
      stock,
      description,
      image_url
    `)
    .eq('id', productId)
    .single()

  if (error) {
    console.error('Error loading product:', error)
    errorMessage.value = error.message
    loading.value = false
    return
  }

  name.value = data.name
  categoryId.value = data.category_id
  price.value = Number(data.price)
  stock.value = data.stock
  description.value = data.description ?? ''
  imageUrl.value = data.image_url ?? ''

  loading.value = false
}

const saveProduct = async () => {
  errorMessage.value = ''

  if (!categoryId.value) {
    errorMessage.value = 'Please select a category.'
    return
  }

  saving.value = true

  const { error } = await supabase
    .from('products')
    .update({
      name: name.value,
      category_id: categoryId.value,
      price: price.value,
      stock: stock.value,
      description: description.value || null,
      image_url: imageUrl.value || null,
    })
    .eq('id', productId)

  if (error) {
    console.error('Error updating product:', error)
    errorMessage.value = error.message
    saving.value = false
    return
  }

  router.push('/admin/products')
}

onMounted(async () => {
  await Promise.all([
    loadCategories(),
    loadProduct(),
  ])
})
</script>

<template>
  <section class="container admin-page">

    <div class="page-heading">
      <div>
        <span class="eyebrow">Admin</span>
        <h1>Edit product</h1>
      </div>

      <p class="page-copy">
        Update the product details in the catalog.
      </p>
    </div>

    <div
      v-if="loading"
      class="form-card"
    >
      Loading product...
    </div>

    <div
      v-else
      class="form-card"
    >

      <p
        v-if="errorMessage"
        class="error-message"
      >
        {{ errorMessage }}
      </p>

      <form @submit.prevent="saveProduct">

        <label>Name</label>

        <input
          v-model="name"
          type="text"
          required
        />

        <label>Category</label>

        <select
          v-model="categoryId"
          required
        >
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>

        <label>Price</label>

        <input
          v-model.number="price"
          type="number"
          min="0"
          step="0.01"
          required
        />

        <label>Stock</label>

        <input
          v-model.number="stock"
          type="number"
          min="0"
          required
        />

        <label>Description</label>

        <textarea
          v-model="description"
          rows="4"
        />

        <label>Image URL</label>

        <input
          v-model="imageUrl"
          type="url"
          placeholder="https://example.com/product.jpg"
        />

        <button
          class="button"
          type="submit"
          :disabled="saving"
        >
          {{ saving ? 'Saving...' : 'Save changes' }}
        </button>

      </form>

    </div>

  </section>
</template>