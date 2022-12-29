import { forage } from "@tauri-apps/tauri-forage";
import { isIndex } from 'src/utils';
import { BookListItem } from "./interface";

export const BOOKLIST = "_tauri_book_list_";

export function getAllBooks(): Promise<BookListItem[]> {
  return forage.getItem({ key: BOOKLIST })();
}

export async function getBookById(id: string) {
  const [index, books] = await findBook(id);
  return isIndex(index) ? books[index] : null;
}

export async function findBook(id: string): Promise<[number, BookListItem[]]> {
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

export async function hasBook(id: string) {
  const [index] = await findBook(id);
  return isIndex(index);
}

export async function removeBook(id: string) {
  const [index, books] = await findBook(id);
  if (isIndex(index)) {
    books.splice(index, 1);
    await updateBook(books);
  }
}

export async function addBook(book: BookListItem) {
  const [index, books] = await findBook(book.id);
  let result = [book];
  if (books && !isIndex(index)) {
    result = [...books, book];
  }
  await updateBook(result);
}
