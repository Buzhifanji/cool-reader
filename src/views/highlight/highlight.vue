<script setup lang="ts">
import { Search, ShowDataCards, List } from "@vicons/carbon";
import { langField } from 'src/i18n';
import { NotesSource } from "src/interfaces/components/notes";
import { getAllNotes } from "src/server/notes";
import { hanldeList } from "src/utils";

const total = ref<number>(0)
const list = ref<NotesSource[]>([])

getAllNotes().then(value => {
  total.value = value.length
  list.value = hanldeList(value)
})

</script>

<template>
  <n-layout style="height: 100vh; padding: 0 24px;">
    <n-layout-header style="height: 60px; padding: 4px">
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
      <n-layout content-style="padding: 24px;" :native-scrollbar="false">
        <template v-for="item in list" :key="item.time">
          <n-p>
            <n-time :time="item.time" format="yyyy-MM-dd" />
          </n-p>
          <n-card v-for="sub in item.content">{{ sub.text }}</n-card>
        </template>
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

.n-button {
  box-shadow: none;
}
</style>