<template>
  <n-progress
    v-if="percentage"
    type="line"
    :percentage="percentage"
    :indicator-placement="'inside'"
    processing
  />
  <template v-if="books.length">
    <n-card
      hoverable
      v-for="item in books"
      :key="item.id"
      @contextmenu="handleContextMenu"
      @click="openReaderWindow(item)"
    >
      <template #cover>
        <n-image :src="item.cover" preview-disabled />
      </template>
      <n-ellipsis :line-clamp="1">
        {{ item.bookName }}
      </n-ellipsis>
    </n-card>
    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="xRef"
      :y="yRef"
      :options="menus"
      :show="showDropdownRef"
      :on-clickoutside="onClickoutside"
      @select="handleSelect"
    />
  </template>

  <n-result
    v-else
    status="418"
    title="暂无书本可读"
    description="一切尽在不言中"
  >
    <template #footer>
      <n-button @click="openFile">从本地导入</n-button>
    </template>
  </n-result>
</template>

<script setup lang="ts">
import { books, initBook } from "../../core/book/book";
import { openFile } from "../../core/file/file";
import { percentage } from "../../core/file/file-size";
import { openReaderWindow } from "../../core/system/window";
import { useContextMenu } from "./book-list";

initBook();
const {
  showDropdownRef,
  xRef,
  yRef,
  handleSelect,
  handleContextMenu,
  onClickoutside,
  menus,
} = useContextMenu();
</script>

<style scoped>
.n-card {
  display: inline-flex;
  width: 180px;
  margin-right: 20px;
  margin-top: 20px;
  cursor: pointer;
}
</style>
