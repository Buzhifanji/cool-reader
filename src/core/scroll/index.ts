import { window } from "@tauri-apps/api"
import { TauriEvent } from "@tauri-apps/api/event";
import { RECORD_LAST_POSITION, VIEWERCONTAINER } from "src/constants";
import { getEleById } from "src/utils";

export const useSroll = () => {
  const container = ref<HTMLElement | null>(null);

  const webViewWindow = window.getCurrent();

  // 监听 窗口关闭
  webViewWindow.listen(TauriEvent.WINDOW_CLOSE_REQUESTED, () => {
    const scrollY = container.value!.scrollTop;
    localStorage.setItem(RECORD_LAST_POSITION, scrollY.toString());
    webViewWindow.close();
  })

  return { container }
}

// 跳转到上次记录的位置
export const jumpToRecordPosition = () => {
  const container = getEleById(VIEWERCONTAINER)! as HTMLDivElement;
  const top = localStorage.getItem(RECORD_LAST_POSITION);
  if (top) {
    container.scrollTop = +top
  }
}