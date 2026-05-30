import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const accessToken = ref('')

  const isLoggedIn = computed(() => !!accessToken.value)

  async function login(username, password) {
    const res = await api.post('/user/account/login/', { username, password })
    accessToken.value = res.data.access
    user.value = res.data.user
    return res.data
  }

  async function register(username, password, password_confirm) {
    const res = await api.post('/user/account/register/', {
      username,
      password,
      password_confirm,
    })
    accessToken.value = res.data.access
    user.value = res.data.user
    return res.data
  }

  async function resetPassword(username, password, password_confirm) {
    const res = await api.post('/user/account/reset_password/', {
      username,
      password,
      password_confirm,
    })
    return res.data
  }

  async function fetchUserinfo() {
    const res = await api.get('/user/account/userinfo/')
    user.value = res.data
    return res.data
  }

  function setAccessToken(token) {
    accessToken.value = token
  }

  function logout() {
    user.value = null
    accessToken.value = ''
  }

  return { user, accessToken, isLoggedIn, login, register, resetPassword, fetchUserinfo, setAccessToken, logout }
})
