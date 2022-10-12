import { getDomSource } from "../store/dom-source";
import { Intervals } from "../type";
import {
  DATA_SOURCE_ID,
  DEFAULT_DOM_CLASS_NAME,
  WARP_TAG_NAME,
} from "../utils/constant";
import { createEle } from "../utils/dom";
import { mergeIntervals } from "../utils/union";
import { getDomContent, getOldElement, hasPaint } from "./dom";
import { getTextOffset } from "./offset";
import { DomSource, PaintSource } from "./type";

function createWrapper(text: string, id: string) {
  const className = getDomSource(id)?.className || DEFAULT_DOM_CLASS_NAME;
  const textNode = document.createTextNode(text);
  const wrapper = createEle(WARP_TAG_NAME);
  wrapper.setAttribute("class", className);
  wrapper.setAttribute(DATA_SOURCE_ID, id);
  wrapper.appendChild(textNode);
  return wrapper;
}

function getPaintRange(nodes: HTMLElement): [number, number][] {
  const paintedRange: [number, number][] = [];
  nodes.childNodes.forEach((node) => {
    const offset = getTextOffset(nodes, node);
    if (node instanceof HTMLElement && node.hasAttribute(DATA_SOURCE_ID)) {
      paintedRange.push([offset, offset + node.innerText.length]);
    }
  });
  return paintedRange;
}

function paintRangeText(
  list: Intervals[],
  id: string,
  content: string,
  oldEL: Map<string, HTMLElement>
) {
  const fragment = document.createDocumentFragment();

  // 用标签包裹笔记内容
  const paintWrap = (start: number, end: number) => {
    const text = content.substring(start, end);
    const wrapper = oldEL.get(text) || createWrapper(text, id);
    fragment.appendChild(wrapper);
  };

  // 不是笔记的文本内容
  const paintText = (start: number, end: number) => {
    const text = content.substring(start, end);
    const textNode = document.createTextNode(text);
    fragment.appendChild(textNode);
  };

  let postion = 0;
  const n = content.length;
  for (let i = 0; i < list.length; i++) {
    const [start, end] = list[i];
    if (start > postion) {
      // 文本节点
      paintText(postion, start);
    }
    paintWrap(start, end);
    postion = end;
    if (list[i + 1]) {
      // 有下一个包裹节点
      postion = list[i + 1][0];
      paintText(end, postion);
    } else if (postion < n) {
      // 没有的话 直接绘制剩余的文本节点
      paintText(end, n);
    }
  }

  return fragment;
}

function paintAction(
  parent: HTMLElement, // 父节点
  start: number, // 开始偏移量
  end: number, // 结束偏移量
  id: string,
  content: string // 父节点下的整个文本内容
) {
  if (content.length) {
    const paintedRange = getPaintRange(parent);
    const result = mergeIntervals(paintedRange, [start, end]);
    const oldEl = getOldElement(parent, content);
    const wrapper = paintRangeText(result, id, content, oldEl);
    parent.innerHTML = "";
    parent.appendChild(wrapper);
  }
}

// 相同节点
function paintSameElement(paintSource: PaintSource, domSource: DomSource) {
  const node = paintSource.startDom as HTMLElement;
  const content = getDomContent(node);
  if (hasPaint(node)) {
    return false;
  } else {
    const { startMeta, endMeta, id } = domSource;
    paintAction(node, startMeta.textOffset, endMeta.textOffset, content, id);
    return true;
  }
}

function isSpaceElementPaint(
  startNode: HTMLElement,
  endNode: HTMLElement
): boolean {
  let current = startNode;
  let result = true;
  while (current) {
    // 过滤换行节点
    if (current.tagName.toLowerCase() !== "br") {
      if (hasPaint(current)) {
        result = true;
      } else {
        result = false;
        break;
      }
    }
    if (current === endNode) {
      break;
    }
    current = current.nextSibling as HTMLElement;
  }
  return result;
}

// 有间隔的节点
function paintSpaceElments(paintSource: PaintSource, domSource: DomSource) {
  const startDom = paintSource.startDom as HTMLElement;
  const endDom = paintSource.endDom as HTMLElement;

  // 判断是否做过笔记
  const isPaint = isSpaceElementPaint(startDom, endDom);
  if (!isPaint) {
    const { startMeta, endMeta, id } = domSource;
    const start = startMeta.textOffset;
    const end = endMeta.textOffset;
    let current = startDom;
    while (current) {
      const content = getDomContent(current);
      const n = content.length;
      if (current === startDom) {
        paintAction(current, start, n - start + 1, id, content);
      } else if (current === endDom) {
        paintAction(current, 0, end, id, content);
        break;
      } else {
        paintAction(current, 0, n, id, content);
      }
      current = current.nextSibling as HTMLElement;
    }
    return true;
  }
  return false;
}

export function paintWrap(paintSource: PaintSource, domSource: DomSource) {
  if (paintSource.startDom === paintSource.endDom) {
    return paintSameElement(paintSource, domSource);
  } else {
    return paintSpaceElments(paintSource, domSource);
  }
}
