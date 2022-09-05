<template>
  <div>notes</div>
  <button @click="open">button</button>
</template>

<script setup lang="ts">
import { WebviewWindow } from "@tauri-apps/api/window";
import { useRouter } from "vue-router";

const router = useRouter();
let n = 1
function open() {
  n += 1;
  const webview = new WebviewWindow(`n-${n}`, {
    url: "view/index.html",
  });

  webview.once("tauri://created", function () {
  });
  webview.once("tauri://error", function (e) {
    // an error happened creating the webview window
  });
}
</script>
