import { defineStore } from "pinia";
import { StorageBook } from "../type";

export const useBookStore = defineStore("_book_", {
  state: () => ({
    books: new Map<string, StorageBook>(),
  }),
  getters: {
    getBookById: (state) => {
      return (id: string): StorageBook | undefined => state.books.get(id);
    },
  },
  actions: {
    setBook(id: string, value: StorageBook) {
      this.books.set(id, value);
    },
  },
});
