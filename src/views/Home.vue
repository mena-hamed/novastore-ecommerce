```vue
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ProductGrid from '../components/ProductGrid.vue'
import { getProducts } from '../services/productService'
import type { Product, Category } from '../types/product'

const router = useRouter()

const categories = ref<Category[]>([
  {
    id: '1',
    name: 'Electronics',
    description: 'Smart technology for everyday life'
  },
  {
    id: '2',
    name: 'Clothing',
    description: 'Modern pieces made for everyday style'
  },
  {
    id: '3',
    name: 'Shoes',
    description: 'Step into something better'
  },
  {
    id: '4',
    name: 'Accessories',
    description: 'The details that complete the look'
  },
])

const allProducts = ref<Product[]>([])
const featuredProducts = ref<Product[]>([])

const loading = ref(true)
const error = ref('')

// No category is open by default
const selected = ref<string | null>(null)

const openProducts = () => {
  router.push('/products')
}

// Toggle category
const selectCategory = (categoryId: string) => {
  // Clicking the currently open category closes it
  if (selected.value === categoryId) {
    selected.value = null
  } else {
    // Open the clicked category
    selected.value = categoryId
  }
}

// Products for the currently selected category
const selectedCategoryProducts = computed(() => {
  if (!selected.value) {
    return []
  }

  return allProducts.value
    .filter(
      product => String(product.category_id) === selected.value
    )
    .slice(0, 3)
})

// Fetch products
const fetchProducts = async () => {
  loading.value = true
  error.value = ''

  try {
    const products = await getProducts()

    allProducts.value = products

    // Best Sellers = maximum 3
    featuredProducts.value = products.slice(0, 3)

  } catch (err: any) {
    console.error('Error loading products:', err)

    error.value =
      err?.message || 'Failed to load products.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchProducts)
</script>

<template>
  <main class="modern-home">

    <!-- HERO -->
    <section class="modern-hero">
      <img
        class="modern-hero-image"
        src="../imgs/home.jpg"
        alt="NovaStore spring collection"
      />

      <div class="modern-hero-content">

        <p class="modern-eyebrow">
          New collection · 2026
        </p>

        <h1>
          Your style
          <br />
          starts here.
        </h1>

        <p class="modern-hero-copy">
          Discover thoughtfully selected essentials designed
          for everyday living, comfort, and style.
        </p>

        <button
          class="modern-button"
          type="button"
          @click="openProducts"
        >
          Shop collection
          <span>→</span>
        </button>

      </div>
    </section>


    <!-- FEATURED -->
    <section class="modern-products-section">

      <div
        v-if="loading"
        class="modern-state"
      >
        Loading collection...
      </div>

      <div
        v-else-if="error"
        class="modern-state modern-error"
      >
        {{ error }}
      </div>

      <div
        v-else-if="!featuredProducts.length"
        class="modern-state"
      >
        No products available.
      </div>

      <div
        v-else
        class="modern-popular-grid"
      >

        <div class="modern-popular-intro">
          <p class="modern-eyebrow">
            The collection
          </p>

          <h2>
            Best Sellers
          </h2>

          <router-link
            to="/products"
            class="modern-text-link"
          >
            View all products
            <span>↗</span>
          </router-link>
        </div>

        <ProductGrid
          :products="featuredProducts"
        />

      </div>

    </section>


    <!-- CATEGORIES -->
    <section class="modern-categories">

      <div class="modern-section-heading">
        <div>
          <p class="modern-eyebrow">
            Explore
          </p>

          <h2>
            Shop by category
          </h2>
        </div>
      </div>


      <div class="modern-category-list">

        <div
          v-for="(category, index) in categories"
          :key="category.id"
          class="category-wrapper"
        >

          <!-- CATEGORY -->
          <button
            type="button"
            class="modern-category-card"
            :class="{
              active: category.id === selected
            }"
            @click="selectCategory(category.id)"
          >

            <span class="category-number">
              0{{ index + 1 }}
            </span>

            <div class="category-content">
              <h3>
                {{ category.name }}
              </h3>

              <p>
                {{ category.description }}
              </p>
            </div>

            <span
              class="category-arrow"
              :class="{
                rotated: category.id === selected
              }"
            >
              →
            </span>

          </button>


          <!-- DROPDOWN CHILD -->
          <div
            v-if="category.id === selected"
            class="category-dropdown"
          >

            <div
              v-if="loading"
              class="category-loading"
            >
              Loading products...
            </div>

            <div
              v-else-if="selectedCategoryProducts.length"
              class="category-products"
            >

              <ProductGrid
                :products="selectedCategoryProducts"
              />

            </div>

            <p
              v-else
              class="category-empty"
            >
              No products available in this category.
            </p>

          </div>

        </div>

      </div>

    </section>


    <!-- STATEMENT -->
    <section class="modern-statement">

      <div class="statement-content">

        <router-link
          to="/products"
          class="modern-text-link"
        >
          Explore NovaStore
          <span>→</span>
        </router-link>

      </div>

    </section>


    <!-- PROMO -->
    <section class="modern-promo">

      <router-link
        to="/products"
        class="modern-button modern-button-light"
      >
        Shop now
        <span>→</span>
      </router-link>

    </section>

  </main>
</template>
```
