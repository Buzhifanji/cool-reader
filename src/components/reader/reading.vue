<template>
  <n-layout>
    <n-layout-header bordered>
      <n-space justify="space-between">
        <n-button @click="goHome">go home</n-button>
        <n-button @click="openDrawer">Option</n-button>
      </n-space>
    </n-layout-header>
    <n-layout-content id="drawer-target">
      <section id="viewerContainer" tabindex="0">
        <div id="viewer" class="pdfViewer"></div>
      </section>
      <!-- note -->
      <n-drawer
        v-model:show="active"
        :width="342"
        placement="left"
        :show-mask="false"
        :trap-focus="false"
        :block-scroll="false"
        to="#drawer-target"
      >
        <n-drawer-content>
          <n-grid x-gap="12" :cols="2">
            <n-gi>
              <n-card hoverable size="small">
                <template #cover>
                  <n-image :src="rendingBook.cover" preview-disabled />
                </template>
              </n-card>
            </n-gi>
            <n-gi>
              <n-space vertical>
                <n-ellipsis>
                  {{ rendingBook.bookName }}
                </n-ellipsis>
                <span>作者：佚名</span>
              </n-space>
            </n-gi>
          </n-grid>
          <n-divider />
          <n-tabs
            type="segment"
            v-model:value="activeTabRef"
            @update:value="changePane"
          >
            <n-tab-pane
              v-for="item in tabPanes"
              :name="item.name"
              :tab="item.tab"
            >
              <Catalog v-if="isActiveTab(TabPaneEnum.catalog)" />
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

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { openBook } from "../../core/book/book";
import { loadPdf } from "../../core/file/pdf";
import { initReadingBook, rendingBook } from "./book";
import Catalog from "./catalog.vue";
import {
  activeTabRef,
  changePane,
  isActiveTab,
  TabPaneEnum,
  tabPanes,
} from "./tab-pene";

const active = ref<boolean>(false);
function openDrawer() {
  active.value = true;
}

const router = useRouter();
const route = useRoute();

init();

async function init() {
  const index = Number(route.query.index);
  initReadingBook(index);
  const book = await openBook(rendingBook.id);
  const { fileContent } = book;
  if (fileContent) {
    await loadPdf(rendingBook);
    changePane(TabPaneEnum.catalog);
  } else {
    console.log("没有数据");
  }
  //
}

function goHome() {
  router.push("/");
}
</script>

<style scoped>
.n-layout-content {
  height: calc(100% - 35px);
}
section {
  margin-top: -32px;
}
</style>
