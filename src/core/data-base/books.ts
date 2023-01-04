import { BookListItem } from '../book';
import { dexieStore } from './center';

export function addBooks(value: BookListItem) {
  return dexieStore.books.add(value)
}

export function removeBookById(bookId: string) {
  return dexieStore.books.where({ bookId }).delete();
}

export function updateBook(value: BookListItem) {
  return dexieStore.books.put(value)
}

export function getAllBooks() {
  return dexieStore.books.toArray();
}

export function getBookById(bookId: string) {
  return dexieStore.books.get(bookId);
}
