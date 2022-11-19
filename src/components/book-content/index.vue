<script setup lang="ts">
import { useToolBar, useHighlight } from './toolbar';

const { bars, toolBar, barAction, toolBarStyle } = useToolBar()
const { watchHighlight } = useHighlight()
</script>

<template>
  <div id="viewerContainer" @click="watchHighlight">
    <div id="viewer" class="pdfViewer"></div>
    <div class="tool-bar-wrapper" :style="toolBarStyle" ref="toolBarRef" v-show="toolBar.show">
      <n-space>
        <n-space vertical v-for="item in bars" :key="item.key" @click.stop="barAction(item.key)">
          <n-icon :component="item.icon" size="16" />
          <div quaternary>{{ item.label }}</div>
        </n-space>
      </n-space>
    </div>
  </div>
</template>

<style scoped>
#viewerContainer {
  height: 100%;
  overflow-y: auto;
}

.tool-bar-wrapper {
  box-sizing: border-box;
  position: absolute;
  border: 1px solid var(--n-border-color);
  border-radius: var(--n-border-radius);
  padding: 10px 14px;
  color: #fff;
  background-color: rgba(38, 38, 38, 1);
  transition: box-shadow .3s var(--n-bezier), background-color .3s var(--n-bezier), color .3s var(--n-bezier);
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