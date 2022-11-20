import { deleteDomSource, domSourceFromStore } from "src/core/toolbar";
import { DomSource } from "src/core/web-highlight";
import { removeHighlight } from "src/server/highlight";
import { getHeighlightsById } from "src/server/notes";
import {
  getDomSource,
  getReadingBook,
  removeDomSource,
  saveDomSource,
  paintHighlight,
  getPageNumber,
} from "src/store";
import { updateNodes } from "../notes/notes";
import { resetToolBar } from "../toolbar/toolbar";

export const highlights = ref<DomSource[]>([]);

const pageNumber = getPageNumber();

watchEffect(() => {
  const list = highlights.value.filter(value => value.pageNumber === pageNumber.value);
  paintHighlight(list)
});

export function getHighlights() {
  const readingBook = getReadingBook();
  getHeighlightsById(readingBook.id).then(value => {
    highlights.value = value;
  })
}

// 更新
export function updateHighlights() {
  // const readingBook = getReadingBook();
  // return getHighlights(readingBook.id).then((value) => {
  //   highlights.value = value;
  //   saveDomSource(value);
  // });
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
