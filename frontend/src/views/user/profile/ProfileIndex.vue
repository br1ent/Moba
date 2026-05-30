<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import AvatarUpload from './AvatarUpload.vue'
import UsernameEdit from './UsernameEdit.vue'
import BioEdit from './BioEdit.vue'
import PasswordChange from './PasswordChange.vue'

const userStore = useUserStore()
const bioEditRef = ref(null)

onMounted(async () => {
  await userStore.fetchUserinfo()
})
</script>

<template>
  <div class="min-h-screen bg-base-200 py-8">
    <div class="max-w-2xl mx-auto space-y-8">
      <!-- 用户信息卡片 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body p-8">
          <h2 class="card-title text-2xl mb-6">个人信息</h2>

          <!-- 用户信息 - 左右布局 -->
          <div class="flex flex-row gap-10">
            <!-- 左侧 - 头像 -->
            <div class="flex-shrink-0">
              <AvatarUpload />
            </div>

            <!-- 右侧 - 用户信息 -->
            <div class="flex-1 space-y-8">
              <!-- 用户名 -->
              <UsernameEdit />

              <!-- 用户简介 -->
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-base-content/60">个人简介</span>
                  <button class="btn btn-ghost btn-sm btn-circle" @click="bioEditRef?.openModal()">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
                <div class="mt-3">
                  <BioEdit ref="bioEditRef" />
                </div>
              </div>

              <!-- 天梯分 -->
              <div>
                <span class="text-sm font-medium text-base-content/60">历史最高天梯分</span>
                <p class="text-lg font-semibold mt-3">{{ userStore.user?.rank_score || 0 }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 安全设置卡片 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body p-8">
          <h2 class="card-title text-xl mb-6">安全设置</h2>
          <div class="flex items-center justify-between pr-4">
            <span class="text-sm font-medium text-base-content/60">密码管理</span>
            <PasswordChange />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
