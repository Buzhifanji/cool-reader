export interface DomMeta {
  parentTagName: string;
  parentIndex: number;
  textOffset: number;
}

export interface DomSource {
  startMeta: DomMeta;
  endMeta: DomMeta;
  text: string;
  notes?: string;
  id: string;
  pageNumber: number;
  className: string;
  bookId: string;
}

export interface PaintSource {
  parentDom: HTMLElement;
  startDom: Node;
  endDom: Node;
  id: string;
}
