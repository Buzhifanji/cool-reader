import { ref, watchEffect } from "vue";
import { pdfJumpToPage } from "../../core/file/pdf";
import { useRemoveHighlight } from "../../core/notes/toobar";
import { highlightParam } from "../../core/notes/type";
import { getHighlights } from "../../core/service/highlight";
import { getReadingBook } from "../../core/store";
import { domSourceFromStore } from "../../core/toolbar";
import { ExtnameFn } from "../../core/type";
import { Bookextname } from "../../core/utils/enums";
import { message } from "../../naive";

export const highlights = ref<highlightParam[]>([]);

const pageNumber = ref<number>(1);

watchEffect(() => {
  const list = getPageHighlights(pageNumber.value);
  domSourceFromStore(list);
});

export function updatePageNumber(number: number) {
  pageNumber.value = number;
}

// 更新
export function updateHighlights() {
  const readingBook = getReadingBook();
  return getHighlights(readingBook.id).then(
    (value) => (highlights.value = value)
  );
}

// 根据 pageNumber 过滤出当前页数据
export function getPageHighlights(pageNumber: number) {
  return highlights.value.filter((value) => value.pageNumber === pageNumber);
}

export const useHighlights = () => {
  const readingBook = getReadingBook();
  const pageJumpStatus: ExtnameFn = {
    [Bookextname.pdf]: pdfJumpToPage,
    [Bookextname.epub]: () => message.warning("功能待开发中！"),
  };
  // 删除
  function remove({ id }: highlightParam) {
    useRemoveHighlight(id);
  }
  // 跳转
  function jump(value: highlightParam) {
    pageJumpStatus[readingBook.extname]?.(value.pageNumber);
  }
  return { remove, jump };
};
