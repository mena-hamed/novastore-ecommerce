<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../lib/supabase'

interface Category {
  id: number
  name: string
}

const router = useRouter()

const name = ref('')
const categoryId = ref<number | null>(null)
const price = ref(0)
const stock = ref(0)
const description = ref('')
const imageUrl = ref('')

const categories = ref<Category[]>([])

const loadingCategories = ref(true)
const saving = ref(false)
const errorMessage = ref('')

const loadCategories = async () => {
  loadingCategories.value = true

  const { data, error } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  if (error) {
    console.error('Error loading categories:', error)
    errorMessage.value = error.message
  } else {
    categories.value = data ?? []
  }

  loadingCategories.value = false
}

const addProduct = async () => {
  errorMessage.value = ''

  if (!categoryId.value) {
    errorMessage.value = 'Please select a category.'
    return
  }

  saving.value = true

  const { error } = await supabase
    .from('products')
    .insert({
      name: name.value,
      category_id: categoryId.value,
      price: price.value,
      stock: stock.value,
      description: description.value || null,
      image_url: imageUrl.value || null,
    })

  if (error) {
    console.error('Error creating product:', error)
    errorMessage.value = error.message
    saving.value = false
    return
  }

  router.push('/admin/products')
}

onMounted(() => {
  loadCategories()
})
</script>

<template>
  <section class="container admin-page">

    <div class="page-heading">
      <div>
        <span class="eyebrow">Admin</span>
        <h1>Add product</h1>
      </div>

      <p class="page-copy">
        Create a new product entry for the store catalog.
      </p>
    </div>

    <div class="form-card">

      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <form @submit.prevent="addProduct">

        <label>Name</label>
        <input
          v-model="name"
          type="text"
          placeholder="Product name"
          required
        />

        <label>Category</label>

        <select
          v-model="categoryId"
          required
          :disabled="loadingCategories"
        >
          <option :value="null" disabled>
            {{
              loadingCategories
                ? 'Loading categories...'
                : 'Select a category'
            }}
          </option>

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
          placeholder="Describe the product..."
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
          {{ saving ? 'Saving...' : 'Save product' }}
        </button>

      </form>
    </div>

  </section>
</template>