<script setup>
import { ref } from 'vue'

const username = ref('')
const password = ref('')
</script>

<template>
  <div class="flex justify-center items-center min-h-[calc(100vh-64px)]">
    <div class="card bg-base-200 w-96 shadow-sm">
      <div class="card-body">
        <h2 class="card-title justify-center text-2xl mb-4">登录</h2>
        <form @submit.prevent>
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
          <button class="btn btn-primary w-full mt-6">登录</button>
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
