<template>
  <div>book</div>
  <button @click="action">测试</button>
  <div>{{ value }}</div>
</template>

<script setup lang="ts">
import { invoke } from '@tauri-apps/api/tauri';
import { ref } from 'vue';
const value = ref<string>('aa')
async function action() {
  const result = (await invoke('hello')) as string
  value.value = result
  const temp = (await invoke('readfile', { path: 'home' })) as string
}
</script>