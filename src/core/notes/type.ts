import { DomMeta } from "web-highlighter/dist/types";

export type HEvent = MouseEvent | TouchEvent;
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
}
export interface highlightParam {
  bookId: string;
  className: string;
  startMeta: DomMeta;
  endMeta: DomMeta;
  text: string;
  id: string;
}
