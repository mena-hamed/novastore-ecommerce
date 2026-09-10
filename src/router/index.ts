import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Products from '../views/Products.vue'
import ProductDetails from '../views/ProductDetails.vue'
import Cart from '../views/Cart.vue'
import Checkout from '../views/Checkout.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'
import Orders from '../views/Orders.vue'
import AdminDashboard from '../views/admin/Dashboard.vue'
import AdminProducts from '../views/admin/Products.vue'
import AdminAddProduct from '../views/admin/AddProduct.vue'
import AdminEditProduct from '../views/admin/EditProduct.vue'
import AdminOrders from '../views/admin/Orders.vue'
import AdminCustomers from '../views/admin/Customers.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/products', name: 'Products', component: Products },
  { path: '/products/:id', name: 'ProductDetails', component: ProductDetails, props: true },
  { path: '/cart', name: 'Cart', component: Cart },
  { path: '/checkout', name: 'Checkout', component: Checkout },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/orders', name: 'Orders', component: Orders },
  { path: '/admin', name: 'AdminDashboard', component: AdminDashboard },
  { path: '/admin/products', name: 'AdminProducts', component: AdminProducts },
  { path: '/admin/products/add', name: 'AdminAddProduct', component: AdminAddProduct },
  { path: '/admin/products/edit/:id', name: 'AdminEditProduct', component: AdminEditProduct, props: true },
  { path: '/admin/orders', name: 'AdminOrders', component: AdminOrders },
  { path: '/admin/customers', name: 'AdminCustomers', component: AdminCustomers },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
