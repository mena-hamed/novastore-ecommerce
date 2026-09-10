<script setup lang="ts">
const props = defineProps<{ search: string; selectedCategory: string; sort: string }>()
const emit = defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'update:category', value: string): void
  (e: 'update:sort', value: string): void
}>()

const categories = ['All', 'Apparel', 'Accessories', 'Electronics', 'Home']

const updateSearch = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:search', value)
}

const updateCategory = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value
  emit('update:category', value)
}

const updateSort = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value
  emit('update:sort', value)
}
</script>

<template>
  <div class="search-bar">
    <input
      type="search"
      :value="props.search"
      @input="updateSearch"
      placeholder="Search products"
      aria-label="Search products"
    />

    <select :value="props.selectedCategory" @change="updateCategory">
      <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
    </select>

    <select :value="props.sort" @change="updateSort">
      <option value="default">Sort by</option>
      <option value="price-asc">Price: Low to high</option>
      <option value="price-desc">Price: High to low</option>
    </select>
  </div>
</template>
