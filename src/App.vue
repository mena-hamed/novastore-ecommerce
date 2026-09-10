<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div id="app">
    <Navbar />
    <main class="page-wrapper">
      <router-view />
    </main>
    <Footer />
  </div>
</template>


