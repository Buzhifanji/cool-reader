<script setup lang="ts">
import { MenuOption } from "naive-ui";
import { langField } from "src/i18n";
import { useCatalog, useBookJump } from "./catalog";

const { readingBook, menuKes } = useCatalog();
const { catalogJump } = useBookJump();
function updateCatalog(key: string, item: MenuOption) {
  console.log(key)
  catalogJump(item);
}

function catalogExpaned(key: string) {
  console.log(key);
}
</script>

<template>
  <n-menu v-if="readingBook.catalog.length" :root-indent="12" :indent="10" :collapsed-icon-size="22"
    :options="readingBook.catalog" :key-field="menuKes.key" :label-field="menuKes.label"
    :children-field="menuKes.children" @update:value="updateCatalog" @update:expanded-keys="catalogExpaned" />
  <n-result v-else status="403" :title="langField.noCatalog" :description="langField.noCatalogDescription" />
</template>

<style scoped>
.n-menu {
  height: calc(100% - 180px - 20px);
  overflow-y: auto;
  margin-top: -24px;
}
</style>
