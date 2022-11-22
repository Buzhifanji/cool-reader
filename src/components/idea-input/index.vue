<script setup lang="ts">
import { useInputIdea } from ".";
const { text, submit } = useInputIdea()

</script>
<template>
  <div class="idea-container">
    <NInput v-model:value="text" class="idea-input" type="textarea" placeholder="输入你的想法" clearable round show-count
      size="large" rows="6" maxlength="999" />
    <div class="idea-button-container">
      <NButton @click="submit" type="primary" round>添加</NButton>
    </div>
  </div>
</template>

<style scoped>
.idea-input {
  max-height: 600px;
  margin-bottom: 10px;
}

.idea-button-container {
  display: flex;
  justify-content: flex-end;
}
</style>