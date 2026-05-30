<script setup>
defineProps({
  avatar: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  rankScore: {
    type: Number,
    default: 1000
  }
})
</script>

<template>
  <div class="card bg-base-200 shadow-lg w-64">
    <div class="card-body items-center text-center p-6">
      <div class="avatar">
        <div class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          <img :src="avatar" :alt="username" />
        </div>
      </div>
      <h2 class="card-title mt-4">{{ username }}</h2>
      <div class="badge badge-primary badge-lg mt-2">
        天梯分: {{ rankScore }}
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
