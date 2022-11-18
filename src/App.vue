<script setup lang="ts">
import { naiveUiLanguage } from "src/i18n/index";

import { lightTheme } from "naive-ui";
</script>

<template>
  <n-config-provider :theme="lightTheme" :locale="naiveUiLanguage.locale" :date-locale="naiveUiLanguage.date">
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
