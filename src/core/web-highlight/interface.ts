export type rootType = Document | HTMLElement;

export type contextTpe = Document | Window;

export type EleOrText = HTMLElement | Text;


export interface WebHighlightOptions {
  context?: contextTpe// 上下文,默认是 window，但存在 iframe 的情况，此时需要重新设置 context
  root?: rootType; // 根节点，用于处理 动态dom 场景。
  tagName?: string; // 渲染标签类型，默认 i 标签
  // isMerge?: boolean; // todo: 重复高亮是否合并，默认 false
  className?: string; // 多个用空格隔空，例如： 'yellow blue'
}

export interface DomNode {
  node: Node;
  offset: number;
}

export interface SelectTextNode extends DomNode {
  parent: HTMLElement;
  parentOffset: number;
}

export interface Tooltip {
  icon: Node; // 图标
  label: string;
  id: string;
}

export interface Notes {
  content: string; // 笔记内容
  createTime: number; // 创建时间
  tag: string;
  id: string;
}

export interface DomMeta {
  tagName: string; // 标签
  index: number; // 标签索引值
  offset: number; // 文本的偏移量
}

/**
 * 如果startIndex数值与endIndex不相等，说明该条划线是跨段落的划线
 *
 * 标签 + 标签索引值，用于定位 段落
 */
export interface DomSource {
  startDomMeta: DomMeta; // 划线的起始段落
  endDomMeta: DomMeta; // 划线的结束段落
  className: string; // 节点 className
  tagName: string; // 节点 包裹标签类型 默认 i
  id: string; // 
  bookId: string; //
  text: string; // 选中的文本内容
  createTime: number; // 创建时间 (时间戳)
  pageNumber: number; //
  notes: Notes; // 笔记
}


export interface SelectNode {
  node: Node
}

export interface WrapNode {
  select: SelectNode;
  id: string;
  className: string;
  tagName: string
}

export type Handler = (data: DOMRect, source: DomSource) => void;