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
  book_id: string;
  class_name: string;
  notes?: string;
}
