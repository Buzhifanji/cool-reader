

<script setup lang="ts">
import { removePdfEvent } from "@/core/file";
import Catalog from "@components/catalog/catalog.vue";
import Highlight from "@components/highlight/highlight.vue";
import Notes from "@components/notes/notes.vue";
import ToolBar from "@components/toolbar/toolbar.vue";
import { closeTooBar, openTooBar } from "@core/notes/toobar";
import { TabPaneEnum } from "@enums/index";
import { ArrowDown, ArrowUp } from "@vicons/carbon";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { usePageTurn, useReaderBook } from "./book";
import { useNotesSection } from "./notes";

const route = useRoute();
// 笔记栏目相关逻辑
const { showNotes, controlNodesSection, notesActiveTab, tabPanes, isNotesTab } =
  useNotesSection();
//翻页功能
const { pageUp, pageDown } = usePageTurn();
const { readingBook } = useReaderBook(route);

onMounted(() => {
  removePdfEvent();
})
</script>

<template>
  <n-layout>
    <n-layout-header bordered>
      <n-space justify="space-between">
        <!-- <n-button @click="goHome">go home</n-button> -->
        <span></span>
        <n-button @click="controlNodesSection(true)">Option</n-button>
      </n-space>
    </n-layout-header>
    <n-layout-content id="drawer-target">
      <div id="viewerContainer" @click="closeTooBar">
        <div id="viewer" class="pdfViewer" @click="openTooBar"></div>
        <ToolBar />
      </div>
      <div class="anchor-wrapper">
        <div>
          <n-button @click="pageUp">
            <template #icon>
              <n-icon size="30" :component="ArrowUp" />
            </template>
          </n-button>
        </div>
        <div>
          <n-button @click="pageDown">
            <template #icon>
              <n-icon size="30" :component="ArrowDown" />
            </template>
          </n-button>
        </div>
      </div>

      <!-- note -->
      <n-drawer v-model:show="showNotes" :width="342" placement="left" :show-mask="false" :trap-focus="false"
        :block-scroll="false" to="#drawer-target">
        <n-drawer-content>
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
          <n-tabs type="segment" v-model:value="notesActiveTab">
            <n-tab-pane v-for="item in tabPanes" :name="item.name" :tab="item.tab">
              <!-- 目录 -->
              <Catalog v-if="isNotesTab(TabPaneEnum.catalog)" />
              <!-- 高亮 -->
              <Highlight v-if="isNotesTab(TabPaneEnum.highlight)" />
              <!-- 笔记 -->
              <Notes v-if="isNotesTab(TabPaneEnum.notes)" />
            </n-tab-pane>
          </n-tabs>
        </n-drawer-content>
      </n-drawer>
      <!-- reader options -->
      <!-- <n-drawer
        v-model:show="active"
        :width="302"
        placement="right"
        :show-mask="false"
        to="#drawer-target"
      >
        <n-drawer-content title="斯通纳">
          《斯通纳》是美国作家约翰·威廉姆斯在 1965 年出版的小说。
        </n-drawer-content>
      </n-drawer> -->
    </n-layout-content>
  </n-layout>
</template>

<style scoped>
.n-drawer {
  height: calc(100% - 17px);
}

.n-layout-content {
  height: calc(100% - 35px);
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
  margin-top: -32px;
  height: 100%;
  overflow-y: auto;
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
