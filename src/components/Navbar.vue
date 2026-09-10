<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const open = ref(false)

const route = useRoute()
const router = useRouter()

const {
  isAuthenticated,
  isAdmin,
  profile,
  logout,
} = useAuth()

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Shop All', path: '/products' },
  { label: 'More', path: '/products' },
]

const goHome = () => {
  router.push('/')
  open.value = false
}

const handleLogout = async () => {
  try {
    await logout()
    open.value = false
    router.push('/')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<template>
  <header class="navbar">
    <div class="announcement-bar">
      <p>Free shipping on orders above 1999 L.E</p>
      <button type="button" aria-label="Dismiss announcement">x</button>
    </div>

    <div class="container navbar-inner">

      <!-- Brand -->
      <div class="brand" @click="goHome">
        <p class="brand-label">NovaStore</p>
      </div>

      <!-- Mobile menu -->
      <button
        class="nav-toggle"
        type="button"
        @click="open = !open"
        aria-label="Toggle navigation"
      >
        <span />
        <span />
        <span />
      </button>

      <nav :class="['nav-links', { open: open }]">

        <!-- Main navigation -->
        <ul class="nav-primary">
          <li
            v-for="link in navLinks"
            :key="link.path"
          >
            <router-link
              :to="link.path"
              :class="{ active: route.path === link.path }"
              @click="open = false"
            >
              {{ link.label }}
            </router-link>
          </li>

          <!-- Customer/Admin profile -->
          <li v-if="isAuthenticated">
            <router-link
              to="/profile"
              :class="{ active: route.path === '/profile' }"
              @click="open = false"
            >
              Profile
            </router-link>
          </li>

          <!-- Admin dashboard -->
          <li v-if="isAuthenticated && isAdmin">
            <router-link
              to="/admin"
              :class="{ active: route.path.startsWith('/admin') }"
              @click="open = false"
            >
              Admin Dashboard
            </router-link>
          </li>
        </ul>

        <!-- Authentication actions -->
        <div class="nav-actions">
          <router-link class="shop-all-link" to="/products" @click="open = false">
            Shop all
          </router-link>

          <router-link class="nav-icon-link" to="/products" aria-label="Search products" title="Search products">
            <span class="nav-icon nav-icon-search" />
          </router-link>

          <router-link
            class="nav-icon-link"
            :to="isAuthenticated ? '/profile' : '/login'"
            aria-label="Account"
            title="Account"
          >
            <span class="nav-icon nav-icon-account" />
          </router-link>

          <router-link class="nav-icon-link" to="/cart" aria-label="Shopping bag" title="Shopping bag">
            <span class="nav-icon nav-icon-bag" />
          </router-link>

          <!-- Guest -->
          <template v-if="!isAuthenticated">

            <router-link
              class="button secondary"
              to="/login"
              @click="open = false"
            >
              Login
            </router-link>

            <router-link
              class="button"
              to="/register"
              @click="open = false"
            >
              Sign Up
            </router-link>

          </template>

          <!-- Logged in -->
          <template v-else>

            <span class="nav-user">
              {{ profile?.full_name || 'Account' }}
            </span>

            <button
              class="button secondary"
              type="button"
              @click="handleLogout"
            >
              Logout
            </button>

          </template>

        </div>
      </nav>
    </div>
  </header>
</template>