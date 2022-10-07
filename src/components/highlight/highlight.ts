import { ref } from "vue";
import { pdfJumpToPage } from "../../core/file/pdf";
import { highlightParam } from "../../core/notes/type";
import { getHighlights, removeHighlight } from "../../core/service/highlight";
import { getReadingBook } from "../../core/store";
import { ExtnameFn } from "../../core/type";
import { Bookextname } from "../../core/utils/enums";
import { message } from "../../naive";

export const highlights = ref<highlightParam[]>([]);

export function updateHighlights() {
  const readingBook = getReadingBook();
  return getHighlights(readingBook.id).then(
    (value) => (highlights.value = value)
  );
}

export const useHighlights = () => {
  const readingBook = getReadingBook();
  const pageJumpStatus: ExtnameFn = {
    [Bookextname.pdf]: pdfJumpToPage,
    [Bookextname.epub]: () => message.warning("功能待开发中！"),
  };
  function remove(value: highlightParam) {
    removeHighlight(value.bookId, value.id).then(() => updateHighlights());
  }
  function jump(value: highlightParam) {
    pageJumpStatus[readingBook.extname]?.(value.pageNumber);
  }
  return { remove, jump };
};
