import { window } from "@tauri-apps/api"
import { StorageSerializers } from "@vueuse/core";
import { RECORD_LAST_POSITION, VIEWERCONTAINER } from "src/constants";
import { WinEvent } from "src/enums";
import { getReadingBook } from "src/store";
import { getEleById, isObj } from "src/utils";

interface State {
  [key: string]: number;
}

const readingBook = getReadingBook();
const state = useStorage<State>(RECORD_LAST_POSITION, null, localStorage, { serializer: StorageSerializers.object });

export const useSroll = () => {
  const container = ref<HTMLElement | null>(null);
  const webViewWindow = window.getCurrent();

  // 监听 窗口关闭
  webViewWindow.listen(WinEvent.Close, () => {
    const id = readingBook.id;
    const scrollTop = container.value!.scrollTop;
    if (isObj(state.value)) {
      state.value[id] = scrollTop;
    } else {
      state.value = {
        [id]: scrollTop,
      }
    }
    webViewWindow.close();
  })

  return { container }
}

// 跳转到上次记录的位置
export const jumpToRecordPosition = () => {
  const container = getEleById(VIEWERCONTAINER)! as HTMLDivElement;
  container.scrollTop = state.value[readingBook.id] || 0;
}