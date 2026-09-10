<script setup lang="ts">
import type { Product } from '../types/product'
import { useCart } from '../composables/useCart'

defineProps<{ product: Product }>()

const { addToCart } = useCart()
</script>

<template>
  <article class="product-card">
    <div class="product-image">
      <img :src="product.image" :alt="product.name" />
    </div>

    <div class="product-body">
      <p class="product-category">{{ product.category }}</p>

      <h3>{{ product.name }}</h3>

      <p class="product-description">
        {{ product.description }}
      </p>

      <div class="product-footer">
        <strong>${{ product.price.toFixed(2) }}</strong>

        <div>
          <router-link
            :to="`/products/${product.id}`"
            class="button small"
          >
            View
          </router-link>

          <button
            class="button small"
            :disabled="product.stock <= 0"
            @click="addToCart(product)"
          >
            {{ product.stock > 0 ? 'Add to cart' : 'Out of stock' }}
          </button>
        </div>
      </div>
    </div>
  </article>
</template>