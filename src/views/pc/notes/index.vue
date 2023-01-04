<script setup lang="ts">
import { Search, ShowDataCards, Delete, List } from "@vicons/carbon";
import { langField } from 'src/i18n';
import { hanldeNotesByTime } from "src/utils";
import { initRenderData } from "render-big-data";
import { useAllNotesStore } from "src/store";
import { useVirtualList } from "src/core/scroll/virtual-list"

const total = ref<number>(0)
// 目前不知道 如何在HTML配置 // @ts-ignore，所以使用了 any类型
const list = ref<any[]>([])

const notesStore = useAllNotesStore();

notesStore.updateAllNotes().then(() => {
  const hightlights = notesStore.allHighlights
  total.value = hightlights.length;
  // 按照时间分类
  const arr = hanldeNotesByTime(hightlights)

  console.log({ arr })
  initRenderData(arr)
})


useVirtualList(list)

const mode = [
  { value: 'time', label: '时间模式' },
  { value: 'book', label: '书籍模式' },
]
const selectedMode = ref('time')

</script>

<template>
  <n-layout style="height: 100%; ">
    <n-layout-header style="height: 60px; padding: 4px" bordered>
      <n-space align="center" justify="space-between">
        <n-statistic :label="langField.highlightRecordPrev" tabular-nums>
          <n-number-animation ref="numberAnimationInstRef" :from="0" :to="total" />
          <template #suffix>
            {{ langField.highlightRecordNext }}
          </template>
        </n-statistic>
        <n-select v-model:value="selectedMode" :options="mode" :consistent-menu-width="false" />
        <n-input round :placeholder="langField.highlightSearchPlaceholder">
          <template #suffix>
            <n-icon :component="Search" />
          </template>
        </n-input>
      </n-space>

    </n-layout-header>
    <n-layout position="absolute" style="top: 60px; bottom: 0px" has-sider>
      <n-layout :native-scrollbar="false" contentStyle="height: 100%">
        <virtual-list>
          <virtual-list-item v-for="(item, index) in list" :index="index" :key="item.time">
            <n-p depth="3" style="--n-font-size: 16px;" v-if="item.time">{{ item.time }} </n-p>
            <div class="text" v-else>
              <n-blockquote style="--n-font-size: 16px;">
                {{ item.text }}
              </n-blockquote>
              <n-p class="from" depth="3">来自</n-p>
              <n-divider />
            </div>
          </virtual-list-item>
        </virtual-list>
      </n-layout>
    </n-layout>
  </n-layout>
</template>

<style scoped>
.n-input {
  width: 209px;
}

.n-card {
  cursor: pointer;
  margin-bottom: 10px;
}

.n-h1,
.text {
  text-align: left;
  cursor: pointer;
  margin: 0 auto;
  /* max-width: 960px; */
}

.n-h1 {
  /* padding-top: 20px; */
  padding: 20px 24px 0 24px;
}

.text {
  padding: 0 24px;
}

.n-divider {
  margin: 0;
}

.n-p {
  padding: 20px 0px;
  margin: 0;
}

.n-button {
  box-shadow: none;
}

.n-card:deep(.n-card__action) {
  padding: 5px 20px;
}

.from {
  text-align: right;
}
</style>