import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { apiRequest } from '@/services/api'

const STORAGE_KEY = 'hospital-auth'

function loadSession() {
  const saved = localStorage.getItem(STORAGE_KEY)

  if (!saved) {
    return {
      token: '',
      user: null,
      expiresIn: '',
    }
  }

  try {
    return JSON.parse(saved)
  } catch {
    localStorage.removeItem(STORAGE_KEY)

    return {
      token: '',
      user: null,
      expiresIn: '',
    }
  }
}

export const useAuthStore = defineStore('auth', () => {
  const session = loadSession()
  const token = ref(session.token || '')
  const user = ref(session.user || null)
  const expiresIn = ref(session.expiresIn || '')
  const loading = ref(false)

  const isAuthenticated = computed(() => Boolean(token.value && user.value))

  function persistSession() {
    if (!token.value || !user.value) {
      localStorage.removeItem(STORAGE_KEY)
      return
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        token: token.value,
        user: user.value,
        expiresIn: expiresIn.value,
      }),
    )
  }

  async function login(credentials) {
    loading.value = true

    try {
      const response = await apiRequest('/login', {
        method: 'POST',
        body: credentials,
      })

      token.value = response.token
      user.value = response.user
      expiresIn.value = response.expiresIn
      persistSession()

      return response
    } finally {
      loading.value = false
    }
  }

  function logout() {
    token.value = ''
    user.value = null
    expiresIn.value = ''
    persistSession()
  }

  return {
    expiresIn,
    isAuthenticated,
    loading,
    login,
    logout,
    token,
    user,
  }
})
