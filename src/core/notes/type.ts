import HighlightSource from "web-highlighter/dist/model/source";

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

export interface highlightResponse extends bookInfo{
  id: string;
  text: string;
  start_meta: DomMetaRespone;
  end_meta: DomMetaRespone;
}
export type highlightParam = HighlightSource extends bookInfo;
