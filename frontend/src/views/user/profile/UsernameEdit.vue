<script setup>
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const isEditing = ref(false)
const newUsername = ref('')
const loading = ref(false)
const error = ref('')

watch(() => userStore.user?.username, (val) => {
  if (!isEditing.value) {
    newUsername.value = val || ''
  }
}, { immediate: true })

function startEditing() {
  newUsername.value = userStore.user?.username || ''
  isEditing.value = true
  error.value = ''
}

function cancelEditing() {
  isEditing.value = false
  error.value = ''
}

async function saveUsername() {
  if (!newUsername.value.trim()) {
    error.value = '用户名不能为空'
    return
  }

  if (newUsername.value === userStore.user?.username) {
    isEditing.value = false
    return
  }

  loading.value = true
  error.value = ''

  try {
    await userStore.updateUsername(newUsername.value.trim())
    isEditing.value = false
  } catch (err) {
    error.value = err.response?.data?.username?.[0] || '修改失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- 显示模式 -->
    <template v-if="!isEditing">
      <span class="text-2xl font-bold">{{ userStore.user?.username }}</span>
      <button class="btn btn-ghost btn-sm btn-circle" @click="startEditing">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>
    </template>

    <!-- 编辑模式 -->
    <template v-else>
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <input
            v-model="newUsername"
            type="text"
            class="input input-bordered input-sm w-48"
            placeholder="输入新用户名"
            @keyup.enter="saveUsername"
          />
          <button
            class="btn btn-info btn-sm"
            :class="{ 'btn-disabled': loading }"
            :disabled="loading"
            @click="saveUsername"
          >
            <span v-if="loading" class="loading loading-spinner loading-xs mr-1"></span>
            保存
          </button>
          <button class="btn btn-ghost btn-sm" @click="cancelEditing">取消</button>
        </div>
        <p v-if="error" class="text-error text-xs">{{ error }}</p>
      </div>
    </template>
  </div>
</template>

<style scoped>
</style>
