import { request } from './api'

export async function fetchUsers() {
  const res = await request('/users')
  return Array.isArray(res.data) ? res.data : []
}

export async function approveUser(id) {
  const res = await request(`/${encodeURIComponent(id)}/approve`, {
    method: 'PUT',
  })
  return res.data
}
