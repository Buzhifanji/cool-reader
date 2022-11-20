import { getHighlights } from "src/components/highlight/highlight";
import { Bookextname } from "src/enums";
import { ExtnameFn } from "src/interfaces";
import { getReadingBook, setReadingBook } from "src/store";
import { renderEpub, useEpubChangePage } from "src/core/file/epub";
import { renderPdf, usePdfChangePage } from "src/core/file/pdf";
import { RouteLocationNormalizedLoaded } from "vue-router";
import { getIdeas } from "src/components/idea/idea";

export const useReaderBook = (route: RouteLocationNormalizedLoaded) => {
  const readingBook = getReadingBook();
  async function init() {
    try {
      const book = await setReadingBook(route.query.id as string, null);
      const renderBookStatus: ExtnameFn = {
        [Bookextname.pdf]: renderPdf,
        [Bookextname.epub]: renderEpub,
      };
      if (book.content) {
        await renderBookStatus[book.extname]?.(book.content);
        // 获取笔记内容
        getIdeas();
        // 获取高亮内容
        getHighlights();
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
  const readingBook = getReadingBook();
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
