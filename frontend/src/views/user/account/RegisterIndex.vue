<script setup>
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
</script>

<template>
  <div class="flex justify-center items-center min-h-[calc(100vh-64px)]">
    <div class="card bg-base-200 w-96 shadow-sm">
      <div class="card-body">
        <h2 class="card-title justify-center text-2xl mb-4">注册</h2>
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
            <label class="fieldset-legend mt-4">确认密码</label>
            <input
              v-model="confirmPassword"
              type="password"
              class="input w-full"
              placeholder="请再次输入密码"
            />
          </fieldset>
          <button class="btn btn-primary w-full mt-6">注册</button>
        </form>
        <div class="text-center mt-4">
          <router-link :to="{ name: 'loginIndex' }" class="link link-primary">
            已有账号？返回登录
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
