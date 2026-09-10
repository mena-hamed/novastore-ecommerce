<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const register = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (password.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters.'
    return
  }

  loading.value = true

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          full_name: name.value,
        },
      },
    })

    if (error) {
      throw error
    }

    if (data.user) {
      successMessage.value =
        'Account created successfully! Check your email if confirmation is required.'

      name.value = ''
      email.value = ''
      password.value = ''

      // If Supabase automatically logs the user in,
      // send them to the home page.
      if (data.session) {
        router.push('/')
      }
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Registration failed.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="container auth-page">
    <div class="auth-panel">
      <h1>Create account</h1>

      <p>Register to save your cart and order history.</p>

      <form @submit.prevent="register">
        <label>Name</label>

        <input
          v-model="name"
          placeholder="Jane Doe"
          required
        />

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

        <p v-if="successMessage" class="success-message">
          {{ successMessage }}
        </p>

        <button
          class="button full-width"
          type="submit"
          :disabled="loading"
        >
          {{ loading ? 'Creating account...' : 'Create account' }}
        </button>
      </form>

      <p class="auth-footer">
        Already have an account?
        <router-link to="/login">Login</router-link>
      </p>
    </div>
  </section>
</template>