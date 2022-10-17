import { Rendition } from "epubjs";
import { PDFViewer } from "pdfjs-dist/web/pdf_viewer";

export type HEvent = MouseEvent | TouchEvent;
export type Context = PDFViewer | Rendition | null;

export interface HData {
  id: string;
}

export interface DomMetaRespone {
  parent_index: number;
  parent_tag_name: string;
  text_offset: number;
}

interface bookInfo {
  book_id: string;
  class_name: string;
}

export interface highlightResponse extends bookInfo {
  id: string;
  text: string;
  start_meta: DomMetaRespone;
  end_meta: DomMetaRespone;
  page_number: number;
}
// export interface highlightParam {
//   bookId: string;
//   pageNumber: number;
//   className: string;
//   startMeta: DomMeta;
//   endMeta: DomMeta;
//   text: string;
//   id: string;
// }
