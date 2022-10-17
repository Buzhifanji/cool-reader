<script setup lang="ts">
import { useNoteJumpAndRemove } from "@/core/notes/notes";
import { Delete, FaceWink } from "@vicons/carbon";
import { notes } from "./notes";
const { remove, jump } = useNoteJumpAndRemove();
</script>

<template>
  <n-list hoverable clickable v-if="notes.length">
    <n-list-item v-for="item in notes" :key="item.id" @click="jump(item)">
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
