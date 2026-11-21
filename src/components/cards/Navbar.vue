<template>
  <header
    class="navbar"
    :class="{
      'navbar--scrolled': isScrolled,
      'navbar--menu-open': mobileMenuOpen
    }"
  >
    <div class="navbar__inner">
      <!-- Brand Logo -->
      <router-link to="/" class="navbar__logo" aria-label="Morgorn Portfolio Home" @click.native="handleLogoClick">
        <span class="navbar__brand-text">{{ brandName }}</span>
      </router-link>

      <!-- Desktop Nav Links -->
      <nav class="navbar__links" aria-label="Main navigation">
        <a
          href="#about"
          class="navbar__link"
          :class="{ 'is-active': activeSection === 'about' }"
          @click.prevent="scrollToSection('about')"
        >
          About
        </a>
        <a
          href="#edu"
          class="navbar__link"
          :class="{ 'is-active': activeSection === 'edu' }"
          @click.prevent="scrollToSection('edu')"
        >
          Education
        </a>
        <a
          href="#personal"
          class="navbar__link"
          :class="{ 'is-active': activeSection === 'personal' }"
          @click.prevent="scrollToSection('personal')"
        >
          Personal
        </a>
        <a
          href="#contact"
          class="navbar__link"
          :class="{ 'is-active': activeSection === 'contact' }"
          @click.prevent="scrollToSection('contact')"
        >
          Contact
        </a>

        <!-- Highlighted Shop Link in Nav -->
        <router-link to="/shop" class="navbar__link navbar__link--shop">
          <span>Shop</span>
          <span class="navbar__badge">Vault</span>
        </router-link>
      </nav>

      <!-- Desktop Account Actions -->
      <div class="navbar__actions">
        <template v-if="isAuthenticated">
          <div class="navbar__user-pill" :title="username">
            <span class="navbar__user-avatar">{{ userInitial }}</span>
            <span class="navbar__username">{{ username }}</span>
          </div>
          <button
            type="button"
            class="navbar__account-btn navbar__account-btn--logout"
            title="Sign out"
            @click="handleLogout"
          >
            Sign out
          </button>
        </template>
        <template v-else>
          <router-link to="/signin" class="navbar__account-btn navbar__account-btn--signin">
            Sign in
          </router-link>
        </template>
      </div>

      <!-- Mobile Hamburger Toggle -->
      <button
        type="button"
        class="navbar__toggle"
        :aria-expanded="mobileMenuOpen"
        aria-label="Toggle navigation menu"
        @click="toggleMobileMenu"
      >
        <span class="navbar__toggle-line navbar__toggle-line--1"></span>
        <span class="navbar__toggle-line navbar__toggle-line--2"></span>
        <span class="navbar__toggle-line navbar__toggle-line--3"></span>
      </button>
    </div>

    <!-- Mobile Drawer Menu -->
    <transition name="navbar-dropdown">
      <div v-if="mobileMenuOpen" class="navbar__mobile-menu">
        <nav class="navbar__mobile-links">
          <a
            href="#about"
            class="navbar__mobile-link"
            :class="{ 'is-active': activeSection === 'about' }"
            @click.prevent="onMobileNavigate('about')"
          >
            About
          </a>
          <a
            href="#edu"
            class="navbar__mobile-link"
            :class="{ 'is-active': activeSection === 'edu' }"
            @click.prevent="onMobileNavigate('edu')"
          >
            Education
          </a>
          <a
            href="#personal"
            class="navbar__mobile-link"
            :class="{ 'is-active': activeSection === 'personal' }"
            @click.prevent="onMobileNavigate('personal')"
          >
            Personal
          </a>
          <a
            href="#contact"
            class="navbar__mobile-link"
            :class="{ 'is-active': activeSection === 'contact' }"
            @click.prevent="onMobileNavigate('contact')"
          >
            Contact
          </a>

          <div class="navbar__mobile-divider"></div>

          <router-link
            to="/shop"
            class="navbar__mobile-link navbar__mobile-link--shop"
            @click.native="mobileMenuOpen = false"
          >
            <span class="navbar__mobile-shop-text">Pokémon Vault Shop</span>
            <span class="navbar__badge">Live</span>
          </router-link>
        </nav>

        <div class="navbar__mobile-actions">
          <template v-if="isAuthenticated">
            <div class="navbar__mobile-user">
              <span class="navbar__user-avatar">{{ userInitial }}</span>
              <span class="navbar__username">{{ username }}</span>
            </div>
            <button
              type="button"
              class="navbar__mobile-btn navbar__mobile-btn--logout"
              @click="handleLogoutMobile"
            >
              Sign out
            </button>
          </template>
          <template v-else>
            <router-link
              to="/signin"
              class="navbar__mobile-btn navbar__mobile-btn--signin"
              @click.native="mobileMenuOpen = false"
            >
              Sign in
            </router-link>
          </template>
        </div>
      </div>
    </transition>
  </header>
</template>

<script>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import router from '@/router'
import { useAuth } from '@/hook/useAuth'
import { useSignOut } from '@/hook/useSignOut'

export default {
  name: 'AppNavbar',
  setup() {
    const { user, isAuthenticated } = useAuth()
    const { confirmSignOut } = useSignOut()
    const isScrolled = ref(false)
    const mobileMenuOpen = ref(false)
    const activeSection = ref('')

    const username = computed(() => (user.value && user.value.username) || 'Member')
    const userInitial = computed(() => (username.value ? username.value.charAt(0).toUpperCase() : 'M'))

    const handleScroll = () => {
      isScrolled.value = window.scrollY > 20

      // ScrollSpy for active section
      const sections = ['about', 'edu', 'personal', 'contact']
      const scrollPos = window.scrollY + 120

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && el.offsetTop <= scrollPos) {
          activeSection.value = sections[i]
          return
        }
      }
      activeSection.value = ''
    }

    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value
    }

    const scrollToSection = (id) => {
      if (router.currentRoute.path !== '/') {
        router.push(`/#${id}`).catch(() => {})
        return
      }

      const el = document.getElementById(id)
      if (el) {
        const top = el.getBoundingClientRect().top + window.pageYOffset - 80
        window.scrollTo({ top, behavior: 'smooth' })
      }
    }

    const onMobileNavigate = (id) => {
      mobileMenuOpen.value = false
      setTimeout(() => {
        scrollToSection(id)
      }, 200)
    }

    const handleLogoClick = () => {
      mobileMenuOpen.value = false
      if (router.currentRoute.path === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    const handleLogoutMobile = () => {
      mobileMenuOpen.value = false
      confirmSignOut()
    }

    onMounted(() => {
      window.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll()
    })

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      isAuthenticated,
      username,
      userInitial,
      isScrolled,
      mobileMenuOpen,
      activeSection,
      toggleMobileMenu,
      scrollToSection,
      onMobileNavigate,
      handleLogoClick,
      handleLogout: confirmSignOut,
      handleLogoutMobile,
    }
  },
  computed: {
    brandName() {
      return 'Morgorn'
    },
  },
}
</script>

<style scoped>
@import "../../assets/style/cards/navbar.css";
</style>
