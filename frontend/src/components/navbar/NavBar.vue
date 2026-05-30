<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const menuRef = ref(null)
const avatarMenuRef = ref(null)

function closeAllMenus() {
  if (menuRef.value?.hasAttribute('open')) {
    menuRef.value.removeAttribute('open')
  }
  if (avatarMenuRef.value?.hasAttribute('open')) {
    avatarMenuRef.value.removeAttribute('open')
  }
}

function handleDocumentClick(e) {
  if (menuRef.value && !menuRef.value.contains(e.target)) {
    menuRef.value.removeAttribute('open')
  }
  if (avatarMenuRef.value && !avatarMenuRef.value.contains(e.target)) {
    avatarMenuRef.value.removeAttribute('open')
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick, true)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick, true)
})

watch(() => router.currentRoute.value, () => {
  nextTick(closeAllMenus)
})

function handleLogout() {
  closeAllMenus()
  userStore.logout()
  router.push({ name: 'homeIndex' })
}
</script>

<template>
  <div class="navbar bg-base-100 shadow-sm">
    <div class="navbar-start">
      <details ref="menuRef" class="dropdown">
        <summary class="btn btn-ghost btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" /> </svg>
        </summary>
        <ul
          class="menu menu-base dropdown-content bg-base-100 rounded-box z-1 mt-3 w-64 p-3 shadow-lg">
          <li @click="closeAllMenus">
            <router-link :to="{name: 'homeIndex'}">主页</router-link>
          </li>
          <template v-if="userStore.isLoggedIn">
            <li @click="closeAllMenus">
              <router-link :to="{name: 'singlePlayerIndex'}">单人游戏</router-link>
            </li>
            <li @click="closeAllMenus">
              <router-link :to="{name: 'multiPlayerIndex'}">多人游戏</router-link>
            </li>
            <li @click="closeAllMenus">
              <router-link :to="{name: 'ranklistIndex'}">排行榜</router-link>
            </li>
          </template>
        </ul>
      </details>
    </div>
    <div class="navbar-center">
      <a class="btn btn-ghost text-xl">Ball Attacker</a>
    </div>
    <div class="navbar-end mr-2">
      <template v-if="userStore.isLoggedIn && userStore.user">
        <details ref="avatarMenuRef" class="dropdown dropdown-end">
          <summary class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img :src="userStore.user.avatar" alt="avatar" />
            </div>
          </summary>
          <ul
            class="menu menu-base dropdown-content bg-base-100 rounded-box z-1 mt-3 w-64 p-3 shadow-lg">
            <li @click="closeAllMenus">
              <router-link :to="{name: 'profileIndex', params: {id: userStore.user.id}}" class="flex items-center gap-4 py-2 px-2">
                <div class="w-10 h-10 rounded-full overflow-hidden shrink-0">
                  <img :src="userStore.user.avatar" alt="avatar" class="w-full h-full object-cover" />
                </div>
                <span class="text-base font-semibold truncate">{{ userStore.user.username }}</span>
              </router-link>
            </li>
            <div class="divider my-1 h-px"></div>
            <li>
              <a @click="handleLogout" class="text-error gap-3 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                退出登录
              </a>
            </li>
          </ul>
        </details>
      </template>
      <template v-else>
        <router-link :to="{name: 'loginIndex'}" class="text-base font-bold mr-4">登录</router-link>
      </template>
    </div>
  </div>
</template>

<style scoped>

</style>
