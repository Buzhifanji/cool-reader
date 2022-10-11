import { PDFViewer } from "pdfjs-dist/web/pdf_viewer";
import { getBookContext, getReadingBook } from "../store";
import { Bookextname } from "../utils/enums";

export function getPageNumber() {
  const readingBook = getReadingBook();
  const context = getBookContext();
  let result: number = 0;
  switch (readingBook.extname) {
    case Bookextname.pdf:
      result = (context as PDFViewer).currentPageNumber;
  }
  return result;
}
