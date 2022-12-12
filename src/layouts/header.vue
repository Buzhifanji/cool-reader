<script setup lang="ts">
import { langField } from "src/i18n/index";
import { appWindow } from '@tauri-apps/api/window'
import { MIAN_WIN } from "src/constants";
import { dialog } from "src/naive";
import { exit } from '@tauri-apps/api/process'

const isMaximized = ref<boolean>(false)

appWindow.isMaximized().then(value => isMaximized.value = value);

const winMin = async () => await appWindow.minimize();

// 最大化/向下还原
const winToggle = async () => {
  await appWindow.toggleMaximize();
  isMaximized.value = !isMaximized.value
};

const winClose = async () => {
  if (appWindow.label === MIAN_WIN) {
    const { confirmExistContent, confirmExistTitle, windowHide, windowExit } = langField.value;
    dialog.warning({
      title: confirmExistTitle,
      content: confirmExistContent,
      positiveText: windowHide,
      negativeText: windowExit,
      onPositiveClick: async () => {
        await appWindow.hide()
      },
      onNegativeClick: async () => {
        await exit()
      }
    })
  } else {
    await appWindow.close()
  }
};
</script>

<template>
  <n-space justify="space-between">
    <n-gradient-text :size="24" type="success">
      Cool Reader
    </n-gradient-text>
    <n-space :size="[24, 8]">
      <!-- 最小化 -->
      <n-tooltip placement="bottom" trigger="hover">
        <template #trigger>
          <n-icon size="20" @click="winMin">
            <svg t="1670638672769" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
              p-id="6396" width="200" height="200">
              <path
                d="M968.704 554.496H55.296c-30.72 0-55.296-24.576-55.296-55.296 0-30.72 24.576-55.296 55.296-55.296h913.408c30.72 0 55.296 24.576 55.296 55.296 0 30.72-24.576 55.296-55.296 55.296z"
                p-id="6397" fill="#515151"></path>
            </svg>
          </n-icon>
        </template>
        <span> {{ langField.windowMinize }} </span>
      </n-tooltip>
      <!-- 向下还原 -->
      <n-tooltip placement="bottom" trigger="hover" v-if="isMaximized">
        <template #trigger>
          <n-icon size="20" @click="winToggle">
            <svg t="1670637936471" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
              p-id="6181" width="200" height="200">
              <path
                d="M739.95130434 284.04869566v658.32336695H81.62793739V284.04869566h658.32336695m0.60787015-75.98376812H80.4121971c-41.33516985 0-75.37589797 33.43285797-75.37589797 75.37589797V943.5878029c0 41.33516985 33.43285797 75.37589797 75.37589797 75.37589797h660.14697739c41.33516985 0 75.37589797-33.43285797 75.37589797-75.37589797V283.44082551c0-41.94304-33.43285797-75.37589797-75.37589797-75.37589797z"
                p-id="6182" fill="#515151"></path>
              <path
                d="M944.19567304 5.64416928H282.83295536c-41.33516985 0-74.16015768 33.43285797-74.76802782 74.16015768v77.1995084h75.98376812V81.62793739h658.32336695v658.32336695h-75.98376812V815.93507246H943.5878029c41.33516985 0 74.16015768-33.43285797 74.76802782-74.76802782V79.80432696c0-40.72729971-33.43285797-74.16015768-74.16015768-74.16015768z"
                p-id="6183" fill="#515151"></path>
            </svg>
          </n-icon>
        </template>
        <span> {{ langField.windowRestore }} </span>
      </n-tooltip>
      <!-- 最大化 -->
      <n-tooltip placement="bottom" trigger="hover" v-else>
        <template #trigger>
          <n-icon size="20" @click="winToggle">
            <svg t="1670637752669" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
              p-id="5755" width="200" height="200">
              <path
                d="M942.6 82.2v859.6H82.2V82.2h860.4M947.5 2h-871C35.2 2 2 35.2 2 76.5v870.9c0 41.3 33.2 74.5 74.5 74.5h870.9c41.3 0 74.5-33.2 74.5-74.5v-870c0.9-42.2-32.3-75.4-74.4-75.4 0.8 0 0 0 0 0z"
                p-id="5756"></path>
            </svg>
          </n-icon>
        </template>
        <span> {{ langField.windowMaximize }} </span>
      </n-tooltip>
      <!-- 关闭 -->
      <n-tooltip placement="bottom" trigger="hover">
        <template #trigger>
          <n-icon size="20" @click="winClose">
            <svg t="1670638757980" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
              p-id="6812" width="200" height="200">
              <path
                d="M578.36284173 512l422.30899284-422.30899284c18.09895683-18.09895683 18.09895683-48.2638849 0-66.36284173-18.09895683-18.09895683-48.2638849-18.09895683-66.36284173 0l-422.30899284 422.30899284-422.30899284-422.30899284c-18.09895683-18.09895683-48.2638849-18.09895683-66.36284173 0-18.09895683 18.09895683-18.09895683 48.2638849 0 66.36284173l422.30899284 422.30899284-422.30899284 422.30899284c-18.09895683 18.09895683-18.09895683 48.2638849 0 66.36284173 18.09895683 18.09895683 48.2638849 18.09895683 66.36284173 0l422.30899284-422.30899284 422.30899284 422.30899284c18.09895683 18.09895683 48.2638849 18.09895683 66.36284173 0 18.09895683-18.09895683 18.09895683-48.2638849 0-66.36284173l-422.30899284-422.30899284z"
                p-id="6813" fill="#515151"></path>
            </svg>
          </n-icon>
        </template>
        <span> {{ langField.windowFork }} </span>
      </n-tooltip>
    </n-space>
  </n-space>
</template>