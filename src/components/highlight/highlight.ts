import { pageNumber } from "@/core/notes/notes";
import { deleteDomSource, domSourceFromStore } from "@/core/toolbar";
import { DomSource } from "@/interfaces";
import { getHighlights, removeHighlight } from "@/server/highlight";
import { getDomSource, getReadingBook, removeDomSource } from "@/store";
import { ref, watchEffect } from "vue";
import { resetToolBar } from "../toolbar/toolbar";

export const highlights = ref<DomSource[]>([]);

const readingBook = getReadingBook();

watchEffect(() => {
  const list = highlights.value.filter(
    (value) => value.pageNumber === pageNumber.value
  );
  domSourceFromStore(list);
});

// 更新
export function updateHighlights() {
  return getHighlights(readingBook.id).then(
    (value) => (highlights.value = value)
  );
}

export function useRemoveHighlight(id: string, isTip = true) {
  const readingBook = getReadingBook();
  const source = getDomSource(id);
  if (source) {
    // 清楚缓存
    deleteDomSource(source);
    // 清楚 ui
    removeDomSource(id);
    // 清楚数据库
    removeHighlight(readingBook.id, id, isTip).then(() => {
      updateHighlights();
    });
    resetToolBar();
  }
}
