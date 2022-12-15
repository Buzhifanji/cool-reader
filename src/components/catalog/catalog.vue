<script setup lang="ts">
import { useCatalog, useBookJump } from "./catalog";
import Menu from './menu.vue'

const { readingBook, menuKes } = useCatalog();
const { catalogJump } = useBookJump();

const selectedKey = ref('')

</script>

<template>
  <Menu v-model:value="selectedKey" @change="catalogJump" :options="readingBook.catalog" :label="menuKes.label"
    :children="menuKes.children" />
</template>

<style scoped>
.n-menu {
  height: calc(100% - 180px - 20px);
  overflow-y: auto;
  margin-top: -24px;
}
</style>
