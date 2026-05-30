<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold">个人空间</h1>
    <p class="mt-2 text-gray-500">用户 ID: {{ route.params.id }}</p>
  </div>
</template>
