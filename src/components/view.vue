<template>
  <div><button @click="goHome">go home</button></div>
  <section id="view-container"></section>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { books, openBook } from "../core/book";
import { loadPdf } from "../core/pdf";

const router = useRouter();
const route = useRoute();

render();

async function render() {
  const index = Number(route.query.index);
  const selectedBook = books.value[index];
  console.log("selectedBook", selectedBook);
  const content = await openBook(selectedBook.id);
  if (content) {
    console.log("content", content);
    loadPdf(content as unknown as Uint8Array);
  } else {
    console.log("没有数据");
  }
  //
}

function goHome() {
  router.push("/");
}
</script>
