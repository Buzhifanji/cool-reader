import { PDFDocumentProxy } from "pdfjs-dist";
import { PDFViewer } from "pdfjs-dist/web/pdf_viewer";

/**
 * 缓存 pdf 数据信息
 */

interface PdfBook {
  pdfViewer: PDFViewer;
  pdf: PDFDocumentProxy;
  catalogs: any[]; // 目录
}

const pdfBooks = new Map<string, PdfBook>();

export function setPdfBook(bookId: string, options: PdfBook) {
  return pdfBooks.set(bookId, options);
}

export function getPdfBook(bookId: string) {
  return pdfBooks.get(bookId);
}

/**
 * 获取 pdf 目录
 * @param bookId
 * @returns
 */
export function getPdfCatalogs(bookId: string) {
  const book = getPdfBook(bookId);
  return book ? book.catalogs : [];
}
