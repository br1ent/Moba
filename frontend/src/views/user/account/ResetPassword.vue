<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMsg = ref('')
const successMsg = ref('')
const loading = ref(false)

function getErrorMessage(e) {
  if (!e.response) return '网络异常，请稍后重试'
  const data = e.response.data
  if (data?.username) {
    const msg = Array.isArray(data.username) ? data.username[0] : data.username
    if (msg.includes('不存在')) return '该用户不存在'
    return msg
  }
  if (data?.password) {
    return Array.isArray(data.password) ? data.password[0] : data.password
  }
  if (data?.password_confirm) {
    return Array.isArray(data.password_confirm) ? data.password_confirm[0] : data.password_confirm
  }
  if (data?.detail) return data.detail
  return '系统出错，请稍后重试'
}

async function handleReset() {
  errorMsg.value = ''
  successMsg.value = ''
  if (!username.value.trim()) {
    errorMsg.value = '请输入用户名'
    return
  }
  if (!password.value) {
    errorMsg.value = '请输入新密码'
    return
  }
  if (password.value !== confirmPassword.value) {
    errorMsg.value = '两次密码不一致'
    return
  }
  loading.value = true
  try {
    await userStore.resetPassword(username.value, password.value, confirmPassword.value)
    successMsg.value = '密码重置成功，正在跳转到登录页面...'
    setTimeout(() => {
      router.push({ name: 'loginIndex' })
    }, 1500)
  } catch (e) {
    errorMsg.value = getErrorMessage(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex justify-center items-center min-h-[calc(100vh-64px)]">
    <div class="card bg-base-200 w-96 shadow-sm">
      <div class="card-body">
        <h2 class="card-title justify-center text-2xl mb-2">重置密码</h2>
        <p class="text-center text-sm text-base-content/60 mb-4">
          输入你的用户名和新密码来重置
        </p>
        <form @submit.prevent="handleReset">
          <fieldset class="fieldset">
            <label class="fieldset-legend">用户名</label>
            <input
              v-model="username"
              type="text"
              class="input w-full"
              placeholder="请输入用户名"
            />
            <label class="fieldset-legend mt-4">新密码</label>
            <input
              v-model="password"
              type="password"
              class="input w-full"
              placeholder="请输入新密码"
            />
            <label class="fieldset-legend mt-4">确认新密码</label>
            <input
              v-model="confirmPassword"
              type="password"
              class="input w-full"
              placeholder="请再次输入新密码"
            />
          </fieldset>
          <div v-if="errorMsg" class="text-error text-sm mt-2">{{ errorMsg }}</div>
          <div v-if="successMsg" class="text-success text-sm mt-2">{{ successMsg }}</div>
          <button class="btn btn-info w-full mt-6" :disabled="loading">
            {{ loading ? '重置中...' : '重置密码' }}
          </button>
        </form>
        <div class="text-center mt-4">
          <router-link :to="{ name: 'loginIndex' }" class="link link-primary">
            返回登录
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
