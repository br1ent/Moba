<script setup>
import { ref, watch, nextTick } from 'vue'
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
          class="menu menu-base dropdown-content bg-base-100 rounded-box z-1 mt-3 w-62 p-3 shadow">
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
    <div class="navbar-end">
      <template v-if="userStore.isLoggedIn && userStore.user">
        <details ref="avatarMenuRef" class="dropdown dropdown-end">
          <summary class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img :src="userStore.user.avatar" alt="avatar" />
            </div>
          </summary>
          <ul
            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            <li @click="closeAllMenus">
              <router-link :to="{name: 'homeIndex'}">个人空间</router-link>
            </li>
            <li>
              <a @click="handleLogout">退出</a>
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
