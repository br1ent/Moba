<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const username = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

function getErrorMessage(e) {
  if (!e.response) return '网络异常，请稍后重试'
  const data = e.response.data
  if (data?.detail) return data.detail
  if (data?.non_field_errors) {
    const msg = Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors
    if (msg.includes('用户名') || msg.includes('密码')) return '用户名或密码错误'
  }
  return '系统出错，请稍后重试'
}

async function handleLogin() {
  errorMsg.value = ''
  if (!username.value.trim()) {
    errorMsg.value = '请输入用户名'
    return
  }
  if (!password.value) {
    errorMsg.value = '请输入密码'
    return
  }
  loading.value = true
  try {
    await userStore.login(username.value, password.value)
    router.push({ name: 'homeIndex' })
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
        <h2 class="card-title justify-center text-2xl mb-4">登录</h2>
        <form @submit.prevent="handleLogin">
          <fieldset class="fieldset">
            <label class="fieldset-legend">用户名</label>
            <input
              v-model="username"
              type="text"
              class="input w-full"
              placeholder="请输入用户名"
            />
            <label class="fieldset-legend mt-4">密码</label>
            <input
              v-model="password"
              type="password"
              class="input w-full"
              placeholder="请输入密码"
            />
          </fieldset>
          <div v-if="errorMsg" class="text-error text-sm mt-2">{{ errorMsg }}</div>
          <button class="btn btn-info w-full mt-6" :disabled="loading">
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>
        <div class="divider">或者</div>
        <div class="text-center space-y-2">
          <router-link :to="{ name: 'registerIndex' }" class="link link-primary">
            没有账号？去注册
          </router-link>
          <br />
          <router-link :to="{ name: 'resetPasswordIndex' }" class="link link-hover text-sm">
            忘记密码？
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
