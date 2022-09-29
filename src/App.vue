<script setup lang="ts"></script>

<template>
  <n-notification-provider>
    <router-view></router-view>
  </n-notification-provider>
</template>

<style scoped>
.logo.vite:hover {
  filter: drop-shadow(0 0 2em #747bff);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #249b73);
}
</style>
