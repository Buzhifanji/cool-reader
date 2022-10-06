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
import { generateGotoPage, useCatalog } from "./catalog";

const { catalog, menuFieds } = useCatalog();

function updateCatalog(key: string, item: MenuOption) {
  generateGotoPage(item);
}
</script>
