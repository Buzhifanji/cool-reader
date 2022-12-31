import { window } from "@tauri-apps/api"
import { StorageSerializers } from "@vueuse/core";
import { READ_PROGRESS_CHANGE, RECORD_LAST_POSITION, VIEWERCONTAINER } from "src/constants";
import { WinEvent } from "src/enums";
import { getEleById, isObj } from "src/utils";
import { useReadBookStore } from 'src/core/book';
import { emit } from "@tauri-apps/api/event";
import { config } from "src/config";

interface State {
  [key: string]: number;
}

const state = useStorage<State>(RECORD_LAST_POSITION, null, localStorage, { serializer: StorageSerializers.object });

export const useSroll = () => {
  const container = ref<HTMLElement | null>(null);
  const webViewWindow = window.getCurrent();

  // 监听 窗口关闭
  webViewWindow.listen(WinEvent.Close, () => {
    const id = useReadBookStore().readingBook.id;
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

  // 计算阅读进度
  const onScroll = useThrottleFn(() => {
    const readBookStore = useReadBookStore()
    const { scrollTop, scrollHeight } = container.value!
    const readProgress = +(scrollTop / scrollHeight * 100).toFixed(0)

    readBookStore.update({ readProgress })

    if (config.multiWindow) {
      emit(READ_PROGRESS_CHANGE, { readProgress })
    }
  }, 1500)

  return { container, onScroll }
}

// 跳转到上次记录的位置
export const jumpToRecordPosition = () => {
  const container = getEleById(VIEWERCONTAINER)! as HTMLDivElement;
  container.scrollTop = state.value[useReadBookStore().readingBook.id] || 0;
}