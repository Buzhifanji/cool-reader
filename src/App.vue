<script setup lang="ts">
import { lightTheme } from "naive-ui";
</script>

<template>
  <n-config-provider :theme="lightTheme">
    <router-view></router-view>
  </n-config-provider>
</template>

<style scoped>
.n-config-provider {
  height: 100vh;
  display: flex;
  width: 100%;
}
</style>
