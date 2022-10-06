import { reactive } from "vue";
import { RouteLocationNormalizedLoaded } from "vue-router";
import { findBook } from "../../core/book/book";
import { epubPageDown, renderEpub } from "../../core/file/epub";
import { pdfPageDown, pdfPageUp, renderPdf } from "../../core/file/pdf";
import { ReadingBook } from "../../core/models/book";
import { useReaderTool } from "../../core/notes/reader-tool";
import { getForageFile } from "../../core/store";
import { StorageBook } from "../../core/type";
import { Bookextname } from "../../core/utils/enums";
import { PageTurnStatues } from "./type";

const rendingBook = reactive<StorageBook>(
  new ReadingBook("", Bookextname.pdf, 0, "", "", "", "", new Uint8Array())
);

export const useReaderBook = (route: RouteLocationNormalizedLoaded) => {
  async function initReadingBook(bookId: string) {
    const book = await findBook(bookId);
    if (book) {
      rendingBook.bookName = book.bookName;
      rendingBook.extname = book.extname;
      rendingBook.fileSize = book.fileSize;
      rendingBook.path = book.path;
      rendingBook.category = book.category;
      rendingBook.cover = book.cover;
      rendingBook.id = book.id;
      rendingBook.fileContent = book.fileContent;
    }
  }
  async function init() {
    try {
      await initReadingBook(route.query.id as string);
      const book = await getForageFile(rendingBook.id);
      const renderBookStatus: PageTurnStatues = {
        [Bookextname.pdf]: renderPdf,
        [Bookextname.epub]: renderEpub,
      };
      if (book) {
        let context = null;
        if (book.fileContent) {
          // 获取内容
          context = await renderBookStatus[rendingBook.extname]?.(rendingBook);

          // 开启高亮功能
          useReaderTool(rendingBook, context);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  init();
  return { rendingBook };
};

// 翻页
export const usePageTurn = () => {
  const pageUpStates: PageTurnStatues = {
    [Bookextname.pdf]: pdfPageUp,
    [Bookextname.epub]: pdfPageUp,
  };
  const pageDownStates: PageTurnStatues = {
    [Bookextname.pdf]: pdfPageDown,
    [Bookextname.epub]: epubPageDown,
  };
  function pageUp() {
    pageUpStates[rendingBook.extname]?.();
  }
  function pageDown() {
    pageDownStates[rendingBook.extname]?.();
  }
  return { pageUp, pageDown };
};
