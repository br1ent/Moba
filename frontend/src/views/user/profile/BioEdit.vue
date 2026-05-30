<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const showModal = ref(false)
const loading = ref(false)
const error = ref('')
const bioText = ref('')

function openModal() {
  bioText.value = userStore.user?.bio || ''
  error.value = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  error.value = ''
}

async function handleSave() {
  loading.value = true
  error.value = ''

  try {
    await userStore.updateBio(bioText.value.trim())
    closeModal()
  } catch (err) {
    error.value = err.response?.data?.bio?.[0] || '修改失败'
  } finally {
    loading.value = false
  }
}

defineExpose({
  openModal
})
</script>

<template>
  <div class="w-full">
    <!-- 显示区域 -->
    <p class="text-base-content/80 whitespace-pre-wrap">{{ userStore.user?.bio || '这个人很懒，什么都没写~' }}</p>

    <!-- 编辑弹窗 -->
    <dialog :class="{ 'modal modal-open': showModal }" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">编辑个人简介</h3>

        <!-- 错误提示 -->
        <div v-if="error" class="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ error }}</span>
        </div>

        <!-- 表单 -->
        <div class="form-control">
          <textarea
            v-model="bioText"
            class="textarea textarea-bordered h-32 w-full"
            placeholder="写点什么介绍自己吧..."
            maxlength="200"
          ></textarea>
          <label class="label">
            <span class="label-text-alt text-base-content/60">{{ bioText.length }}/200</span>
          </label>
        </div>

        <div class="modal-action">
          <button class="btn" @click="closeModal">取消</button>
          <button
            class="btn btn-info"
            :class="{ 'btn-disabled': loading }"
            :disabled="loading"
            @click="handleSave"
          >
            <span v-if="loading" class="loading loading-spinner loading-sm mr-2"></span>
            保存
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop" @click="closeModal">
        <button>关闭</button>
      </form>
    </dialog>
  </div>
</template>

<style scoped>
</style>
