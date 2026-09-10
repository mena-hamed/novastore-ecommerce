<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'

const router = useRouter()

const email = ref('')
const password = ref('')

const loading = ref(false)
const errorMessage = ref('')

const login = async () => {
  errorMessage.value = ''
  loading.value = true

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (error) {
      throw error
    }

    router.push('/')
  } catch (error: any) {
    errorMessage.value = error.message || 'Login failed.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="container auth-page">
    <div class="auth-panel">
      <h1>Sign in</h1>

      <p>Enter your credentials to access your account.</p>

      <form @submit.prevent="login">
        <label>Email</label>

        <input
          v-model="email"
          type="email"
          placeholder="jane@example.com"
          required
        />

        <label>Password</label>

        <input
          v-model="password"
          type="password"
          placeholder="••••••••"
          required
        />

        <p v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </p>

        <button
          class="button full-width"
          type="submit"
          :disabled="loading"
        >
          {{ loading ? 'Signing in...' : 'Login' }}
        </button>
      </form>

      <p class="auth-footer">
        New to NovaStore?
        <router-link to="/register">
          Create an account
        </router-link>
      </p>
    </div>
  </section>
</template>