```vue
<script setup lang="ts">
import type { Product } from '../types/product'

const props = defineProps<{
  product: Product
  quantity: number
}>()

const emit = defineEmits<{
  (e: 'remove', id: number): void
  (e: 'update-quantity', payload: {
    id: number
    quantity: number
  }): void
}>()

const onDecrement = () => {
  if (props.quantity > 1) {
    emit('update-quantity', {
      id: props.product.id,
      quantity: props.quantity - 1,
    })
  }
}

const onIncrement = () => {
  emit('update-quantity', {
    id: props.product.id,
    quantity: props.quantity + 1,
  })
}

const onRemove = () => {
  emit('remove', props.product.id)
}
</script>

<template>
  <div class="cart-item">
    <img
      :src="product.image"
      :alt="product.name"
    />

    <div class="cart-item-body">
      <h3>{{ product.name }}</h3>

      <p>{{ product.category }}</p>

      <div class="cart-item-controls">
        <div class="quantity-control">
          <button
            type="button"
            @click="onDecrement"
          >
            -
          </button>

          <span>{{ quantity }}</span>

          <button
            type="button"
            @click="onIncrement"
          >
            +
          </button>
        </div>

        <button
          type="button"
          class="text-button"
          @click="onRemove"
        >
          Remove
        </button>
      </div>
    </div>

    <div class="cart-item-price">
      <strong>
        ${{ (product.price * quantity).toFixed(2) }}
      </strong>
    </div>
  </div>
</template>
```
