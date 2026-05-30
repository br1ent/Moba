<script setup>
import { ref, onUnmounted, nextTick } from 'vue'
import { useUserStore } from '@/stores/user'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

const userStore = useUserStore()

const fileInput = ref(null)
const imageRef = ref(null)
const showModal = ref(false)
const loading = ref(false)
const cropper = ref(null)

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileChange(event) {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件')
    return
  }

  showModal.value = true

  const reader = new FileReader()
  reader.onload = (e) => {
    nextTick(() => {
      if (imageRef.value) {
        imageRef.value.src = e.target.result
        initCropper()
      }
    })
  }
  reader.readAsDataURL(file)
}

function initCropper() {
  if (cropper.value) {
    cropper.value.destroy()
  }

  cropper.value = new Cropper(imageRef.value, {
    aspectRatio: 1,
    viewMode: 1,
    dragMode: 'move',
    autoCropArea: 0.8,
    restore: false,
    guides: true,
    center: true,
    highlight: true,
    cropBoxMovable: true,
    cropBoxResizable: true,
    scalable: true,
    zoomable: true,
    zoomOnTouch: true,
    zoomOnWheel: true,
    wheelZoomRatio: 0.1,
    movable: true,
    rotatable: true,
  })
}

async function handleConfirm() {
  if (!cropper.value) return

  loading.value = true

  try {
    const canvas = cropper.value.getCroppedCanvas({
      width: 200,
      height: 200,
      fillColor: '#fff',
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    })

    canvas.toBlob(async (blob) => {
      const file = new File([blob], 'avatar.jpg', {
        type: 'image/jpeg',
      })

      await userStore.updateAvatar(file)
      closeModal()
      loading.value = false
    }, 'image/jpeg')
  } catch (error) {
    console.error('上传头像失败:', error)
    loading.value = false
  }
}

function closeModal() {
  showModal.value = false
  if (cropper.value) {
    cropper.value.destroy()
    cropper.value = null
  }
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

onUnmounted(() => {
  if (cropper.value) {
    cropper.value.destroy()
  }
})
</script>

<template>
  <div class="flex flex-col items-center">
    <!-- 头像显示区域 -->
    <div class="relative group cursor-pointer" @click="triggerFileInput">
      <div class="avatar">
        <div class="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          <img :src="userStore.user?.avatar" alt="头像" />
        </div>
      </div>
      <!-- 悬停提示 -->
      <div class="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span class="text-white text-sm font-medium">更换头像</span>
      </div>
    </div>

    <!-- 用户 ID -->
    <p class="text-sm text-base-content/60 mt-4">玩家id：{{ userStore.user?.id }}</p>

    <!-- 隐藏的文件输入 -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileChange"
    />

    <!-- 裁剪弹窗 -->
    <dialog :class="{ 'modal modal-open': showModal }" class="modal">
      <div class="modal-box max-w-lg">
        <h3 class="font-bold text-lg mb-4">裁剪头像</h3>
        <p class="text-sm text-base-content/60 mb-4">拖动图片调整位置，滚轮缩放大小</p>
        <div class="w-full overflow-hidden rounded-lg bg-base-300">
          <img ref="imageRef" class="max-w-full" />
        </div>
        <div class="modal-action">
          <button class="btn" @click="closeModal">取消</button>
          <button
            class="btn btn-info"
            :class="{ 'btn-disabled': loading }"
            :disabled="loading"
            @click="handleConfirm"
          >
            <span v-if="loading" class="loading loading-spinner loading-sm mr-2"></span>
            确认
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
