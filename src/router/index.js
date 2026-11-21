import Vue from 'vue'
import VueRouter from 'vue-router'
import { useAlert } from '@/hook/useAlert'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/grade',
    name: 'grade',
    component: () => import(/* webpackChunkName: "grade" */ '../views/GradeCalculator.vue'),
  },
  {
    path: '/signin',
    name: 'signin',
    component: () => import(/* webpackChunkName: "auth" */ '../views/auth/SignInView.vue'),
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import(/* webpackChunkName: "auth" */ '../views/auth/SignUpView.vue'),
  },
  {
    path: '/shop',
    name: 'shop',
    component: () => import(/* webpackChunkName: "shop" */ '../views/shop/ShopView.vue'),
  },
  {
    path: '/add_product',
    name: 'add-product',
    component: () => import(/* webpackChunkName: "shop-admin" */ '../views/shop/AddProductView.vue'),
  },
  {
    path: '/shop/:id',
    name: 'product-detail',
    component: () => import(/* webpackChunkName: "shop-detail" */ '../views/shop/ProductDetailView.vue'),
    props: true,
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import(/* webpackChunkName: "cart" */ '../views/shop/CartView.vue'),
  },
  {
    path: '/edit_product/:id',
    name: 'edit_product',
    component: () => import(/* webpackChunkName: "shop-admin" */ '../views/shop/EditProductView.vue'),
    props: true,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { selector: to.hash, offset: { x: 0, y: 76 } }
    }
    return { x: 0, y: 0 }
  },
})

router.afterEach(() => {
  useAlert().closeDialog(false)
})

export default router
