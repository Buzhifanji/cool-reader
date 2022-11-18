<script setup lang="ts">
import { renderIcon } from 'src/utils';
import { RouterName } from 'src/enums/index';
import { langField, language } from "src/i18n/index";
import { Book, Idea, TextHighlight } from "@vicons/carbon";
import { h, ref, watchEffect } from 'vue';
import { RouterLink } from 'vue-router';

function renderRouterLink(routerName: string, label: string) {
  return () =>
    h(RouterLink, { to: { name: routerName } }, { default: () => label });
}

function getMenu() {
  const lang = langField.value;
  return [
    {
      label: renderRouterLink(RouterName.book, lang.menuBook),
      key: "all-books",
      icon: renderIcon(Book),
    },
    {
      label: renderRouterLink(RouterName.notes, lang.menuNotes),
      key: "my-nodes",
      icon: renderIcon(Idea),
    },
    {
      label: renderRouterLink(RouterName.highlight, lang.menuHighlight),
      key: "my-hight",
      icon: renderIcon(TextHighlight),
    },
  ]
}

const menu = ref<any>(getMenu())

watchEffect(() => {
  if (language.value) {
    menu.value = getMenu()
  }
})


</script>

<template>
  <n-menu :collapsed-width="64" :collapsed-icon-size="22" :options="menu" />
</template>
