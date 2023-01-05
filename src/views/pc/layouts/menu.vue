<script setup lang="ts">
import { renderIcon } from 'src/utils';
import { RouterName } from 'src/enums/index';
import { langField, language } from "src/i18n/index";
import { Book, Idea, SettingsCheck, Home } from "@vicons/carbon";
import { h, ref, watchEffect } from 'vue';
import { RouterLink } from 'vue-router';
import { MenuOption } from 'naive-ui';
import Setting from '../setting/index.vue'

function renderRouterLink(routerName: string, label: string) {
  return () =>
    h(RouterLink, { to: { name: routerName } }, { default: () => label });
}

function getMenu() {
  const lang = langField.value;
  return [
    {
      label: renderRouterLink(RouterName.reading, lang.menuReading),
      key: "home",
      icon: renderIcon(Home),
    },
    {
      label: renderRouterLink(RouterName.books, lang.menuBook),
      key: "all-books",
      icon: renderIcon(Book),
    },
    {
      label: renderRouterLink(RouterName.notes, lang.menuNotes),
      key: "my-nodes",
      icon: renderIcon(Idea),
    },
    {
      label: lang.setting,
      key: "set",
      icon: renderIcon(SettingsCheck),
    },
  ]
}

const menu = ref<any>(getMenu())

const showSetting = ref<boolean>(false)
function handleUpdateValue(key: string, item: MenuOption) {
  if (key === "set") {
    showSetting.value = true
  }
}

watchEffect(() => {
  if (language.value) {
    menu.value = getMenu()
  }
})


</script>

<template>
  <n-menu :collapsed-width="64" :collapsed-icon-size="22" :options="menu" @update:value="handleUpdateValue" />
  <Setting v-model:show="showSetting" />
</template>
