import epubjs, { Rendition } from "epubjs";
import { NavItem } from "epubjs/types/navigation";
import { StorageBook } from "../type";

interface EpubContenxt {
  catalog: NavItem[]; // 目录
  rendition: Rendition;
}

let rendition: Rendition | null = null; // epub.js 渲染后的上下文
let catalog: NavItem[] = []; // 目录

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

export function renderEpub({ fileContent }: StorageBook) {
  return new Promise((resolve, reject) => {
    const book = epubjs(fileContent.buffer);
    book.ready.then(() => {
      catalog = book.navigation.toc;
      formateEpubCatalog(catalog);
    });

    rendition = book.renderTo("viewer", {
      flow: "scrolled",
      width: "793px",
      height: "100%",
      allowScriptedContent: true,
    });
    rendition.themes.fontSize(24 + "px");

    return rendition.display();
  });
}

export function getEpubCatalog() {
  return catalog;
}

/**
 * 目录跳转
 * @param bookId
 * @param catalogId
 */
export function epubGotoPage(href: string) {
  rendition?.display(href);
}

export function epubPageUp() {
  rendition?.prev();
}

export function epubPageDown() {
  rendition?.next();
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
