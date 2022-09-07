<template>
  <n-card hoverable v-for="item in books" @click="openBook(item)">
    <template #cover>
      <n-image :src="item.cover" preview-disabled />
    </template>
    <n-ellipsis :line-clamp="1">
      {{ item.bookName }}
    </n-ellipsis>
  </n-card>
</template>

<script setup lang="ts">
import { NCard, NEllipsis, NImage, useNotification } from "naive-ui";
import { books, initBook } from "../core/book";
import { bookType } from "../core/type";

const notification = useNotification();
initBook(notification);

function openBook(book: bookType) {}
</script>

<style scoped>
.n-card {
  display: inline-flex;
  width: 180px;
  margin-right: 20px;
  margin-top: 20px;
  cursor: pointer;
}
</style>
