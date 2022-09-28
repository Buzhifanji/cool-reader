import epubjs from "epubjs";
import Navigation from "epubjs/types/navigation";
import { StorageBook } from "../type";

const epubCatalogs = new Map<string, Navigation>();

export function getEpubCover(fileContent: Uint8Array): Promise<string> {
  return new Promise((resolve, reject) => {
    const book = epubjs(fileContent.buffer);
    book
      .coverUrl()
      .then((value) => {
        value ? resolve(value) : resolve("");
      })
      .catch((err) => {
        resolve("");
      });
  });
}

export function getEpub({ fileContent, id }: StorageBook) {
  return new Promise((resolve, reject) => {
    const book = epubjs(fileContent.buffer);
    book.renderTo("viewer").display();

    book.ready.then(() => {
      epubCatalogs.set(id, book.navigation);
    });
  });
}

export function getEpubCatalog(bookId: string) {
  return epubCatalogs.get(bookId);
}
