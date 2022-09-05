<script setup lang="ts">
import { open } from '@tauri-apps/api/dialog';
import { appDir } from '@tauri-apps/api/path';
import { invoke } from '@tauri-apps/api/tauri';
import { NIcon, NLayout, NLayoutContent, NLayoutHeader, NLayoutSider, NMenu, NSpace } from 'naive-ui';
import { Component, h, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { RouterName } from '../route';
import { fileChange, isLoadFile } from '../utils/file';
import BookIcon from './icons/book.vue';
import EnterIcon from './icons/enter.vue';
import HighLightIcon from './icons/highlight.vue';
import NoteIcon from './icons/note.vue';
import SetIcon from './icons/set.vue';

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

function renderRouterLink(routerName: string, label: string) {
  return () => h(RouterLink, { to: { name: routerName } }, { default: () => label })
}

const inverted = ref<boolean>(false)


const siderMenuOptions = [
  {
    label: renderRouterLink(RouterName.book, '全部图书'),
    key: 'all-books',
    icon: renderIcon(BookIcon)
  },
  {
    label: renderRouterLink(RouterName.note, '我的笔记'),
    key: 'my-nodes',
    icon: renderIcon(NoteIcon)
  },
  {
    label: renderRouterLink(RouterName.highlight, '我的高亮'),
    key: 'my-hight',
    icon: renderIcon(HighLightIcon)
  },
]

async function entryAction() {
  const selected = await open({
    defaultPath: await appDir(),
  });
  console.log('selected', selected);


  if (Array.isArray(selected)) {
    // user selected multiple directories
  } else if (selected === null) {
    // user cancelled the selection
  } else {
    console.log(selected)
    // const readfile = (await invoke('readfile', { path: selected })) as number[]
    // const read_pdf = (await invoke('read_pdf', { path: selected })) as number[]
    // const load = (await invoke('load', { path: selected })) as number[]
    const reader_pdf = (await invoke('reader_pdf', { path: selected })) as number[]
    // const reader = (await invoke('reader', { path: selected })) as number[]
    // console.log('read_pdf', read_pdf)
    console.log('reader_pdf', reader_pdf)
    // console.log('readfile', readfile)
    // console.log('reader', reader)
    // console.log('temp', Uint8Array.from(temp))
    // const content = await readBinaryFile(selected)
    // const content = await readFileSync(selected)
    // console.log('content,', content)
    // user selected a single directory
    // fetch(selected).then((value) => {
    //   console.log('value', value)
    // }, error => console.log('error', error))
    // const pdfjsLib = (window as Window)["pdfjs-dist/build/pdf"];
    // // pdfjsLib.GlobalWorkerOptions.workerSrc = (window as Window)["pdfjs-dist/build/pdf.worker"]
    // const url = 'https://github.com/Urinx/Books/blob/master/cs/%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%B3%BB%E7%BB%9F.pdf';
    // const loadingTask = pdfjsLib.getDocument({ data: content })
    // loadingTask.promise.then((pdf: any) => {
    //   console.log('PDF loaded', pdf);
    //   return pdf.getPage(1)
    // }).then((page: any) => {
    //   const scale = 1.5 // 设置展示比例
    //   const viewport = page.getViewport({
    //     scale,
    //   }); // 获取pdf尺寸
    //   const canvas = document.getElementById("canvas") as HTMLCanvasElement
    //   const context = canvas.getContext("2d");
    //   canvas.height =
    //     viewport.height || viewport.viewBox[3]; /* viewport.height is NaN */
    //   canvas.width =
    //     viewport.width ||
    //     viewport.viewBox[2]; /* viewport.width is also NaN */

    //   const renderContext = {
    //     canvasContext: context,
    //     viewport: viewport,
    //   };
    //   page.render(renderContext);
    // }).catch((error: any) => {
    //   console.log('error', error);
    // })
  }
}

async function getLocalFile() {
  const path = await appDir()
  const selected = await open({defaultPath: path});
  console.log('selected', selected);

  if (Array.isArray(selected)) {
    // user selected multiple directories
  } else if (selected === null) {
    // user cancelled the selection
  } else {
    console.log(selected)
  }
}

</script>

<template>
  <n-layout>
    <n-layout-header :inverted="inverted" bordered>
      <n-space justify="end">
        <EnterIcon @click="entryAction" />
        <input type="file" @change="fileChange" :disabled="isLoadFile">
        <SetIcon />
      </n-space>
    </n-layout-header>
    <n-layout has-sider>
      <n-layout-sider bordered show-trigger collapse-mode="width" :collapsed-width="64" :width="160"
        :native-scrollbar="false" :inverted="inverted" style="max-height: 320px">
        <n-menu :inverted="inverted" :collapsed-width="64" :collapsed-icon-size="22" :options="siderMenuOptions" />
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