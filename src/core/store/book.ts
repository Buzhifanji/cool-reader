import { StorageBook } from "../type";

const books = new Map<string, StorageBook>();

export function addBookToStore(id: string, value: StorageBook) {
  books.set(id, value);
}

export function removeBookFromStore(id: string) {
  return books.delete(id);
}

export function hasBookFromStore(id: string) {
  return books.has(id);
}

export function getBookFromStore(id: string) {
  return books.get(id);
}

export function getBooksFromStore() {
  const result: StorageBook[] = [];
  books.forEach((book) => result.push(book));
  return result;
}
