<template>
  <n-card
    hoverable
    v-for="(item, index) in books"
    @click="openBook(item, index)"
  >
    <template #cover>
      <n-image :src="item.cover" preview-disabled />
    </template>
    <n-ellipsis :line-clamp="1">
      {{ item.bookName }}
    </n-ellipsis>
  </n-card>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { books, initBook } from "../core/book";
import { StorageBook } from "../core/type";
import { RouterName } from "../route";

initBook();
const router = useRouter();
function openBook(book: StorageBook, index: number) {
  router.push({ name: RouterName.view, query: { index } });
  console.log("kkkkkkkkkkkkk", book);
  console.log("index", index);
}
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
