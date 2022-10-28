

<script setup lang="ts">
import { useLoadFile } from "@/store";
import { downloadFile } from "@core/file/file";
import { openReaderWindow } from "@core/system/window";
import { useBooks, useContextMenu } from "./book";

const { percentage } = useLoadFile();

const { books } = useBooks();
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

<template>
  <n-progress v-if="percentage" type="line" :percentage="percentage" :indicator-placement="'inside'" processing />
  <template v-if="books.length">
    <div class="card-wrapper">
      <n-card :bordered="false" v-for="item in books" :key="item.id" @contextmenu="handleContextMenu($event, item.id)"
        @click="openReaderWindow(item)">
        <template #cover>
          <div class="book-cover">
            <n-image :src="item.cover" preview-disabled />
            <span class="book-cover-detor"></span>
          </div>
        </template>
        <n-ellipsis :line-clamp="2">
          {{ item.bookName }}
        </n-ellipsis>
      </n-card>
      <n-dropdown placement="bottom-start" trigger="manual" :x="xRef" :y="yRef" :options="menus" :show="showDropdownRef"
        :on-clickoutside="onClickoutside" @select="handleSelect" />
    </div>
  </template>

  <n-result v-else status="418" title="暂无书本可读" description="一切尽在不言中">
    <template #footer>
      <n-button @click="downloadFile">从本地导入</n-button>
    </template>
  </n-result>
</template>

<style scoped>
@media (max-width: 516px) {
  .n-card {
    margin-left: 0;
    width: calc((100vw - 72px)/3);
    max-width: 148px;
  }

  .cover {
    width: calc((100vw - 72px)/3);
    height: calc((100vw - 72px)/3*1.45);
    max-width: 148px;
    max-height: 214.6px;
  }
}

@media (max-width: 960px) {
  .n-card {
    margin-left: 30px;
  }
}

@media (max-width: 1120px) {
  .n-card {
    margin-left: 40px;
  }
}

.n-card {
  display: block;
  width: 128px;
  height: auto;
  margin-left: 36px;
  margin-bottom: 44px;
  cursor: pointer;
}

.card-wrapper {
  display: flex;
}

.book-cover {
  display: block;
  width: 100%;
  height: 174px;
  box-shadow: 0 2px 16px rgb(0 0 0 / 8%);
  background: #d8d8d8;
  position: relative;
}

.book-cover-detor {
  background-image: linear-gradient(90deg, hsla(0, 0%, 63.1%, .25), rgba(21, 21, 20, .1) 1%, hsla(0, 0%, 100%, .15) 4%, hsla(0, 0%, 58%, .1) 8%, hsla(0, 0%, 89%, 0) 57%, rgba(223, 218, 218, .03) 91%, rgba(223, 218, 218, .05) 98%, hsla(0, 0%, 100%, .1));
  box-shadow: inset 0 0 0 0 rgb(0 0 0 / 10%);

  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.n-card :deep(.n-card__content) {
  margin-top: 14px;
  font-size: 15px;
  line-height: 18px;
  height: 36px;
  max-height: 36px;
  padding: 0;
}

.n-image {
  height: 100%;
}
</style>
