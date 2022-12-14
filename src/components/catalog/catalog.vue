<script setup lang="ts">
import { MenuInst, MenuOption } from "naive-ui";
import { langField } from "src/i18n";
import { useCatalog, useBookJump } from "./catalog";
import Menu from './menu.vue'

const { readingBook, menuKes } = useCatalog();
const { catalogJump, catalogExpanedJump } = useBookJump();

const selectedKey = ref('')

</script>

<template>
  <Menu v-model:value="selectedKey" @update:value="catalogExpanedJump" :options="readingBook.catalog"
    :key-filed="menuKes.key" :label="menuKes.label" :children="menuKes.children" />
  <!-- <n-menu ref="menuInstRef" accordion v-model:value="selectedKey" v-if="readingBook.catalog.length" :root-indent="12"
    :indent="10" :collapsed-icon-size="22" :options="readingBook.catalog" :key-field="menuKes.key"
    :label-field="menuKes.label" :children-field="menuKes.children" @update:value="updateCatalog"
    @update:expanded-keys="catalogExpaned" />
  <n-result v-else status="403" :title="langField.noCatalog" :description="langField.noCatalogDescription" /> -->
</template>

<style scoped>
.n-menu {
  height: calc(100% - 180px - 20px);
  overflow-y: auto;
  margin-top: -24px;
}
</style>
