<script setup lang="ts">
import { useCatalog, useBookJump } from "./catalog";
import Menu from './menu.vue'

const { readingBook, menuKes } = useCatalog();
const { catalogJump } = useBookJump();

const selectedKey = ref('')

</script>

<template>
  <Menu v-model:value="selectedKey" @update:value="catalogJump" :options="readingBook.catalog" :key-filed="menuKes.key"
    :label="menuKes.label" :children="menuKes.children" />
</template>

<style scoped>
.n-menu {
  height: calc(100% - 180px - 20px);
  overflow-y: auto;
  margin-top: -24px;
}
</style>
