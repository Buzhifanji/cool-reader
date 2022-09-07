<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
import { WebviewWindow } from '@tauri-apps/api/window';
import { NNotificationProvider } from 'naive-ui';

function open() {
  console.log('open');

  const webview = new WebviewWindow('my-label', {
    url: 'https://github.com/tauri-apps/tauri'
  });
  console.log('webview,', webview);

  webview.once('tauri://created', function () {
    // webview window successfully created
  });
  webview.once('tauri://error', function (e) {
    // an error happened creating the webview window
  });
}
</script>

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
