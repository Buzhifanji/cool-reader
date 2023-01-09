<script setup lang="ts">
import { ref } from 'vue';
import 'v-calendar/dist/style.css';
import { Calendar, DatePicker } from 'v-calendar';

const popSelect = ref('总统计')
const popOptions = [
  { label: '总统计', value: '总统计' },
  { label: '这一年', value: '这一年' },
  { label: '这一月', value: '这一月' },
  { label: '这一周', value: '这一周' },
]
</script>

<template>
  <n-list class="list">
    <n-list-item>
      <template #prefix>
        <n-popselect v-model:value="popSelect" :options="popOptions">
          <n-button>{{ popSelect }}</n-button>
        </n-popselect>
      </template>
      <template #suffix>
      </template>
      <n-row>
        <n-col :span="8">
          <n-statistic label="累计时长" :value="99">
            <template #suffix>
              / 100
            </template>
          </n-statistic>
        </n-col>
        <n-col :span="8">
          <n-statistic label="阅读数">
            1,234,123
          </n-statistic>
        </n-col>
        <n-col :span="8">
          <n-statistic label="阅读天数">
            1,234,123
          </n-statistic>
        </n-col>
      </n-row>
    </n-list-item>
    <n-list-item>
      <template #prefix>
        阅读日历
      </template>
      <!-- <Calendar :value="null" is-expanded color="green" /> -->
    </n-list-item>
  </n-list>
</template>


<style scoped>
.list {
  margin-top: 15px;
  margin-right: 20px;
}
</style>