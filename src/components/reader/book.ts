import { RouteLocationNormalizedLoaded } from "vue-router";
import { epubPageDown, renderEpub } from "../../core/file/epub";
import { pdfPageDown, pdfPageUp, renderPdf } from "../../core/file/pdf";
import { useReaderTool } from "../../core/notes/reader-tool";
import {
  getForageFile,
  getReadingBook,
  setReadingBook,
} from "../../core/store";
import { setBookContext } from "../../core/store/reading-book";
import { ExtnameFn } from "../../core/type";
import { Bookextname } from "../../core/utils/enums";

export const useReaderBook = (route: RouteLocationNormalizedLoaded) => {
  const readingBook = getReadingBook();
  async function init() {
    try {
      await setReadingBook(route.query.id as string);
      const book = await getForageFile(readingBook.id);
      const renderBookStatus: ExtnameFn = {
        [Bookextname.pdf]: renderPdf,
        [Bookextname.epub]: renderEpub,
      };
      if (book) {
        let context = null;
        if (book.fileContent) {
          // 获取内容
          context = await renderBookStatus[readingBook.extname]?.(readingBook);
          setBookContext(context);
          // 开启高亮功能
          useReaderTool(context);
        }
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
  const pageUpStates: ExtnameFn = {
    [Bookextname.pdf]: pdfPageUp,
    [Bookextname.epub]: pdfPageUp,
  };
  const pageDownStates: ExtnameFn = {
    [Bookextname.pdf]: pdfPageDown,
    [Bookextname.epub]: epubPageDown,
  };
  function pageUp() {
    pageUpStates[readingBook.extname]?.();
  }
  function pageDown() {
    pageDownStates[readingBook.extname]?.();
  }
  return { pageUp, pageDown };
};
