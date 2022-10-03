<template>
  <n-list hoverable clickable>
    <n-list-item v-for="item in highlights" :key="item.id">
      {{ item.text }}
    </n-list-item>
  </n-list>
</template>

<script setup lang="ts">
import { highlights } from "./highlight";
</script>
