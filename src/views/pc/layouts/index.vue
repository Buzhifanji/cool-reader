<script setup lang="ts">
import Menu from "./menu.vue";
import Header from './header.vue'
</script>

<template>
  <n-layout>
    <n-layout-header style="padding: 6px 12px" bordered>
      <Header :title="'Cool Reader'" />
    </n-layout-header>
    <n-layout has-sider bordered position="absolute" style="top: 41px;">
      <n-layout-sider bordered show-trigger collapse-mode="width" :collapsed-width="64" :width="160"
        :native-scrollbar="false">
        <Menu />
      </n-layout-sider>
      <n-layout-content>
        <router-view></router-view>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<style scoped>
.n-divider {
  margin-top: 12px;
  margin-bottom: 0px;
}

.n-layout-content {
  padding-left: 20px;
}
</style>
