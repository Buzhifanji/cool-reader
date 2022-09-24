import { PDFDocumentProxy } from "pdfjs-dist";

interface CachePDF {
  document: PDFDocumentProxy;
  height: number;
}

const pdfDocument = new Map<string, CachePDF>();

export function getPdfDocument(bookId: string) {
  const pdf = pdfDocument.get(bookId);
  if (pdf) {
    return {
      pdf: pdf.document,
      numPages: pdf.document.numPages,
      height: pdf.height,
    };
  } else {
    return null;
  }
}

export function setPdfDocument(bookId: string, value: CachePDF) {
  return pdfDocument.set(bookId, value);
}
