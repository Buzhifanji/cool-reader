export {}; // 必须保留
declare global {
  interface Window {
    "pdfjs-dist/build/pdf": any;
    "pdfjs-dist/build/pdf.worker": any;
  }
}
