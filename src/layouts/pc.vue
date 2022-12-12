<script setup lang="ts">
import Menu from "./menu.vue";
import Header from './header.vue'
</script>

<template>
  <n-layout>
    <n-layout-header style="padding: 12px" bordered>
      <Header />
    </n-layout-header>
    <n-layout has-sider bordered>
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
.n-divider {
  margin-top: 12px;
  margin-bottom: 0px;
}

.n-layout-content {
  padding: 20px;
}

svg {
  /* font-family: tahoma, "microsoft yahei", "\5FAE\8F6F\96C5\9ED1"; */
  /* color: #666; */
}
</style>
