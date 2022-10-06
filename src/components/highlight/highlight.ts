import { ref } from "vue";
import { pdfJumpToPage } from "../../core/file/pdf";
import { highlightParam } from "../../core/notes/type";

export const highlights = ref<highlightParam[]>([]);

export const useHighlights = () => {
  // const pageJumpStatus: ExtnameFn = {
  //   [Bookextname.pdf]: pdfEvent,
  //   [Bookextname.epub]: epubEvent,
  // };
  function remove(value: highlightParam) {
    console.log("remove", value);
  }
  function jump(value: highlightParam) {
    console.log("jump", value);

    pdfJumpToPage(value.pageNumber);
  }
  return { remove, jump };
};
