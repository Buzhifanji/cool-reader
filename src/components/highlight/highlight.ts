import { ref } from "vue";
import { pdfJumpToPage } from "../../core/file/pdf";
import { highlightParam } from "../../core/notes/type";
import { getReadingBook } from "../../core/store";
import { ExtnameFn } from "../../core/type";
import { Bookextname } from "../../core/utils/enums";

export const highlights = ref<highlightParam[]>([]);

export const useHighlights = () => {
  const readingBook = getReadingBook();
  const pageJumpStatus: ExtnameFn = {
    [Bookextname.pdf]: pdfJumpToPage,
    [Bookextname.epub]: () => console.log("todo"),
  };
  function remove(value: highlightParam) {
    console.log("remove", value);
  }
  function jump(value: highlightParam) {
    pageJumpStatus[readingBook.extname]?.(value.pageNumber);
  }
  return { remove, jump };
};
