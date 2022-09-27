<template>
  <n-scrollbar v-if="catalog.length">
    <n-menu
      :collapsed-icon-size="22"
      :options="catalog"
      key-field="title"
      label-field="title"
      children-field="items"
      @update:value="updateCatalog"
    />
  </n-scrollbar>
  <n-result
    v-else
    status="403"
    title="没有目录"
    description="总有些门是对你关闭的"
  />
</template>

<script setup lang="ts">
import { MenuOption } from "naive-ui";
import { generateGotoPage } from "../../core/book/catalog";
import { StorageBook } from "../../core/type";
import { catalog } from "./book";

interface Props {
  book: StorageBook;
}

const { book } = defineProps<Props>();

function updateCatalog(key: string, item: MenuOption) {
  const { id, extname } = book;
  const desc = item.dest as unknown as any;
  const param = { id, extname, desc };
  generateGotoPage(param);
}
</script>
