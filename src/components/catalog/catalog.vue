<template>
  <n-menu
    v-if="catalog.length"
    :collapsed-icon-size="22"
    :options="catalog"
    :key-field="menuFieds.key"
    :label-field="menuFieds.label"
    :children-field="menuFieds.children"
    @update:value="updateCatalog"
  />
  <n-result
    v-else
    status="403"
    title="没有目录"
    description="总有些门是对你关闭的"
  />
</template>

<script setup lang="ts">
import { MenuOption } from "naive-ui";
import { StorageBook } from "../../core/type";
import { generateGotoPage, useCatalog } from "./catalog";

interface Props {
  book: StorageBook;
}

const { book } = defineProps<Props>();

const { catalog, menuFieds } = useCatalog(book);

function updateCatalog(key: string, item: MenuOption) {
  const { id, extname } = book;
  const param = { id, extname, item };
  generateGotoPage(param);
}
</script>
