<script setup lang="ts">
import { useRoute } from "vue-router";
import { langField } from "src/i18n";
import { handleCover } from "src/utils";
import Header from '../layouts/header.vue'
import Catalog from './catalog/index.vue'
import BookContent from './content/index.vue'
import './web-highlight'
import { useHandleCatalog, useHandleHelp, useHandleNotes, useHandleReading } from "./reader";
import { useReadBookStore } from "src/core/book";

const bookStore = useReadBookStore();

// 笔记栏目相关逻辑
const { showNotes, notesActiveTab, components, tabPanes, notesWidth } =
  useHandleNotes();
// 目录
const { showCatalog, catalogWidth } = useHandleCatalog();

// 帮助
const { showHelp, helpList } = useHandleHelp()

const route = useRoute();
useHandleReading(route)

</script>

<template>
  <n-layout>
    <n-layout-header style="padding: 6px 12px" bordered>
      <!-- <n-divider /> -->
      <Header :title="bookStore.readingBook.bookName" />
    </n-layout-header>
    <n-layout-content has-sider bordered position="absolute" style="top: 68px;" id="drawer-target">
      <!-- 书本内容 -->
      <BookContent />
      <n-drawer v-model:show="showCatalog" :width="catalogWidth" placement="left" :show-mask="false"
        :mask-closable="false" :trap-focus="false" :block-scroll="false" :display-directive="'show'"
        to="#drawer-target">
        <n-drawer-content :closable="false" body-content-style="padding: 5px;overflow: hidden">
          <n-grid x-gap="12" :cols="2">
            <n-gi>
              <n-card hoverable size="small">
                <template #cover>
                  <n-image :src="handleCover(bookStore.readingBook.cover)" preview-disabled />
                </template>
              </n-card>
            </n-gi>
            <n-gi>
              <n-space vertical>
                <n-ellipsis>
                  {{ bookStore.readingBook.bookName }}
                </n-ellipsis>
                <span>作者：佚名</span>
                <n-p>进度：{{ bookStore.readingBook.readProgress }}%</n-p>
              </n-space>
            </n-gi>
          </n-grid>
          <n-divider />
          <!-- 目录 -->
          <Catalog />
        </n-drawer-content>
      </n-drawer>
      <!-- note -->
      <n-drawer v-model:show="showNotes" :width="notesWidth" placement="right" :show-mask="false" :mask-closable="false"
        :trap-focus="false" :block-scroll="false" :display-directive="'show'" to="#drawer-target">
        <n-drawer-content body-content-style="padding: 0px">
          <n-tabs type="segment" v-model:value="notesActiveTab">
            <n-tab-pane v-for="item in tabPanes" :name="item.name" :tab="item.tab">
              <component :is="components[notesActiveTab]"></component>
            </n-tab-pane>
          </n-tabs>
        </n-drawer-content>
      </n-drawer>
      <!-- 帮助 -->
      <n-modal v-model:show="showHelp" :title="langField.help" style="width: 50%;" preset="card" size="huge"
        :bordered="false">
        <n-descriptions v-for="item in helpList" label-placement="left" :title="item.title" size="large" :column="2">
          <n-descriptions-item v-for="cur in item.list" :label="cur.name">
            {{ cur.value }}
          </n-descriptions-item>
        </n-descriptions>
      </n-modal>
    </n-layout-content>
  </n-layout>
</template>

<style scoped>
.n-drawer {
  height: calc(100% - 17px);
}

.n-layout-content {
  height: calc(100% - 25px);
  margin-top: -24px;
}

.n-tabs {
  height: 100;
  overflow: hidden;
}

.n-tab-pane {
  height: 100%;
  overflow: auto;
}

.n-card {
  height: 180px;
}

#viewerContainer {
  height: 100%;
  overflow-y: auto;
}

.pdfViewer .page {
  width: 100% !important;
}

.anchor-wrapper {
  width: 100px;
  overflow: visible;
  position: fixed;
  z-index: 5;
  bottom: 48px;
  right: 80px;
}
</style>
