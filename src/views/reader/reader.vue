<script setup lang="ts">
import { removeMessage } from "src/components/toolbar/idea";
import { removePdfEvent } from "src/core/file";
import { detachRange } from "src/core/toolbar/selection";
import { TabPaneEnum } from "src/enums/index";
import { useRoute } from "vue-router";
import { useReaderBook } from "./book";
import { useNotesSection } from "./notes";
import { useCatalogSection } from "src/views/reader/catalog";
import { WebHighlight } from "src/core/web-highlight";
import { initWebHighlight } from "src/store";

// 初始化 高亮笔记功能
initWebHighlight({})

const route = useRoute();
// 笔记栏目相关逻辑
const { showNotes, notesActiveTab, components, tabPanes, notesWidth } =
  useNotesSection();
// 目录
const { showCatalog, catalogWidth } = useCatalogSection();

//
const contentStyle = computed(() => {
  const left = (showCatalog.value ? catalogWidth : 0) + "px";
  const right = (showNotes.value ? notesWidth : 0) + "px";
  return { left, right };
});
//翻页功能
const { readingBook } = useReaderBook(route);

const onContainer = () => {
  // closeTooBar();
  // detachRange();
  // removeMessage();
};

onMounted(() => {
  removePdfEvent();
});
</script>

<template>
  <n-layout>
    <n-layout-header>
      <n-divider />
    </n-layout-header>
    <n-layout-content id="drawer-target">
      <BookContent />
      <!-- <div id="viewerContainer" :style="contentStyle" @click="onContainer">
        <div id="viewer" class="pdfViewer" @click="openTooBar"></div>
        <div id="viewer" class="pdfViewer"></div>
        <ToolBar v-model="showToolbar" />
      </div> -->
      <n-drawer v-model:show="showCatalog" :width="catalogWidth" placement="left" :show-mask="false"
        :mask-closable="false" :trap-focus="false" :block-scroll="false" to="#drawer-target">
        <n-drawer-content :closable="false" body-content-style="padding: 5px;overflow: hidden">
          <n-grid x-gap="12" :cols="2">
            <n-gi>
              <n-card hoverable size="small">
                <template #cover>
                  <n-image :src="readingBook.cover" preview-disabled />
                </template>
              </n-card>
            </n-gi>
            <n-gi>
              <n-space vertical>
                <n-ellipsis>
                  {{ readingBook.bookName }}
                </n-ellipsis>
                <span>作者：佚名</span>
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
        :trap-focus="false" :block-scroll="false" to="#drawer-target">
        <n-drawer-content body-content-style="padding: 0px">
          <n-tabs type="segment" v-model:value="notesActiveTab">
            <n-tab-pane v-for="item in tabPanes" :name="item.name" :tab="item.tab">
              <component :is="components[notesActiveTab]"></component>
            </n-tab-pane>
          </n-tabs>
        </n-drawer-content>
      </n-drawer>
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
  height: calc(100% - 229px);
  overflow: hidden;
}

.n-tab-pane {
  height: 100%;
  overflow: scroll;
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
