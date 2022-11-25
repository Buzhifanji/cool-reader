import { VIEWER } from "src/constants";
import { getWebHighlight, updatePageNumber, updateReadingBook, } from "src/store";
import { concatRectDom, formateCatalog, getEpubIframe } from "src/utils";
import epubjs, { Rendition } from "epubjs";
import { initTooBar as closeTooBar, epubWebHighlight } from "src/components/book-content/toolbar";
import { Bookmark } from "@vicons/carbon";
import { EventType, isHeightWrap } from "../web-highlight";
import { DATA_WEB_HIGHLIGHT } from "../web-highlight/constant";

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

    // 选中文本
    rendition.on('selected', (cfiRange, contents) => {
      const range = rendition.getRange(cfiRange)
      const iframe = getEpubIframe()
      if (iframe) {
        const rect = iframe.getBoundingClientRect();
        epubWebHighlight(range, rect)
      }
    })

    // 样式表
    rendition.themes.register("dark", "src/style/web-highlight.css");
    rendition.themes.select("dark");

    // 点击
    rendition.on('click', (e) => {
      const target = e.target as HTMLElement;
      const iframe = getEpubIframe()
      const selection = iframe.contentDocument.getSelection()
      if (selection.isCollapsed) {
        if (isHeightWrap(target)) {
          // 打开工具栏
          const webHighlight = getWebHighlight();

          const id = target.getAttribute(DATA_WEB_HIGHLIGHT)
          const source = webHighlight.getSource(id);

          const _rect = target.getBoundingClientRect();
          const iframRect = iframe.getBoundingClientRect();

          const rect = concatRectDom(_rect, iframRect)

          webHighlight.emit(EventType.click, rect, source)
        } else {
          // 关闭工具栏
          closeTooBar()
        }
      }
    })

    rendition.on('relocated', location => {
      updatePageNumber(location.start.href)
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
