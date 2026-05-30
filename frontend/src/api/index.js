import axios from 'axios'

const instance = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

instance.interceptors.request.use(async (config) => {
  const { useUserStore } = await import('@/stores/user')
  const userStore = useUserStore()
  if (userStore.accessToken) {
    config.headers.Authorization = `Bearer ${userStore.accessToken}`
  }
  return config
})

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const res = await axios.post('/api/user/account/token/refresh/')
        const { access } = res.data

        const { useUserStore } = await import('@/stores/user')
        const userStore = useUserStore()
        userStore.setAccessToken(access)

        originalRequest.headers.Authorization = `Bearer ${access}`
        return instance(originalRequest)
      } catch {
        const { useUserStore } = await import('@/stores/user')
        const userStore = useUserStore()
        userStore.logout()
        window.location.href = '/user/account/login'
      }
    }
    return Promise.reject(error)
  }
)

export default instance
