import { VIEWER } from "src/constants";
import { updateReadingBook } from "src/store";
import { formateCatalog } from "src/utils";
import epubjs, { Rendition } from "epubjs";

let rendition: Rendition | null = null; // epub.js 渲染后的上下文

export function getEpubCover(content: Uint8Array): Promise<string> {
  return new Promise((resolve, reject) => {
    const book = epubjs(content.buffer);
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

export function renderEpub(content: Uint8Array): Promise<Rendition> {
  return new Promise((resolve, reject) => {
    const book = epubjs(content.buffer);
    book.ready.then(() => {
      let catalog = book.navigation.toc;
      formateCatalog(catalog, "subitems");
      updateReadingBook({ catalog: catalog });
    });

    rendition = book.renderTo(VIEWER, {
      flow: "scrolled",
      width: "793px",
      height: "100%",
      allowScriptedContent: true,
    });
    rendition.themes.fontSize(24 + "px");

    rendition
      .display()
      .then(() => {
        resolve(rendition!);
      })
      .catch((err) => reject(err));

    updateReadingBook({ context: rendition });
  });
}

export const useEpubChangePage = () => {
  function epubJumpFromCatalog(href: string) {
    rendition?.display(href);
  }
  function epubPageUp() {
    rendition?.prev();
  }
  function epubPageDown() {
    rendition?.next();
  }

  return { epubJumpFromCatalog, epubPageUp, epubPageDown };
};
