<script setup lang="ts">
import Header from "./header.vue";
import Menu from "./menu.vue";

</script>

<template>
  <n-layout>
    <n-layout-header bordered>
      <Header />
    </n-layout-header>
    <n-layout has-sider>
      <n-layout-sider bordered show-trigger collapse-mode="width" :collapsed-width="64" :width="160"
        :native-scrollbar="false" style="max-height: 320px">
        <Menu />
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
