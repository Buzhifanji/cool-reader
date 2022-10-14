<script setup lang="ts">
import { renderIcon } from '@/utils';
import { RouterName } from '@enums/index';
import { Book, Idea, TextHighlight } from "@vicons/carbon";
import { h } from 'vue';
import { RouterLink } from 'vue-router';

function renderRouterLink(routerName: string, label: string) {
  return () =>
    h(RouterLink, { to: { name: routerName } }, { default: () => label });
}

const menu = [
  {
    label: renderRouterLink(RouterName.book, "全部图书"),
    key: "all-books",
    icon: renderIcon(Book),
  },
  {
    label: renderRouterLink(RouterName.note, "我的笔记"),
    key: "my-nodes",
    icon: renderIcon(Idea),
  },
  {
    label: renderRouterLink(RouterName.highlight, "我的高亮"),
    key: "my-hight",
    icon: renderIcon(TextHighlight),
  },
];
</script>

<template>
  <n-menu :collapsed-width="64" :collapsed-icon-size="22" :options="menu" />
</template>
