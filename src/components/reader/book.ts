import { reactive, ref } from "vue";
import { RouteLocationNormalizedLoaded } from "vue-router";
import { findBook } from "../../core/book/book";
import { epubPageDown, epubPageUp, getEpub } from "../../core/file/epub";
import { getPdf, pdfPageDown, pdfPageUp } from "../../core/file/pdf";
import { ReadingBook } from "../../core/models/book";
import { useReaderTool } from "../../core/notes/reader-tool";
import { getForageFile } from "../../core/store";
import { StorageBook } from "../../core/type";
import { Bookextname } from "../../core/utils/enums";

const rendingBook = reactive<StorageBook>(
  new ReadingBook("", "", 0, "", "", "", "", new Uint8Array())
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
    const id = route.query.id as string;
    await initReadingBook(id);
    // 开启笔记记录相关组件
    useReaderTool(rendingBook);
    const book = await getForageFile(rendingBook.id);
    if (book) {
      const { fileContent, extname } = book;
      if (fileContent) {
        // 获取封面
        switch (extname) {
          case Bookextname.pdf:
            await getPdf(rendingBook);
            break;
          case Bookextname.epub:
            await getEpub(rendingBook);
            break;
        }
      }
    }
  }
  init();
  return { rendingBook };
};

export const useControlDrawer = () => {
  const active = ref<boolean>(false);
  function openDrawer() {
    active.value = true;
  }
  return { active, openDrawer };
};

// 翻页
export const usePageTurn = () => {
  function pageUp() {
    const { id, extname } = rendingBook;
    switch (extname) {
      case Bookextname.pdf:
        pdfPageUp(id);
        break;
      case Bookextname.epub:
        epubPageUp(id);
        break;
    }
  }
  function pageDown() {
    const { id, extname } = rendingBook;
    switch (extname) {
      case Bookextname.pdf:
        pdfPageDown(id);
        break;
      case Bookextname.epub:
        epubPageDown(id);
        break;
    }
  }
  return { pageUp, pageDown };
};
