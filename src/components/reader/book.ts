import { reactive } from "vue";
import { RouteLocationNormalizedLoaded } from "vue-router";
import { books, openBook } from "../../core/book/book";
import { getEpub } from "../../core/file/epub";
import { getPdf } from "../../core/file/pdf";
import { ReadingBook } from "../../core/models/book";
import { StorageBook } from "../../core/type";
import { Bookextname } from "../../core/utils/enums";

export const rendingBook = reactive<StorageBook>(
  new ReadingBook("", "", 0, "", "", "", "", new Uint8Array())
);

function initReadingBook(index: number) {
  const selectedBook = books.value[index];
  console.log("selectedBook", selectedBook);
  rendingBook.bookName = selectedBook.bookName;
  rendingBook.extname = selectedBook.extname;
  rendingBook.fileSize = selectedBook.fileSize;
  rendingBook.path = selectedBook.path;
  rendingBook.category = selectedBook.category;
  rendingBook.cover = selectedBook.cover;
  rendingBook.id = selectedBook.id;
  rendingBook.fileContent = selectedBook.fileContent;
}

export const useReader = async (route: RouteLocationNormalizedLoaded) => {
  const index = Number(route.query.index);
  initReadingBook(index);
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
    // if (fileContent) {
    //   await getPdf(rendingBook);
    // } else {
    //   // TODO:
    //   console.log("没有数据");
    // }
  }
};
