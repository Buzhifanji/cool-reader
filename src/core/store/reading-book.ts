import { reactive } from "vue";
import { findBook } from "../book/book";
import { ReadingBook } from "../models/book";
import { StorageBook } from "../type";
import { Bookextname } from "../utils/enums";

// 当前打开书本的数据
const readingBook = reactive<StorageBook>(
  new ReadingBook("", Bookextname.pdf, 0, "", "", "", "", new Uint8Array())
);

export async function setReadingBook(bookId: string) {
  const book = await findBook(bookId);
  if (book) {
    readingBook.bookName = book.bookName;
    readingBook.extname = book.extname;
    readingBook.fileSize = book.fileSize;
    readingBook.path = book.path;
    readingBook.category = book.category;
    readingBook.cover = book.cover;
    readingBook.id = book.id;
    readingBook.fileContent = book.fileContent;
  }
}

export function getReadingBook() {
  return readingBook;
}
