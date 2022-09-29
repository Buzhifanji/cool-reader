import { reactive, ref } from "vue";
import { RouteLocationNormalizedLoaded } from "vue-router";
import { findBook } from "../../core/book/book";
import { epubPageDown, epubPageUp, getEpub } from "../../core/file/epub";
import { getPdf } from "../../core/file/pdf";
import { ReadingBook } from "../../core/models/book";
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
    const book = await getForageFile(rendingBook.id);
    if (book) {
      const { fileContent, extname } = book;
      if (fileContent) {
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
    switch (rendingBook.extname) {
      case Bookextname.pdf:
        break;
      case Bookextname.epub:
        epubPageUp(rendingBook.id);
        break;
    }
  }
  function pageDown() {
    switch (rendingBook.extname) {
      case Bookextname.pdf:
        break;
      case Bookextname.epub:
        epubPageDown(rendingBook.id);
        break;
    }
  }
  return { pageUp, pageDown };
};
