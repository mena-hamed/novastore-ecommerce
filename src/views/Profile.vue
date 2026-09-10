<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '../lib/supabase'

const loading = ref(true)
const error = ref('')

const profile = ref({
  name: '',
  email: '',
  role: '',
  joined: '',
})

const loadProfile = async () => {
  loading.value = true
  error.value = ''

  try {
    // Get logged-in user from Supabase Auth
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      throw userError
    }

    if (!user) {
      throw new Error('You must be logged in to view your profile.')
    }

    // Get profile information
    const { data, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, role, created_at')
      .eq('id', user.id)
      .single()

    if (profileError) {
      throw profileError
    }

    profile.value = {
      name: data.full_name || 'Customer',
      email: user.email || '',
      role: data.role || 'customer',
      joined: new Date(data.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      }),
    }
  } catch (err: any) {
    console.error('Error loading profile:', err)
    error.value = err?.message || 'Failed to load profile.'
  } finally {
    loading.value = false
  }
}

onMounted(loadProfile)
</script>

<template>
  <section class="container profile-page">
    <div class="page-heading">
      <div>
        <span class="eyebrow">Profile</span>
        <h1>Account details</h1>
      </div>

      <p class="page-copy">
        View your account information and order history.
      </p>
    </div>

    <p v-if="loading">Loading profile...</p>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else class="profile-card">
      <div>
        <h2>{{ profile.name }}</h2>
        <p>{{ profile.email }}</p>
      </div>

      <div>
        <span>Role:</span>
        <strong>{{ profile.role }}</strong>
      </div>
<br>
      <div>
        <span>Member since:</span>
        <strong>{{ profile.joined }}</strong>
      </div>
    </div>
  </section>
</template>