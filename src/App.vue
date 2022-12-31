<script setup lang="ts">
import { naiveUiLanguage } from "src/i18n/index";
import { theme } from "src/config"
</script>

<template>
  <n-config-provider :theme="theme" :locale="naiveUiLanguage.locale" :date-locale="naiveUiLanguage.date">
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
