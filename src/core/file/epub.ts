import epubjs from "epubjs";
import { NavItem } from "epubjs/types/navigation";
import { StorageBook } from "../type";

const epubCatalogs = new Map<string, NavItem[]>();

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
      const catalog = book.navigation.toc;
      formateEpubCatalog(catalog);
      epubCatalogs.set(id, catalog);
    });
  });
}

export function getEpubCatalog(bookId: string) {
  const result = epubCatalogs.get(bookId);
  console.log("result", result);
  return result ? result : [];
}

function formateEpubCatalog(arr: NavItem[]) {
  arr.forEach((item) => {
    const items = item.subitems;
    if (items && items.length) {
      formateEpubCatalog(items);
    } else {
      delete item.subitems;
    }
  });
}
