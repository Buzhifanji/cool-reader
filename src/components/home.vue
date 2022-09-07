<script setup lang="ts">
import {
  NIcon,
  NLayout,
  NLayoutContent,
  NLayoutHeader,
  NLayoutSider,
  NMenu,
  NSpace,
} from "naive-ui";
import { Component, h, ref } from "vue";
import { RouterLink } from "vue-router";
import { changeStorageLoction, fileChange, isLoadFile } from "../core/file";
import { RouterName } from "../route";
import BookIcon from "./icons/book.vue";
import HighLightIcon from "./icons/highlight.vue";
import NoteIcon from "./icons/note.vue";
import SetIcon from "./icons/set.vue";

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

function renderRouterLink(routerName: string, label: string) {
  return () =>
    h(RouterLink, { to: { name: routerName } }, { default: () => label });
}

const inverted = ref<boolean>(false);

const siderMenuOptions = [
  {
    label: renderRouterLink(RouterName.book, "全部图书"),
    key: "all-books",
    icon: renderIcon(BookIcon),
  },
  {
    label: renderRouterLink(RouterName.note, "我的笔记"),
    key: "my-nodes",
    icon: renderIcon(NoteIcon),
  },
  {
    label: renderRouterLink(RouterName.highlight, "我的高亮"),
    key: "my-hight",
    icon: renderIcon(HighLightIcon),
  },
];
</script>

<template>
  <n-layout>
    <n-layout-header :inverted="inverted" bordered>
      <n-space justify="end">
        <input type="file" @change="fileChange" :disabled="isLoadFile" />
        <SetIcon />
        <button @click="changeStorageLoction">路径</button>
      </n-space>
    </n-layout-header>
    <n-layout has-sider>
      <n-layout-sider
        bordered
        show-trigger
        collapse-mode="width"
        :collapsed-width="64"
        :width="160"
        :native-scrollbar="false"
        :inverted="inverted"
        style="max-height: 320px"
      >
        <n-menu
          :inverted="inverted"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="siderMenuOptions"
        />
      </n-layout-sider>
      <n-layout-content>
        <router-view></router-view>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<style scoped>
.n-layout-content {
  padding: 20px;
}
</style>
