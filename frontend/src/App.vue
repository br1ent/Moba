<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import NavBar from "@/components/navbar/NavBar.vue";
import { useUserStore } from '@/stores/user'
import axios from 'axios'

const userStore = useUserStore()

onMounted(async () => {
  try {
    const res = await axios.post('/api/user/account/token/refresh/')
    userStore.setAccessToken(res.data.access)
    await userStore.fetchUserinfo()
  } catch {
    userStore.logout()
  }
})
</script>

<template>
  <NavBar />
  <RouterView />
</template>

<style scoped></style>
