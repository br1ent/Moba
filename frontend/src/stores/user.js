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

  async function updateUsername(username) {
    const res = await api.put('/user/profile/update_username/', { username })
    user.value = res.data
    return res.data
  }

  async function updateAvatar(avatarFile) {
    const formData = new FormData()
    formData.append('avatar', avatarFile)
    const res = await api.post('/user/profile/update_avatar/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    user.value = res.data
    return res.data
  }

  async function updatePassword(oldPassword, newPassword, newPasswordConfirm) {
    const res = await api.put('/user/profile/update_password/', {
      old_password: oldPassword,
      new_password: newPassword,
      new_password_confirm: newPasswordConfirm
    })
    return res.data
  }

  async function updateBio(bio) {
    const res = await api.put('/user/profile/update_bio/', { bio })
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

  return {
    user, accessToken, isLoggedIn,
    login, register, resetPassword, fetchUserinfo,
    updateUsername, updateAvatar, updatePassword, updateBio,
    setAccessToken, logout
  }
})
