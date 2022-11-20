export interface DomMetaRes {
  index: number;
  tag_name: string;
  offset: number;
}

export interface NotesRes {
  book_id: string;
  id: string;
  text: string;
  start_dom_meta: DomMetaRes;
  end_dom_meta: DomMetaRes;
  page_number: number;
  class_name: string;
  notes: string;
  create_time: number;
  tag_name: string;
}