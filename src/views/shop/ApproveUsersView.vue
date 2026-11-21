<template>
  <div class="shop-page">
    <ShopNavbar :cart-count="cartCount" />

    <section class="shop-vault approve-page">
      <div class="approve-page__inner">
        <router-link to="/shop" class="kv-btn detail__back">
          <v-icon small>mdi-arrow-left</v-icon>&nbsp;Back to Home
        </router-link>

        <AlertNotice
          v-if="!isAuthenticated || !isAdmin"
          :type="isAuthenticated ? 'error' : 'warning'"
          :title="isAuthenticated ? 'สำหรับผู้ดูแลระบบเท่านั้น' : 'กรุณาเข้าสู่ระบบก่อน'"
          :message="
            isAuthenticated
              ? 'เฉพาะบัญชีผู้ดูแลระบบเท่านั้นที่สามารถจัดการอนุมัติผู้ใช้ได้'
              : 'กรุณาเข้าสู่ระบบด้วยบัญชีผู้ดูแลระบบเพื่อจัดการอนุมัติผู้ใช้'
          "
        >
          <template #actions>
            <router-link to="/shop" class="ca-btn ca-btn--notice-ghost">
              กลับหน้าร้าน
            </router-link>
            <router-link
              v-if="!isAuthenticated"
              :to="{ path: '/signin', query: { redirect: '/approve_users' } }"
              class="ca-btn ca-btn--notice-primary"
            >
              เข้าสู่ระบบ
            </router-link>
          </template>
        </AlertNotice>

        <template v-else>
          <div class="approve-page__head">
            <div class="approve-page__title-row">
              <h1 class="approve-page__title">จัดการอนุมัติสมาชิก</h1>
              <span v-if="pendingCount" class="approve-page__pending-pill">
                รออนุมัติ {{ pendingCount }} บัญชี
              </span>
            </div>

            <div class="approve-page__controls">
              <div class="approve-page__filters" role="group" aria-label="กรองสถานะผู้ใช้">
                <button
                  v-for="f in USER_FILTERS"
                  :key="f.key"
                  type="button"
                  class="kv-chip"
                  :class="{ 'kv-chip--on': filter === f.key }"
                  @click="filter = f.key"
                >
                  {{ f.label }}
                  <template v-if="f.key === 'all'"> ({{ users.length }})</template>
                  <template v-else-if="f.key === 'pending'"> ({{ pendingCount }})</template>
                </button>
              </div>

              <div class="approve-page__tools">
                <label class="shop-vault__search approve-page__search">
                  <v-icon size="20" color="#6b7280">mdi-magnify</v-icon>
                  <input
                    v-model="keyword"
                    type="search"
                    placeholder="ค้นหาชื่อผู้ใช้..."
                    aria-label="ค้นหาชื่อผู้ใช้"
                  />
                  <button
                    v-if="keyword"
                    type="button"
                    class="shop-vault__clear"
                    aria-label="ล้างคำค้นหา"
                    @click="keyword = ''"
                  >
                    <v-icon size="16">mdi-close</v-icon>
                  </button>
                </label>

                <button
                  type="button"
                  class="shop-vault__admin-add"
                  :disabled="loading"
                  @click="loadUsers"
                >
                  <v-icon size="18">mdi-refresh</v-icon>
                  <span>รีเฟรช</span>
                </button>
              </div>
            </div>
          </div>

          <p v-if="loading" class="shop-vault__msg">กำลังโหลดรายชื่อผู้ใช้...</p>

          <AlertBanner
            v-else-if="error"
            type="error"
            title="ไม่สามารถโหลดรายชื่อผู้ใช้ได้"
            :message="error"
            class="shop-vault__banner"
          >
            <template #actions>
              <button type="button" class="ca-btn ca-btn--banner" @click="loadUsers">ลองใหม่</button>
            </template>
          </AlertBanner>

          <AlertBanner
            v-else-if="!filtered.length"
            type="info"
            :title="users.length ? 'ไม่พบบัญชีที่ตรงกับเงื่อนไข' : 'ยังไม่มีบัญชีผู้ใช้ในระบบ'"
            :message="users.length ? 'ลองเปลี่ยนตัวกรองหรือคำค้นหาดูอีกครั้ง' : 'เมื่อมีผู้สมัครสมาชิกใหม่ รายการจะมาแสดงที่นี่'"
            class="shop-vault__banner"
          />

          <ul v-else class="approve-list">
            <li v-for="u in filtered" :key="u.id" class="approve-item">
              <div class="approve-item__left">
                <span class="approve-item__avatar" aria-hidden="true">
                  {{ (u.username || '?').charAt(0) }}
                </span>

                <div class="approve-item__info">
                  <div class="approve-item__name-row">
                    <span class="approve-item__name">{{ u.username }}</span>
                    <span
                      class="approve-item__role"
                      :class="{ 'approve-item__role--admin': u.role === 'admin' }"
                    >
                      {{ u.role }}
                    </span>
                  </div>
                  <span v-if="u.created_at" class="approve-item__date">
                    สมัครเมื่อ {{ formatDate(u.created_at) }}
                  </span>
                </div>
              </div>

              <div class="approve-item__right">
                <span
                  class="approve-item__status"
                  :class="u.is_approve ? 'approve-item__status--ok' : 'approve-item__status--pending'"
                >
                  {{ u.is_approve ? 'อนุมัติแล้ว' : 'รออนุมัติ' }}
                </span>

                <button
                  v-if="!u.is_approve"
                  type="button"
                  class="kv-btn approve-item__btn"
                  :disabled="approvingId === u.id"
                  @click="approve(u)"
                >
                  <v-icon size="18">mdi-check-circle-outline</v-icon>
                  <span>{{ approvingId === u.id ? 'กำลังอนุมัติ...' : 'อนุมัติบัญชี' }}</span>
                </button>
              </div>
            </li>
          </ul>
        </template>
      </div>
    </section>

    <TornEdge fill="#212121" :seed="18" />
    <footer class="shop-foot">
      <span class="shop-foot__logo">Mor <span>gorn</span></span>
      <span>© 2026 Morgorn. All rights reserved.</span>
    </footer>
  </div>
</template>

<script>
import { watch } from 'vue'
import ShopNavbar from '@/components/shop/ShopNavbar.vue'
import TornEdge from '@/components/shop/TornEdge.vue'
import AlertBanner from '@/components/common/AlertBanner.vue'
import AlertNotice from '@/components/common/AlertNotice.vue'
import { useCart } from '@/hook/useCart'
import { useAuth } from '@/hook/useAuth'
import { useUsers, USER_FILTERS } from '@/hook/useUsers'

export default {
  name: 'ApproveUsersView',
  components: { ShopNavbar, TornEdge, AlertBanner, AlertNotice },
  setup() {
    const { count: cartCount } = useCart()
    const { isAuthenticated, isAdmin } = useAuth()
    const {
      users,
      filtered,
      pendingCount,
      loading,
      error,
      approvingId,
      filter,
      keyword,
      loadUsers,
      approve,
    } = useUsers()

    watch(
      () => [isAuthenticated.value, isAdmin.value],
      ([authed, admin]) => {
        if (authed && admin) loadUsers()
      },
      { immediate: true }
    )

    function formatDate(value) {
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return ''
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    }

    return {
      cartCount,
      isAuthenticated,
      isAdmin,
      users,
      filtered,
      pendingCount,
      loading,
      error,
      approvingId,
      filter,
      keyword,
      USER_FILTERS,
      loadUsers,
      approve,
      formatDate,
    }
  },
}
</script>

<style src="../../assets/style/shop-view.css"></style>
<style src="../../assets/style/shop/approve-users.css"></style>