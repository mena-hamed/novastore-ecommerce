import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import { useAuth } from './composables/useAuth'

const app = createApp(App)

app.use(router)

const { initialize } = useAuth()

initialize().then(() => {
  app.mount('#app')
})