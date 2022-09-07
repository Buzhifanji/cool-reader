<template>
  <n-card hoverable v-for="item in books" @click="openBook(item)">
    <template #cover>
      <n-image src="src/assets/2.jpg" preview-disabled />
    </template>
    <n-ellipsis :line-clamp="1">
      {{ item.bookName }}
    </n-ellipsis>
  </n-card>
</template>

<script setup lang="ts">
import { NCard, NEllipsis, NImage } from "naive-ui";
import { ref } from "vue";
import { BaseBookType } from "../core/type";

const books = ref<BaseBookType[]>([
  {
    bookName: "name1name1name1name1name1name1name1name1name1",
    extname: "pdf",
    author: "佚名",
    category: "",
    size: 100,
    path: "home",
    content: [],
    id: "1",
  },
  {
    bookName: "name2",
    extname: "pdf",
    author: "佚名",
    category: "",
    size: 100,
    path: "home",
    content: [],
    id: "2",
  },
  {
    bookName: "name3",
    extname: "pdf",
    author: "佚名",
    category: "",
    size: 100,
    path: "home",
    content: [],
    id: "3",
  },
  {
    bookName: "name1name1name1name1name1name1name1name1name1",
    extname: "pdf",
    author: "佚名",
    category: "",
    size: 100,
    path: "home",
    content: [],
    id: "1",
  },
  {
    bookName: "name2",
    extname: "pdf",
    author: "佚名",
    category: "",
    size: 100,
    path: "home",
    content: [],
    id: "2",
  },
  {
    bookName: "name3",
    extname: "pdf",
    author: "佚名",
    category: "",
    size: 100,
    path: "home",
    content: [],
    id: "3",
  },
  {
    bookName: "name1name1name1name1name1name1name1name1name1",
    extname: "pdf",
    author: "佚名",
    category: "",
    size: 100,
    path: "home",
    content: [],
    id: "1",
  },
  {
    bookName: "name2",
    extname: "pdf",
    author: "佚名",
    category: "",
    size: 100,
    path: "home",
    content: [],
    id: "2",
  },
  {
    bookName: "name3",
    extname: "pdf",
    author: "佚名",
    category: "",
    size: 100,
    path: "home",
    content: [],
    id: "3",
  },
  {
    bookName: "name1name1name1name1name1name1name1name1name1",
    extname: "pdf",
    author: "佚名",
    category: "",
    size: 100,
    path: "home",
    content: [],
    id: "1",
  },
  {
    bookName: "name2",
    extname: "pdf",
    author: "佚名",
    category: "",
    size: 100,
    path: "home",
    content: [],
    id: "2",
  },
  {
    bookName: "name3",
    extname: "pdf",
    author: "佚名",
    category: "",
    size: 100,
    path: "home",
    content: [],
    id: "3",
  },
]);

function openBook(book: BaseBookType) {}
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
