<script setup lang="ts">
import { Search, } from "@vicons/carbon";
import { langField } from 'src/i18n';
import { hanldeNotesByTime, isIdea } from "src/utils";
import { initRenderData } from "render-big-data";
import { useAllNotesStore } from "src/store";
import { useVirtualList } from "src/core/scroll/virtual-list"
import { openBookReader } from "src/core/use";
import Tilde from 'src/views/icons/tilde.vue'
import Idea from 'src/views/icons/idea.vue'

const router = useRouter();
const total = ref<number>(0)
// 目前不知道 如何在HTML配置 // @ts-ignore，所以使用了 any类型
const list = ref<any[]>([])

const notesStore = useAllNotesStore();

notesStore.updateAllNotes().then(() => {
  const notes = notesStore.allNotes
  total.value = notes.length;
  // 按照时间分类
  const arr = hanldeNotesByTime(notes)
  initRenderData(arr)
})

const layoutStyle = computed(() => {
  return {
    top: list.value.length ? '60px' : '0px',
    bottom: "0px",
  }
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
    <n-layout-header style="height: 60px; padding: 4px" bordered v-if="list.length">
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
    <n-layout position="absolute" :style="layoutStyle" has-sider>
      <n-layout :native-scrollbar="false" contentStyle="height: 100%">
        <virtual-list v-if="list.length">
          <virtual-list-item v-for="(item, index) in list" :index="index" :key="item.time">
            <div class="list-item">
              <div class="list-item_time" v-if="item.time">{{ item.time }}</div>
              <div class="list-item_content" v-else>
                <Idea class="list-item_icon" v-if="isIdea(item.notes)" />
                <Tilde v-else class="list-item_icon" v-once />

                <div class="list-item_text_container">
                  <div class="list-item_text">
                    {{ item.text }}
                  </div>
                  <n-p class="list-item_origin white-space" depth="3" @click="openBookReader(item, router)">
                    来自: {{ item.bookName }}
                  </n-p>
                  <n-divider />
                </div>
              </div>
            </div>
          </virtual-list-item>
        </virtual-list>
        <n-space justify="center" style="height: 100%" align="center" v-else>
          <n-result status="418" :title="langField.noNotes" :description="langField.noNotesDescription">
            <template #footer>
              <n-button tag="a" href="/home/books" type="primary">{{ langField.menuBook }}</n-button>
            </template>
          </n-result>
        </n-space>
      </n-layout>
    </n-layout>
  </n-layout>
</template>

<style scoped>
.list-item {
  padding: 18px 20px 18px 0;
}

.list-item_time {
  color: rgb(118, 124, 130);
  cursor: pointer;
}

.list-item_content {
  display: flex;
  cursor: pointer;
  flex-direction: row;
  align-items: flex-start;
  word-break: break-all;
}

.list-item_icon {
  margin-right: 12px;
}

.list-item_text_container {
  width: 100%;
  word-break: break-all;
}

.list-item_text {
  margin-top: 3px;
  margin-bottom: 15px;
  font-size: 16px;
  line-height: 24px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -moz-line-clamp: 3;
  line-clamp: 3;
  -webkit-text-size-adjust: none;
  display: -webkit-inline-box;
  -webkit-box-orient: vertical;
}


.n-input {
  width: 209px;
}

.n-divider {
  margin: 0;
}

.n-p {
  padding: 20px 0px;
  margin: 0;
}


.list-item_origin {
  text-align: right;
  max-width: 50%;
  margin-left: 50%;
}
</style>