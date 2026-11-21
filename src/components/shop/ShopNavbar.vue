<template>
  <header class="shop-nav">
    <div class="shop-nav__brand-group">
      <router-link to="/shop" class="shop-nav__brand">
        <img src="../../assets/images/logo.png" alt="Pokémon Vault" class="shop-nav__logo" />
      </router-link>
    </div>

    <div class="shop-nav__actions">
      <!-- <router-link
        v-if="isAdmin"
        to="/approve_users"
        class="shop-nav__admin"
        aria-label="Approve Users"
        title="จัดการอนุมัติสมาชิก"
      >
        <v-icon size="19">mdi-account-check-outline</v-icon>
        <span class="shop-nav__admin-text">Approve Users</span>
        <span v-if="pendingCount" class="shop-nav__admin-badge">{{ pendingCount }}</span>
      </router-link> -->

      <router-link to="/cart" class="shop-nav__btn" :aria-label="`Shopping cart (${cartCount} items)`">
        <v-icon>mdi-cart-outline</v-icon>
        <span v-if="cartCount" class="shop-nav__badge">{{ cartCount }}</span>
      </router-link>

      <template v-if="isAuthenticated">
        <div class="shop-nav__user" :title="username">
          <div class="shop-nav__identity">
            <span class="shop-nav__avatar" aria-hidden="true">
              <img
                src="../../assets/images/default_profile.jpg"
                alt=""
                class="shop-nav__avatar-img"
              />
            </span>
            <span class="shop-nav__username">{{ username }}</span>
          </div>
          <span class="shop-nav__divider" aria-hidden="true" />
          <button
            type="button"
            class="shop-nav__logout"
            aria-label="Sign out"
            title="Sign out"
            @click="handleLogout"
          >
            <v-icon size="18">mdi-logout</v-icon>
          </button>
        </div>
      </template>

      <router-link
        v-else
        :to="signInRoute"
        class="shop-nav__btn shop-nav__btn--account"
        aria-label="Sign in"
      >
        <v-icon>mdi-account-outline</v-icon>
      </router-link>
    </div>
  </header>
</template>

<script>
import { computed } from 'vue'
import router from '@/router'
import { useAuth } from '@/hook/useAuth'
import { useSignOut } from '@/hook/useSignOut'
// import { useUsers } from '@/hook/useUsers'

export default {
  name: 'ShopNavbar',
  props: {
    cartCount: { type: Number, default: 0 },
  },
  setup() {
    const { user, isAuthenticated } = useAuth()
    // const { pendingCount, ensureLoaded } = useUsers()
    const { confirmSignOut } = useSignOut(() => {
      if (router.currentRoute.name === 'product-detail') {
        router.push('/shop').catch(() => {})
      }
    })

    // watch(
    //   () => [isAuthenticated.value, isAdmin.value],
    //   ([authed, admin]) => {
    //     if (authed && admin) ensureLoaded()
    //   },
    //   { immediate: true }
    // )

    const username = computed(() => (user.value && user.value.username) || 'Member')
    const signInRoute = computed(() => {
      const fullPath = router.currentRoute.fullPath
      return fullPath && fullPath !== '/signin' && fullPath !== '/signup'
        ? { path: '/signin', query: { redirect: fullPath } }
        : '/signin'
    })

    return {
      isAuthenticated,
      // isAdmin,
      // pendingCount,
      username,
      signInRoute,
      handleLogout: confirmSignOut,
    }
  },
}
</script>

<style src="../../assets/style/shop/shop-navbar.css"></style>
