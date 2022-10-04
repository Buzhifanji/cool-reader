import epubjs, { Rendition } from "epubjs";
import { NavItem } from "epubjs/types/navigation";
import { StorageBook } from "../type";

interface EpubContenxt {
  catalog: NavItem[]; // 目录
  rendition: Rendition;
}

const epub = new Map<string, EpubContenxt>();

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
    const rendition = book.renderTo("viewer", {
      flow: "scrolled",
      width: "793px",
      height: "100%",
      allowScriptedContent: true,
    });
    const themes = rendition.themes;
    themes.fontSize(24 + "px");

    rendition.display();

    book.ready.then(() => {
      const catalog = book.navigation.toc;
      formateEpubCatalog(catalog);
      epub.set(id, { catalog, rendition });
    });
  });
}

export function getEpubCatalog(bookId: string) {
  const result = epub.get(bookId);
  return result ? result.catalog : [];
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

/**
 * 目录跳转
 * @param bookId
 * @param catalogId
 */
export function epubGotoPage(bookId: string, href: string) {
  const book = epub.get(bookId);
  book?.rendition.display(href);
}

export function epubPageUp(bookId: string) {
  const book = epub.get(bookId);
  book?.rendition.prev();
}

export function epubPageDown(bookId: string) {
  const book = epub.get(bookId);
  book?.rendition.next();
}
