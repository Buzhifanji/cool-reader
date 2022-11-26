<script setup lang="ts">
import { useInputIdea, removeMessage } from ".";
import { langField } from "src/i18n";

const { text, submit } = useInputIdea()

onBeforeUnmount(removeMessage)

</script>
<template>
  <div class="idea-container">
    <NInput v-model:value="text" class="idea-input" type="textarea" :placeholder="langField.notesPlaceholder" clearable
      round show-count size="large" rows="6" maxlength="999" />
    <div class="idea-button-container">
      <NButton @click="submit" type="primary" round>{{ langField.add }}</NButton>
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