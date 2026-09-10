<script setup lang="ts">
const props = defineProps<{ name: string; active?: boolean }>()
const emit = defineEmits<{
  (e: 'select', value: string): void
}>()

const handleClick = () => {
  emit('select', props.name)
}
</script>

<template>
  <button class="category-card" :class="{ active: props.active }" type="button" @click="handleClick">
    {{ props.name }}
  </button>
</template>
