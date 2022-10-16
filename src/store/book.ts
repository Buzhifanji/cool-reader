import { BOOKLIST } from "@/constants";
import { Bookextname } from "@/enums";
import { BookContext, BookData, UpdateBook } from "@/interfaces";
import { ReadingBook } from "@/model";
import { isIndex } from "@/utils";
import { forage } from "@tauri-apps/tauri-forage";
import { reactive } from "vue";

// 当前打开书本的数据
const readingBook = reactive<BookData>(
  new ReadingBook("", Bookextname.pdf, 0, "", "", "", "", new Uint8Array(), [])
);

let context: BookContext = null;

export async function setReadingBook(id: string, context: BookContext) {
  const book = await getBookById(id);
  if (book) {
    readingBook.bookName = book.bookName;
    readingBook.extname = book.extname;
    readingBook.size = book.size;
    readingBook.path = book.path;
    readingBook.category = book.category;
    readingBook.cover = book.cover;
    readingBook.id = id;
    readingBook.content = book.content;
    readingBook.catalog = book.catalog;
  }
  return readingBook;
}

export function getReadingBook() {
  return readingBook;
}

export function updateReadingBook({ content, catalog }: UpdateBook) {
  if (content) {
    content = content;
  }
  if (catalog) {
    readingBook.catalog = catalog;
  }
}

export async function addBook(book: BookData) {
  const [index, books] = await findBook(book.id);
  let result = [book];
  if (books && !isIndex(index)) {
    result = [...books, book];
  }
  await updateBook(result);
}

export async function removeBook(id: string) {
  const [index, books] = await findBook(id);
  if (isIndex(index)) {
    books.splice(index, 1);
    await updateBook(books);
  }
}

export async function hasBook(id: string) {
  const [index] = await findBook(id);
  return isIndex(index);
}

export function getAllBooks(): Promise<BookData[]> {
  return forage.getItem({ key: BOOKLIST })();
}

export async function getBookById(id: string) {
  const [index, books] = await findBook(id);
  return isIndex(index) ? books[index] : null;
}

async function findBook(id: string): Promise<[number, BookData[]]> {
  let index = -1;
  const books = await getAllBooks();
  if (books) {
    index = books.findIndex((book) => book.id === id);
  }
  return [index, books];
}

function updateBook(value: any) {
  return forage.setItem({ key: BOOKLIST, value })();
}
