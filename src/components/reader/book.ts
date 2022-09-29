import { reactive } from "vue";
import { RouteLocationNormalizedLoaded } from "vue-router";
import { findBook, openBook } from "../../core/book/book";
import { getEpub } from "../../core/file/epub";
import { getPdf } from "../../core/file/pdf";
import { ReadingBook } from "../../core/models/book";
import { StorageBook } from "../../core/type";
import { Bookextname } from "../../core/utils/enums";

export const rendingBook = reactive<StorageBook>(
  new ReadingBook("", "", 0, "", "", "", "", new Uint8Array())
);

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

export const useReader = async (route: RouteLocationNormalizedLoaded) => {
  const id = route.query.id as string;
  await initReadingBook(id);
  const book = await openBook(rendingBook.id);
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
};
