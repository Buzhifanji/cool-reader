<script setup lang="ts">
import { useNoteJumpAndRemove } from "@/core/notes/notes";
import { Delete, FaceWink } from "@vicons/carbon";
import { highlights } from "./highlight";
const { remove, jump } = useNoteJumpAndRemove();
</script>

<template>
  <n-list hoverable clickable v-if="highlights.length">
    <n-list-item v-for="item in highlights" :key="item.id" @click="jump(item)">
      <template #suffix>
        <n-icon size="16" :component="Delete" @click.stop="remove(item)" />
      </template>
      <n-ellipsis :line-clamp="2">
        {{ item.text }}
      </n-ellipsis>
    </n-list-item>
  </n-list>
  <n-empty description="空空如也" v-else>
    <template #icon>
      <n-icon>
        <FaceWink />
      </n-icon>
    </template>
  </n-empty>
</template>
