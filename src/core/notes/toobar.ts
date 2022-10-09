import { PDFViewer } from "pdfjs-dist/web/pdf_viewer";
import { getReadingBook } from "../store";
import { getBookContext } from "../store/reading-book";
import { domSourceFromRange } from "../toolbar";
import { DomRange } from "../toolbar/selection";
import { getEleById, getPDFPageSelector, selector } from "../utils/dom";
import { Bookextname } from "../utils/enums";

function handlePdfToolbar(range: Range, context: PDFViewer) {
  const pageNumber = context.currentPageNumber;
  const pdfSelector = getPDFPageSelector(pageNumber);
  const contianer = getEleById("viewer")!;
  const parent = selector(pdfSelector, contianer)!;
  domSourceFromRange(range, parent, pageNumber);
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
