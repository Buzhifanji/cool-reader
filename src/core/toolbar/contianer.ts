import { PDFViewer } from "pdfjs-dist/web/pdf_viewer";
import { getBookContext, getReadingBook } from "../store";
import { VIEWER } from "../utils/constant";
import { getEleById, getPDFPageSelector, selector } from "../utils/dom";
import { Bookextname } from "../utils/enums";

function handePdfContainer(context: PDFViewer) {
  const pageNumber = context.currentPageNumber;
  return selector(getPDFPageSelector(pageNumber), getEleById(VIEWER)!)!;
}

// 获取不同格式的渲染文本容器
export function getDomContianer() {
  const readingBook = getReadingBook();
  const context = getBookContext();
  let result: HTMLElement | null = null;
  switch (readingBook.extname) {
    case Bookextname.pdf:
      result = handePdfContainer(context as PDFViewer);
  }
  return result;
}
