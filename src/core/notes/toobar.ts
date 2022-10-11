import { PDFViewer } from "pdfjs-dist/web/pdf_viewer";
import { toolBar, toolBarStyle } from "../../components/tool-bar/tool-bar";
import { getReadingBook } from "../store";
import { getDomSource } from "../store/dom-source";
import { getBookContext } from "../store/reading-book";
import { domSourceFromRange } from "../toolbar";
import { DomRange } from "../toolbar/selection";
import { DomSource } from "../toolbar/type";
import { DATA_SOURCE_ID, DEFAULT_DOM_CLASS_NAME } from "../utils/constant";
import { getEleById, getPDFPageSelector, selector } from "../utils/dom";
import { Bookextname } from "../utils/enums";
import { getPosition } from "./postion";

function setToolBarPosition(node: HTMLElement, id: string) {
  const target = selector(
    `.${DEFAULT_DOM_CLASS_NAME}[${DATA_SOURCE_ID}=${id}]`,
    node
  )!;
  console.log(target);
  const textOffset = getDomSource(id)!.startMeta.textOffset;
  const { top, left } = getPosition(target);
  toolBarStyle.left = `${left + textOffset}px`;
  toolBarStyle.top = `${top - 61}px`;
}

function setToolBarData(data: DomSource) {
  toolBar.id = data.id;
  toolBar.show = true;
  toolBar.source = data;
}

function toolBarAction(contianer: HTMLElement, data: DomSource) {
  return new Promise(() => {
    setToolBarPosition(contianer, data.id);
    setToolBarData(data);
  });
}

function handlePdfToolbar(range: Range, context: PDFViewer) {
  const pageNumber = context.currentPageNumber;
  const contianer = selector(
    getPDFPageSelector(pageNumber),
    getEleById("viewer")!
  )!;
  const source = domSourceFromRange(range, contianer, pageNumber);
  if (source) {
    toolBarAction(contianer, source);
  }
}

export function openTooBar() {
  const domRange = new DomRange();
  const range = domRange.getDomRange();
  if (range) {
    const readingBook = getReadingBook();
    const context = getBookContext();
    if (readingBook.extname === Bookextname.pdf) {
      handlePdfToolbar(range, context as PDFViewer);
    }
  }
}

export function closeTooBar() {}
