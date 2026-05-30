<script setup>

</script>

<template>
  <div class="navbar bg-base-100 shadow-sm">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" /> </svg>
        </div>
        <ul
          tabindex="-1"
          class="menu menu-base dropdown-content bg-base-100 rounded-box z-1 mt-3 w-62 p-3 shadow">
          <li>
            <router-link :to="{name: 'homeIndex'}">主页</router-link>
          </li>
          <li>
            <router-link :to="{name: 'singlePlayerIndex'}">单人游戏</router-link>
          </li>
          <li>
            <router-link :to="{name: 'multiPlayerIndex'}">多人游戏</router-link>
          </li>
          <li>
            <router-link :to="{name: 'ranklistIndex'}"> 排行榜</router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="navbar-center">
      <a class="btn btn-ghost text-xl">Ball Attacker</a>
    </div>
    <div class="navbar-end">
      <router-link :to="{name: 'loginIndex'}" class="text-base font-bold mr-4">登录</router-link>
    </div>
  </div>
</template>

<style scoped>

</style>