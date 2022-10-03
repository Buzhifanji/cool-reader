<template>
  <n-list hoverable clickable>
    <n-list-item v-for="item in highlights" :key="item.id">
      <n-ellipsis :line-clamp="2">
        {{ item.text }}
      </n-ellipsis>
    </n-list-item>
  </n-list>
</template>

<script setup lang="ts">
import { highlights } from "./highlight";
</script>
