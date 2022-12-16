<script setup lang="ts">
import { Delete, FaceWink } from "@vicons/carbon";
import { highlights, removeHighlight } from "./highlight";
import { useBookJump } from '../catalog/catalog'
import { langField } from "src/i18n";

const { jumpByChapter } = useBookJump();

</script>

<template>
  <n-list hoverable clickable v-if="highlights.length">
    <n-list-item v-for="item in highlights" :key="item.id" @click="jumpByChapter(item.chapter)">
      <template #suffix>
        <n-icon size="16" :component="Delete" @click.stop="removeHighlight(item)" />
      </template>
      <n-ellipsis :line-clamp="2">
        {{ item.text }}
      </n-ellipsis>
    </n-list-item>
  </n-list>
  <n-empty :description="langField.nothing" v-else>
    <template #icon>
      <n-icon>
        <FaceWink />
      </n-icon>
    </template>
  </n-empty>
</template>
