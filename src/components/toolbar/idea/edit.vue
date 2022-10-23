<script setup lang="ts">
import { NButton, NDivider, NScrollbar } from "naive-ui";
import { useEditIdea } from ".";
const { ideas, remove } = useEditIdea()

</script>
<template>
  <div class="idea-container">
    <template v-for="item in ideas" :key="item">
      <n-scrollbar style="max-height: 216px;">
        {{item}}
      </n-scrollbar>
      <n-button quaternary round size="tiny" type="primary">
        删除
      </n-button>
      <n-divider />
    </template>
  </div>
</template>

<style scoped>
.idea-container :deep(.n-scrollbar-container) {
  padding: 10px;
}

.idea-container :deep(.n-button) {
  margin-bottom: -10px;
}
</style>