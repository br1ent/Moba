<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import AvatarUpload from './AvatarUpload.vue'
import UsernameEdit from './UsernameEdit.vue'
import BioEdit from './BioEdit.vue'
import PasswordChange from './PasswordChange.vue'

const userStore = useUserStore()

onMounted(async () => {
  await userStore.fetchUserinfo()
})
</script>

<template>
  <div class="min-h-screen bg-base-200 py-8">
    <div class="max-w-2xl mx-auto space-y-6">
      <!-- 用户信息卡片 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-2xl mb-4">个人信息</h2>

          <!-- 用户信息 - 左右布局 -->
          <div class="flex flex-row gap-8">
            <!-- 左侧 - 头像 -->
            <div class="flex-shrink-0">
              <AvatarUpload />
            </div>

            <!-- 右侧 - 用户信息 -->
            <div class="flex-1 space-y-6">
              <!-- 用户名 -->
              <UsernameEdit />

              <!-- 用户简介 -->
              <div>
                <span class="text-sm font-medium text-base-content/60">个人简介</span>
                <div class="mt-2">
                  <BioEdit />
                </div>
              </div>

              <!-- 天梯分 -->
              <div>
                <span class="text-sm font-medium text-base-content/60">历史最高天梯分</span>
                <p class="text-lg font-semibold mt-2">{{ userStore.user?.rank_score || 0 }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 安全设置卡片 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-xl mb-4">安全设置</h2>
          <div class="flex justify-center">
            <PasswordChange />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
