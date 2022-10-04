<template>
  <n-list hoverable clickable>
    <n-list-item v-for="item in highlights" :key="item.id" @click="jump(item)">
      <template #suffix>
        <n-icon size="16" :component="Delete" @click.stop="remove(item)" />
      </template>
      <n-ellipsis :line-clamp="2">
        {{ item.text }}
      </n-ellipsis>
    </n-list-item>
  </n-list>
</template>

<script setup lang="ts">
import { Delete } from "@vicons/carbon";
import { highlights, useHighlights } from "./highlight";
const { remove, jump } = useHighlights();
</script>
