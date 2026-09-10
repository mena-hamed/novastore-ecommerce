<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { useCart } from '../composables/useCart'
import type { Product } from '../types/product'

const route = useRoute()
const router = useRouter()

const { addToCart } = useCart()

const product = ref<Product | null>(null)
const relatedProducts = ref<Product[]>([])

const loading = ref(true)
const error = ref('')
const quantity = ref(1)

const productId = computed(() => Number(route.params.id))

const fetchProduct = async () => {
  loading.value = true
  error.value = ''
  product.value = null

  try {
    const id = productId.value

    console.log('Loading product ID:', id)

    if (!id || Number.isNaN(id)) {
      throw new Error('Invalid product ID')
    }

    // Get the selected product
    const { data, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (productError) {
      console.error('Supabase product error:', productError)
      throw productError
    }

    if (!data) {
      throw new Error('Product not found')
    }

    console.log('PRODUCT DETAILS:', data)

    product.value = {
      id: Number(data.id),
      name: data.name,
      description: data.description,
      category: data.category ?? String(data.category_id),
      price: Number(data.price),
      stock: Number(data.stock),
      image: data.image_url,
      category_id: Number(data.category_id),
    }

    // Get other products
    const { data: relatedData, error: relatedError } = await supabase
      .from('products')
      .select('*')
      .neq('id', id)
      .limit(4)

    if (relatedError) {
      console.error('Related products error:', relatedError)
    }

    relatedProducts.value = (relatedData || []).map(item => ({
      id: Number(item.id),
      name: item.name,
      description: item.description,
      category: item.category ?? String(item.category_id),
      price: Number(item.price),
      stock: Number(item.stock),
      image: item.image_url,
      category_id: Number(item.category_id),
    }))

  } catch (err: any) {
    console.error('Error loading product:', err)

    error.value =
      err?.message || 'Failed to load product.'

  } finally {
    loading.value = false
  }
}

const increment = () => {
  if (!product.value) return

  if (quantity.value < product.value.stock) {
    quantity.value++
  }
}

const decrement = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addProductToCart = () => {
  if (!product.value || product.value.stock <= 0) return

  addToCart(product.value, quantity.value)

  router.push('/cart')
}

const isOutOfStock = computed(() => {
  return !product.value || product.value.stock <= 0
})

// Load product initially and whenever the URL ID changes
watch(
  () => route.params.id,
  () => {
    quantity.value = 1
    fetchProduct()
  },
  { immediate: true }
)
</script>

<template>
  <section class="container product-details-page">

    <!-- Loading -->
    <div v-if="loading" class="empty-state">
      <h2>Loading product...</h2>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="empty-state">
      <h2>{{ error }}</h2>

      <router-link to="/products" class="button">
        Back to products
      </router-link>
    </div>

    <!-- Product -->
    <template v-else-if="product">

      <div class="details-grid">

        <div class="image-panel">
          <img
            :src="product.image"
            :alt="product.name"
          />
        </div>

        <div class="details-panel">

          <p class="eyebrow">
            {{ product.category }}
          </p>

          <h1>
            {{ product.name }}
          </h1>

          <p class="details-copy">
            {{ product.description }}
          </p>

          <div class="product-meta">

            <div>
              <span>Price</span>

              <strong>
                ${{ product.price.toFixed(2) }}
              </strong>
            </div>

            <div>
              <span>Stock</span>

              <strong>
                {{
                  product.stock > 0
                    ? `${product.stock} available`
                    : 'Out of stock'
                }}
              </strong>
            </div>

          </div>

          <!-- Quantity -->
          <div
            v-if="product.stock > 0"
            class="quantity-selector"
          >

            <button
              type="button"
              @click="decrement"
              :disabled="quantity <= 1"
            >
              -
            </button>

            <span>
              {{ quantity }}
            </span>

            <button
              type="button"
              @click="increment"
              :disabled="quantity >= product.stock"
            >
              +
            </button>

          </div>

          <!-- Add to cart -->
          <button
            class="button full-width"
            type="button"
            :disabled="isOutOfStock"
            @click="addProductToCart"
          >
            {{
              product.stock > 0
                ? 'Add to cart'
                : 'Out of stock'
            }}
          </button>

        </div>
      </div>

      <!-- Related products -->
      <section
        v-if="relatedProducts.length"
        class="related-section"
      >

        <div class="section-header">
          <div>
            <p class="eyebrow">Related</p>
            <h2>You may also like</h2>
          </div>
        </div>

        <div class="grid-list">

          <div
            v-for="item in relatedProducts"
            :key="item.id"
            class="related-card"
          >

            <img
              :src="item.image"
              :alt="item.name"
            />

            <div>
              <h3>
                {{ item.name }}
              </h3>

              <p>
                ${{ item.price.toFixed(2) }}
              </p>

              <router-link
                :to="`/products/${item.id}`"
                class="text-link"
              >
                View product
              </router-link>
            </div>

          </div>

        </div>

      </section>

    </template>

  </section>
</template>