import { getReadingBook, setReadingBook } from "@/store";
import { renderEpub, useEpubChangePage } from "@core/file/epub";
import { renderPdf, usePdfChangePage } from "@core/file/pdf";
import { ExtnameFn } from "@core/type";
import { Bookextname } from "@core/utils/enums";
import { RouteLocationNormalizedLoaded } from "vue-router";

export const useReaderBook = (route: RouteLocationNormalizedLoaded) => {
  const { readingBook } = getReadingBook();
  async function init() {
    try {
      const book = await setReadingBook(route.query.id as string, null);
      const renderBookStatus: ExtnameFn = {
        [Bookextname.pdf]: renderPdf,
        [Bookextname.epub]: renderEpub,
      };
      if (book.content) {
        await renderBookStatus[book.extname]?.(book.content);
        // 获取内容
        // useContextEvent();
        // updateHighlights();
      }
    } catch (error) {
      console.error(error);
    }
  }
  init();
  return { readingBook };
};

// 翻页
export const usePageTurn = () => {
  const { readingBook } = getReadingBook();
  const { pdfPageUp, pdfPageDown } = usePdfChangePage();
  const { epubPageUp, epubPageDown } = useEpubChangePage();

  function pageUp() {
    const pageUpStates: ExtnameFn = {
      [Bookextname.pdf]: pdfPageUp,
      [Bookextname.epub]: epubPageUp,
    };
    pageUpStates[readingBook.extname]?.();
  }

  function pageDown() {
    const pageDownStates: ExtnameFn = {
      [Bookextname.pdf]: pdfPageDown,
      [Bookextname.epub]: epubPageDown,
    };
    pageDownStates[readingBook.extname]?.();
  }

  return { pageUp, pageDown };
};
