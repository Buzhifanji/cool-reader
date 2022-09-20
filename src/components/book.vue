<template>
  <n-progress
    v-if="percentage"
    type="line"
    :percentage="percentage"
    :indicator-placement="'inside'"
    processing
  />
  <template v-if="books.length">
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

  <n-result
    v-else
    status="418"
    title="暂无书本可读"
    description="一切尽在不言中"
  >
    <template #footer>
      <n-button @click="openFile">从本地导入</n-button>
    </template>
  </n-result>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { books, initBook } from "../core/book/book";
import { openFile } from "../core/file/file";
import { percentage } from "../core/file/file-size";
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
