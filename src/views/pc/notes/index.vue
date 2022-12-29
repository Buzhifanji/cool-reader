
<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'

const winMin = () => appWindow.minimize();
const winToggle = () => appWindow.toggleMaximize();
const winMax = () => appWindow.maximize();
</script>
<template>
  <div>notes</div>
  <button @click="winMin">winMin</button>
  <button @click="winMax">winMax</button>
  <button @click="winToggle">winToggle</button>
</template>