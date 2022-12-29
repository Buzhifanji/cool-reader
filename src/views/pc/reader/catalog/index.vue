<script setup lang="ts">
import { Bookextname, useReadBookStore } from "src/core/book";
import Menu from './menu.vue'
import { useHandleCatalogJump } from '../reader'

const bookStore = useReadBookStore();

const { jump } = useHandleCatalogJump()

class Keys {
  constructor(
    public key: string,
    public label: string,
    public children: string
  ) { }
}

const menuKes = computed(() => {
  switch (bookStore.readingBook.extname) {
    case Bookextname.pdf:
      return new Keys("dest", "title", "items");
    case Bookextname.epub:
      return new Keys("href", "label", "subitems");
    case Bookextname.mobi:
      return new Keys("label", "label", "subitems");
    case Bookextname.azw3:
      return new Keys("label", "label", "subitems");
    case Bookextname.txt:
      return new Keys("label", "label", "subitems");
    default:
      console.warn("TODO: Unknown readingBook.extname");
      return new Keys("key", "label", "children");
  }
});


</script>

<template>
  <Menu v-model:value="bookStore.readingBook.chapter" @change="jump" :options="bookStore.readingBook.catalog"
    :label="menuKes.label" :children="menuKes.children" />
</template>

<style scoped>
.n-menu {
  height: calc(100% - 180px - 20px);
  overflow-y: auto;
  margin-top: -24px;
}
</style>
