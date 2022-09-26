import { PDFDocumentProxy } from "pdfjs-dist";

interface CachePDF {
  document: PDFDocumentProxy;
  heights: Map<number, number>;
}

const pdfDocument = new Map<string, CachePDF>(); // 缓存渲染 pdf 的 PDFDocumentProxy

export function getPdfDocument(bookId: string) {
  const pdf = pdfDocument.get(bookId);
  if (pdf) {
    return {
      pdf: pdf.document,
      heights: pdf.heights,
    };
  } else {
    return null;
  }
}

export function setPdfDocument(bookId: string, value: CachePDF) {
  return pdfDocument.set(bookId, value);
}

export function setPDfPagesHeight(
  bookId: string,
  index: number,
  height: number
) {
  const pdf = pdfDocument.get(bookId);
  pdf?.heights.set(index, height);
}
