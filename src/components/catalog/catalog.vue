<script setup lang="ts">
import { MenuOption } from "naive-ui";
import { generateGotoPage, useCatalog } from "./catalog";

const { readingBook, menuKes } = useCatalog();

function updateCatalog(key: string, item: MenuOption) {
  generateGotoPage(item);
}
</script>

<template>
  <n-menu v-if="readingBook.catalog.length" :root-indent="12" :indent="10" :collapsed-icon-size="22"
    :options="readingBook.catalog" :key-field="menuKes.key" :label-field="menuKes.label"
    :children-field="menuKes.children" @update:value="updateCatalog" />
  <n-result v-else status="403" title="没有目录" description="总有些门是对你关闭的" />
</template>

<style scoped>
.n-menu {
  height: calc(100% - 180px - 20px);
  overflow-y: auto;
  margin-top: -24px;
}
</style>
