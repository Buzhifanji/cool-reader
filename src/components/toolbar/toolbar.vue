<template>
  <div
    class="tool-bar-wrapper"
    :style="toolBarStyle"
    ref="toolBarRef"
    v-show="toolBar.show"
  >
    <n-space>
      <n-space
        vertical
        v-for="item in bars"
        :key="item.key"
        @click="barAction(item.key)"
      >
        <n-icon :component="item.icon" size="16" />
        <div quaternary>{{ item.label }}</div>
      </n-space>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { useToolBar } from "./toolbar";
const { bars, barAction, toolBarStyle, toolBar } = useToolBar();
</script>

<style scoped>
.tool-bar-wrapper {
  box-sizing: border-box;
  position: absolute;
  border: 1px solid #fff;
  border-radius: 3px;
  padding: 10px 14px;
  color: #fff;
  background: #444;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
  line-height: 18px;
  overflow: visible;
  z-index: 9;
}

.tool-bar-wrapper::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -4px;
  border-color: #444 transparent transparent;
  border-width: 4px 4px 0;
  border-style: solid;
  height: 0;
  width: 0;
}
</style>
