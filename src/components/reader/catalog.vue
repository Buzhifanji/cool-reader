<template>
  <n-menu
    v-if="catalog.length"
    :collapsed-icon-size="22"
    :options="catalog"
    key-field="title"
    label-field="title"
    children-field="items"
  />
  <n-result
    v-else
    status="403"
    title="没有目录"
    description="总有些门是对你关闭的"
  />
</template>

<script setup lang="ts">
import { catalog } from "./book";
</script>
