<script setup lang="ts">
import { useLoadFile } from "@/store";
import { downloadFile } from "@core/file";
import { changeLanguage, Langs, language } from "@i18n/index";
const { isLoadFile } = useLoadFile()

function changeLang() {
  const value = language.value === Langs.zhCN ? Langs.enUS : Langs.zhCN;
  changeLanguage(value)
}

</script>

<template>
  <n-space justify="end">
    <n-button :disabled="isLoadFile" @click="downloadFile">上传</n-button>
    <n-button @click="changeLang">{{ language === 'zh-CN' ? '中文' : 'english' }}</n-button>
  </n-space>
</template>
