import { Rendition } from "epubjs";
import { PDFViewer } from "pdfjs-dist/web/pdf_viewer";
import { updatePageNumber } from "../../components/highlight/highlight";
import { controlNodesSection } from "../../components/reader/notes";
import { getBookContext, getReadingBook } from "../store";
import { ExtnameFn } from "../type";
import { Bookextname } from "../utils/enums";

// epub.js 渲染文本采用了 iframe，原本监听的事件无效。所以需要重新处理事件
function epubEvent(rendition: Rendition) {
  rendition.on("click", () => {
    // 关闭笔记栏
    controlNodesSection(false);
    // const $root = getReaderToolRoot();
    // if ($root) {
    //   openReaderTool($root as Document);
    // }
  });
}

function pdfEvent(pdfViewer: PDFViewer) {
  pdfViewer.eventBus.on("pagechanging", (value: any) => {
    console.log(value);
    updatePageNumber(value.pageNumber);
  });
}

export function useContextEvent() {
  const readingBook = getReadingBook();
  const context = getBookContext();
  const contextEventStatus: ExtnameFn = {
    [Bookextname.pdf]: pdfEvent,
    [Bookextname.epub]: epubEvent,
  };
  contextEventStatus[readingBook.extname]?.(context);
}
