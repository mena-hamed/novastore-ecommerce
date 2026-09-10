<script setup lang="ts">
import type { Product } from '../types/product'
import ProductCard from './ProductCard.vue'
const props = defineProps<{ products: Product[] }>()
</script>

<template>
  <div class="grid-list">
    <ProductCard v-for="product in products" :key="product.id" :product="product" />
  </div>
</template>
