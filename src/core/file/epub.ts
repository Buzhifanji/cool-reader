import { VIEWER, VIEWERCONTAINER } from "src/constants";
import { updatePageNumber, updateReadingBook, } from "src/store";
import { getEleById, urlToBase64 } from "src/utils";
import epubjs, { Rendition, Location, Contents } from "epubjs";
import { lighlighClickBus, lighlightBus } from "../bus";

let rendition: Rendition | null = null; // epub.js 渲染后的上下文


export function getEpubCover(content: Uint8Array): Promise<string> {
  return new Promise((resolve, reject) => {
    const book = epubjs(content.buffer);
    book
      .coverUrl()
      .then((value) => {
        if (value) {
          resolve(urlToBase64(value))
        } else {
          resolve('')
        }
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
    rendition.on('selected', (cfiRange: string) => {
      const range = rendition!.getRange(cfiRange)
      const container = getEleById(VIEWERCONTAINER)! as HTMLDivElement;
      const scrollTop = container.scrollTop;

      lighlightBus.emit({ range, scrollTop })
    })

    // 样式表
    rendition.themes.register("dark", "src/style/web-highlight.css");
    rendition.themes.select("dark");

    // 点击
    rendition.on('click', (e: Event) => {
      const target = e.target as HTMLElement;
      lighlighClickBus.emit(target)
    })

    rendition.on('relocated', (location: Location) => {
      updatePageNumber(location.start.href)
    })
    updateReadingBook({ context: rendition });
  });
}

export const useEpubChangePage = () => {
  function epubJumpFromCatalog(href: string) {
    return rendition?.display(href);
  }
  function epubPageUp() {
    return rendition?.prev();
  }
  function epubPageDown() {
    return rendition?.next();
  }

  return { epubJumpFromCatalog, epubPageUp, epubPageDown };
};
