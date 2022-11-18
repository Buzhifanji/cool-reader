import { pageNumber } from "src/core/notes/notes";
import { deleteDomSource, domSourceFromStore } from "src/core/toolbar";
import { DomSource } from "src/interfaces";
import { getHighlights, removeHighlight } from "src/server/highlight";
import {
  getDomSource,
  getReadingBook,
  removeDomSource,
  saveDomSource,
} from "src/store";
import { updateNodes } from "../notes/notes";
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
  return getHighlights(readingBook.id).then((value) => {
    highlights.value = value;
    saveDomSource(value);
  });
}

export function useRemoveHighlight(id: string, isTip = true) {
  const readingBook = getReadingBook();
  const source = getDomSource(id);
  if (source) {
    // 清除缓存
    deleteDomSource(source);
    // 清除 ui
    removeDomSource(id);
    // 清除数据库
    removeHighlight(readingBook.id, id, isTip).then(() => {
      updateHighlights();
      updateNodes();
    });
    resetToolBar();
  }
}
