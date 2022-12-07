<script setup lang="ts">
import { Search, ShowDataCards, Delete, List } from "@vicons/carbon";
import { langField } from 'src/i18n';
import { NotesSource } from "src/interfaces";
import { getAllNotes } from "src/server/notes";
import { hanldeNotesByTime } from "src/utils";
import { initRenderData, visiableData } from "render-big-data";


const total = ref<number>(0)

// 目前不知道 如何在HTML配置 // @ts-ignore，所以使用了 any类型
const list = ref<any[]>([])

// const { visibleList, initHeight, updateHeight, watchScroll, scroll } = useVirtualList<NotesSource>(list)

// const contentStyle = computed(() => {
//   return {
//     padding: '24px',
//     height: `${scroll.scrollBarHeight}px`
//   }
// })

// const transform = computed(() => {
//   return { transform: `translate3d(0, ${scroll.scrollTop}px), 0` }
// })

getAllNotes().then(value => {
  total.value = value.length
  const arr = hanldeNotesByTime(value)
  initRenderData(arr, {
    renderNum: 20
  })
  // initHeight()
})

const unsubscribe = visiableData.subscribe((value: any) => (list.value = value));

function update() {

}

function onScroll(e: Event) {
  console.log('-------------')
  const target = e.target as HTMLElement;
}


</script>

<template>
  <n-layout style="height: 100vh; padding: 0 24px;">
    <n-layout-header style="height: 60px; padding: 4px" bordered>
      <n-space justify="space-between">
        <n-statistic :label="langField.highlightRecordPrev" tabular-nums>
          <n-number-animation ref="numberAnimationInstRef" :from="0" :to="total" />
          <template #suffix>
            {{ langField.highlightRecordNext }}
          </template>
        </n-statistic>
        <n-space align="center">
          <!-- <n-popover trigger="hover">
            <template #trigger>
              <n-button text quaternary circle :bordered="false" style="font-size: 28px">
                <n-icon :component="List" />
              </n-button>
            </template>
            <span>列表模式</span>
          </n-popover>
          <n-popover trigger="hover">
            <template #trigger>
              <n-button text quaternary circle :bordered="false" style="font-size: 24px">
                <n-icon :component="ShowDataCards" />
              </n-button>
            </template>
            <span>开片模式</span>
          </n-popover> -->
          <n-input round :placeholder="langField.highlightSearchPlaceholder">
            <template #suffix>
              <n-icon :component="Search" />
            </template>
          </n-input>
        </n-space>
      </n-space>

    </n-layout-header>
    <n-layout position="absolute" style="top: 60px; bottom: 0px" has-sider>
      <n-layout :native-scrollbar="false" contentStyle="height: 100%" @onScroll="onScroll">
        <virtual-list>
          <virtual-list-item v-for="(item, index) in list" :index="index" :key="item.time">
            <n-h1 v-if="item.time">{{ item.time }} </n-h1>
            <div class="text" v-else>
              <n-p depth="4" style="--n-font-size: 16px;">
                {{ item.text }}
              </n-p>
              <n-divider />
            </div>

            <!-- <n-p v-if="item.time">{{ item.time }} </n-p> -->
            <!-- <n-card v-else>
              {{ item.text }}
              <template #action>
                <n-space justify="end" align="center">
                  <n-button text circle :bordered="false" style="font-size: 20px">
                    <n-icon :component="Delete" />
                  </n-button>
                  <n-button text tag="a" href="https://anyway.fm/news.php" target="_blank" type="primary">
                    来自：{{ item.bookId }}
                  </n-button>
                </n-space>
              </template>
            </n-card> -->
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
  max-width: 960px;
}

.n-h1 {
  padding-top: 20px;
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

.scroller {
  height: 100%;
  overflow-y: scroll;
}
</style>