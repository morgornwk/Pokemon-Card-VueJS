import { ref, computed, watch } from 'vue'
import { useAuth } from '@/hook/useAuth'
import { useAlert } from '@/hook/useAlert'
import { fetchUsers, approveUser } from '@/services/userService'

export const USER_FILTERS = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'pending', label: 'รออนุมัติ' },
  { key: 'approved', label: 'อนุมัติแล้ว' },
]

function normalizeUser(raw) {
  if (!raw) return null
  return {
    id: raw.id || raw._id,
    username: raw.username || '',
    role: raw.role || 'user',
    is_approve: Boolean(raw.is_approve),
    created_at: raw.created_at || '',
  }
}

const users = ref([])
const loading = ref(false)
const error = ref('')
const approvingId = ref('')
let hasLoaded = false

export function useUsers() {
  const { isAuthenticated, isAdmin } = useAuth()
  const { success, error: errorToast, confirm } = useAlert()

  const filter = ref('all')
  const keyword = ref('')

  async function loadUsers() {
    if (!isAuthenticated.value || !isAdmin.value) return
    loading.value = true
    error.value = ''
    try {
      const list = await fetchUsers()
      users.value = list.map(normalizeUser).filter(Boolean)
      hasLoaded = true
    } catch (err) {
      error.value = err.message || 'ไม่สามารถโหลดรายชื่อผู้ใช้ได้'
    } finally {
      loading.value = false
    }
  }

  function ensureLoaded() {
    if (!hasLoaded && !loading.value && isAuthenticated.value && isAdmin.value) {
      loadUsers()
    }
  }

  watch(
    () => [isAuthenticated.value, isAdmin.value],
    ([authed, admin]) => {
      if (!authed || !admin) {
        users.value = []
        error.value = ''
        hasLoaded = false
      }
    }
  )

  const pendingCount = computed(() => users.value.filter((u) => !u.is_approve).length)

  const filtered = computed(() => {
    const q = keyword.value.trim().toLowerCase()
    return users.value
      .filter((u) => {
        if (filter.value === 'pending' && u.is_approve) return false
        if (filter.value === 'approved' && !u.is_approve) return false
        return !q || u.username.toLowerCase().includes(q)
      })
      .sort((a, b) => Number(a.is_approve) - Number(b.is_approve))
  })

  async function approve(target) {
    if (!target || target.is_approve || approvingId.value) return
    const ok = await confirm({
      type: 'info',
      title: 'อนุมัติผู้ใช้นี้ใช่ไหม?',
      message: `ต้องการอนุมัติบัญชี "${target.username}" ให้เข้าดูรายละเอียดและสั่งซื้อสินค้าหรือไม่`,
      confirmText: 'อนุมัติ',
      cancelText: 'ยกเลิก',
    })
    if (!ok) return

    approvingId.value = target.id
    try {
      const updated = await approveUser(target.id)
      users.value = users.value.map((u) =>
        u.id === target.id
          ? { ...u, is_approve: updated ? Boolean(updated.is_approve) : true }
          : u
      )
      success(`อนุมัติบัญชี "${target.username}" เรียบร้อยแล้ว`, {
        title: 'อนุมัติสำเร็จ!',
      })
    } catch (err) {
      errorToast(err.message || 'ไม่สามารถอนุมัติผู้ใช้ได้', {
        title: 'อนุมัติไม่สำเร็จ',
      })
    } finally {
      approvingId.value = ''
    }
  }

  return {
    users,
    filtered,
    pendingCount,
    loading,
    error,
    approvingId,
    filter,
    keyword,
    loadUsers,
    ensureLoaded,
    approve,
  }
}
