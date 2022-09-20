import { appWindow } from "@tauri-apps/api/window";
import { ref } from "vue";

export const readFileSize = ref<number>(0);
export const percentage = ref<number>(0);

export function listFileSize() {
  percentage.value = 1;
  readFileSize.value = 0;
  return appWindow.listen("fileSize", ({ payload }) => {
    readFileSize.value = (payload as unknown as any).message;
  });
}

// 计算文件下载进度
export function calculatePercentage(n: number) {
  if (readFileSize.value && n) {
    percentage.value = Math.ceil((n / readFileSize.value) * 100);
  } else {
    percentage.value = 0;
  }
}
