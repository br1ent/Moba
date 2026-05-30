<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const showModal = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref(false)

const form = ref({
  oldPassword: '',
  newPassword: '',
  newPasswordConfirm: ''
})

function openModal() {
  form.value = { oldPassword: '', newPassword: '', newPasswordConfirm: '' }
  error.value = ''
  success.value = false
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  error.value = ''
  success.value = false
}

async function handleSubmit() {
  error.value = ''
  success.value = false

  if (!form.value.oldPassword) {
    error.value = '请输入当前密码'
    return
  }

  if (!form.value.newPassword) {
    error.value = '请输入新密码'
    return
  }

  if (form.value.newPassword.length < 8) {
    error.value = '新密码长度不能少于8位'
    return
  }

  if (form.value.newPassword !== form.value.newPasswordConfirm) {
    error.value = '两次密码不一致'
    return
  }

  loading.value = true

  try {
    await userStore.updatePassword(
      form.value.oldPassword,
      form.value.newPassword,
      form.value.newPasswordConfirm
    )
    success.value = true
    setTimeout(() => {
      closeModal()
    }, 1500)
  } catch (err) {
    error.value = err.response?.data?.old_password?.[0] ||
                 err.response?.data?.new_password?.[0] ||
                 err.response?.data?.new_password_confirm?.[0] ||
                 '修改失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <!-- 触发按钮 -->
    <button class="btn btn-outline btn-warning" @click="openModal">
      修改密码
    </button>

    <!-- 弹窗 -->
    <dialog :class="{ 'modal modal-open': showModal }" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">修改密码</h3>

        <!-- 成功提示 -->
        <div v-if="success" class="alert alert-success mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>密码修改成功！</span>
        </div>

        <!-- 错误提示 -->
        <div v-if="error" class="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ error }}</span>
        </div>

        <!-- 表单 -->
        <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">当前密码</span>
            </label>
            <input
              v-model="form.oldPassword"
              type="password"
              class="input input-bordered w-full"
              placeholder="请输入当前密码"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">新密码</span>
            </label>
            <input
              v-model="form.newPassword"
              type="password"
              class="input input-bordered w-full"
              placeholder="请输入新密码（至少8位）"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">确认新密码</span>
            </label>
            <input
              v-model="form.newPasswordConfirm"
              type="password"
              class="input input-bordered w-full"
              placeholder="请再次输入新密码"
            />
          </div>

          <div class="modal-action">
            <button type="button" class="btn" @click="closeModal">取消</button>
            <button
              type="submit"
              class="btn btn-info"
              :class="{ 'btn-disabled': loading || success }"
              :disabled="loading || success"
            >
              <span v-if="loading" class="loading loading-spinner loading-sm mr-2"></span>
              {{ success ? '修改成功' : '确认修改' }}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop" @click="closeModal">
        <button>关闭</button>
      </form>
    </dialog>
  </div>
</template>

<style scoped>
</style>
