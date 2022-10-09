export interface DomMeta {
  parentTagName: string;
  parentIndex: number;
  textOffset: number;
}

export interface DomNode {
  $node: Node;
  offset: number;
}

export interface DomSource {
  startMeta: DomMeta;
  endMeta: DomMeta;
  text: string;
  id: string;
  pageNumber: number;
  className: string;
}

export interface PaintSource {
  parentDom: HTMLElement;
  startDom: Node;
  endDom: Node;
  id: string;
}

export type Intervals = [number, number];
