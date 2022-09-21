import { reactive, ref } from "vue";
import { books } from "../../core/book/book";
import { getCatalog } from "../../core/book/catalog";
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

// 书本目录
export const catalog = ref<any[]>([]);
export function getBookCatalog() {
  catalog.value = getCatalog(rendingBook.id);
  console.log("catalog.value", catalog.value);
}
