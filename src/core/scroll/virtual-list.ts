import { Ref } from "vue";
import { visiableData } from "render-big-data";

export const useVirtualList = (list: Ref<any[]>) => {
  const unsubscribe = visiableData.subscribe((value: any) => (list.value = value));
  onUnmounted(unsubscribe);
}