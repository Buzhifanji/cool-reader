import { VIEWER } from "src/constants";
import { updateReadingBook, } from "src/store";
import { formateCatalog, getEpubIframe } from "src/utils";
import epubjs, { Rendition } from "epubjs";
import InlineView from 'epubjs/lib/managers/views/inline';
import { epubWebHighlight } from "src/components/book-content/toolbar";
import { Bookmark } from "@vicons/carbon";

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
      // 目录
      const catalog = book.navigation.toc;
      console.log(catalog)
      formateCatalog(catalog, "subitems");
      updateReadingBook({ catalog: catalog });
    });

    rendition = book.renderTo(VIEWER, {
      flow: "scrolled",
      width: "793px",
      // height: "100%",
      allowScriptedContent: true,
      // view: InlineView
    });
    rendition.themes.fontSize(24 + "px");

    rendition
      .display()
      .then(() => {
        resolve(rendition!);
      })
      .catch((err) => reject(err));

    rendition.on('selected', (cfiRange, contents) => {
      const range = rendition.getRange(cfiRange)
      const iframe = getEpubIframe()
      if (iframe) {
        const rect = iframe.getBoundingClientRect();
        epubWebHighlight(range, rect)
      }
    })

    rendition.on('click', () => {

    })
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
