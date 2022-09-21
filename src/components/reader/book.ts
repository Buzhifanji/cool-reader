import { reactive } from "vue";
import { books } from "../../core/book/book";
import { ReadingBook } from "../../core/models/book";
import { StorageBook } from "../../core/type";

export const rendingBook = reactive<StorageBook>(
  new ReadingBook("", "", 0, "", "", "", "", new Uint8Array())
);

export function initReadingBook(index: number) {
  const selectedBook = books.value[index];
  rendingBook.bookName = selectedBook.bookName;
  rendingBook.extname = selectedBook.extname;
  rendingBook.fileSize = selectedBook.fileSize;
  rendingBook.path = selectedBook.path;
  rendingBook.category = selectedBook.category;
  rendingBook.cover = selectedBook.cover;
  rendingBook.id = selectedBook.id;
  rendingBook.fileContent = selectedBook.fileContent;
}
