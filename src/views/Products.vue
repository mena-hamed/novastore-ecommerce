<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getProducts } from '../services/productService'
import ProductCard from '../components/ProductCard.vue'

const products = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    products.value = await getProducts()
  } catch (err) {
    error.value = 'Failed to load products'
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="container products-page">

    <div class="page-heading">
      <div>
        <span class="eyebrow">Shop</span>
        <h1>Products</h1>
      </div>

      <p class="page-copy">
        Discover our latest products.
      </p>
    </div>

    <p v-if="loading">
      Loading products...
    </p>

    <p v-if="error">
      {{ error }}
    </p>

    <div
      v-if="!loading && !error"
      class="product-grid"
    >
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>

  </section>
</template>
