

<script setup lang="ts">
import { onBeforeUnmount } from "vue";
import { removeMessage } from "./idea";
import { useFormModel, useToolBar } from "./toolbar";
const { bars, barAction, toolBarStyle, toolBar, ideaValue } = useToolBar();
const { formRef, formModel, rules, submit } = useFormModel();

onBeforeUnmount(removeMessage)

</script>

<template>
  <div class="tool-bar-wrapper" :style="toolBarStyle" ref="toolBarRef" v-show="toolBar.show">
    <template v-if="toolBar.input">
      <div @click.stop>
        <n-form ref="formRef" :model="formModel" :rules="rules">
          <n-form-item path="text">
            <n-input v-model:value="formModel.text" type="textarea" placeholder="输入你的想法" />
          </n-form-item>
          <n-row :gutter="[0, 24]">
            <n-col :span="24">
              <div style="display: flex; justify-content: flex-end">
                <n-button round type="primary" @click="submit"> 取消 </n-button>
                <n-button round type="primary" @click="submit"> 确认 </n-button>
              </div>
            </n-col>
          </n-row>
        </n-form>
      </div>
    </template>
    <n-space v-else>
      <n-space vertical v-for="item in bars" :key="item.key" @click.stop="barAction(item.key)">
        <n-icon :component="item.icon" size="16" />
        <div quaternary>{{ item.label }}</div>
      </n-space>
    </n-space>
  </div>
</template>
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
