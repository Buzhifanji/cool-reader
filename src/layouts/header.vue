<script setup lang="ts">
import { useLoadFile } from "@/store";
import { downloadFile } from "@core/file";

const { isLoadFile } = useLoadFile()

</script>

<template>
  <n-space justify="end">
    <n-button :disabled="isLoadFile" @click="downloadFile">上传</n-button>
  </n-space>
</template>
