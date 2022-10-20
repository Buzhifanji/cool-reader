import {
  DATA_SOURCE_ID,
  NOTES_ID,
  NOTES_LINE_CLASS_NAME,
  WARP_TAG_NAME,
} from "@/constants";
import { DomSource, Intervals, PaintSource } from "@/interfaces";
import {
  createEle,
  hasHighlight,
  hasNotes,
  isElementNode,
  isNotes,
  mergeIntervals,
} from "@/utils";
import {
  getDomContent,
  getOldElement,
  HanderEleClassName,
  hasPaint,
} from "./dom";
import { getTextOffset } from "./offset";

function createWrapper(text: string, id: string, className: string) {
  const textNode = document.createTextNode(text);
  const wrapper = createEle(WARP_TAG_NAME);
  wrapper.setAttribute("class", className);
  let attrName = isNotes(className) ? NOTES_ID : DATA_SOURCE_ID;
  wrapper.setAttribute(attrName, id);
  wrapper.appendChild(textNode);
  return wrapper;
}

function getPaintRange(nodes: HTMLElement): [number, number][] {
  const paintedRange: [number, number][] = [];
  nodes.childNodes.forEach((node) => {
    const offset = getTextOffset(nodes, node);
    if (node instanceof HTMLElement && (hasNotes(node) || hasHighlight(node))) {
      paintedRange.push([offset, offset + node.innerText.length]);
    }
  });
  return paintedRange;
}

function paintRangeText(
  list: Intervals[],
  id: string,
  content: string,
  oldEL: Map<string, HTMLElement>,
  className: string
) {
  const fragment = document.createDocumentFragment();

  // 用标签包裹笔记内容
  const paintWrap = (start: number, end: number) => {
    const text = content.substring(start, end);
    if (oldEL.has(text)) {
      const el = oldEL.get(text)!;
      const handler = new HanderEleClassName(el);
      if (handler.has(className)) {
        fragment.appendChild(el);
      } else {
        if (isNotes(className) || handler.has(NOTES_LINE_CLASS_NAME)) {
          handler.update(`${NOTES_LINE_CLASS_NAME} ${className}`);
          fragment.appendChild(el);
        } else {
          fragment.appendChild(el);
        }
      }
    } else {
      fragment.appendChild(createWrapper(text, id, className));
    }
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
  content: string, // 父节点下的整个文本内容,
  className: string
) {
  if (content.length) {
    const deleteIds = getDeleteWrapper(parent);
    const paintedRange = getPaintRange(parent);
    const result = mergeIntervals(paintedRange, [start, end]);
    const oldEl = getOldElement(parent, content);
    const wrapper = paintRangeText(result, id, content, oldEl, className);
    parent.innerHTML = "";
    parent.appendChild(wrapper);
    console.log(parent);
    return deleteIds;
  }
  return [];
}

function getDeleteWrapper(node: HTMLElement) {
  const result: string[] = []; // 被覆盖的 data-source-id
  node.childNodes.forEach((child) => {
    const current = child as HTMLElement;
    if (isElementNode(current) && current.hasAttribute(DATA_SOURCE_ID)) {
      result.push(current.getAttribute(DATA_SOURCE_ID)!);
    }
  });
  return result;
}

// 相同节点
function paintSameElement(paintSource: PaintSource, domSource: DomSource) {
  const node = paintSource.startDom as HTMLElement;
  const content = getDomContent(node);
  if (hasPaint(node)) {
    return { result: false, deleteIds: [] };
  } else {
    const { startMeta, endMeta, id, className } = domSource;
    const deleteIds = paintAction(
      node,
      startMeta.textOffset,
      endMeta.textOffset,
      id,
      content,
      className
    );
    return { result: true, deleteIds };
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
  let deleteIds: string[] = [];
  // 判断是否做过笔记
  const isPaint = isSpaceElementPaint(startDom, endDom);
  if (!isPaint) {
    const { startMeta, endMeta, id, className } = domSource;
    const start = startMeta.textOffset;
    const end = endMeta.textOffset;
    let current = startDom;
    while (current) {
      const content = getDomContent(current);
      const n = content.length;
      if (current === startDom) {
        const ids = paintAction(
          current,
          start,
          n - start + 1,
          id,
          content,
          className
        );
        deleteIds = deleteIds.concat(ids);
      } else if (current === endDom) {
        const ids = paintAction(current, 0, end, id, content, className);
        deleteIds = deleteIds.concat(ids);
        break;
      } else {
        const ids = paintAction(current, 0, n, id, content, className);
        deleteIds = deleteIds.concat(ids);
      }
      current = current.nextSibling as HTMLElement;
    }
    return { result: true, deleteIds };
  }
  return { result: false, deleteIds };
}

export function paintWrap(paintSource: PaintSource, domSource: DomSource) {
  debugger;
  if (paintSource.startDom === paintSource.endDom) {
    return paintSameElement(paintSource, domSource);
  } else {
    return paintSpaceElments(paintSource, domSource);
  }
}
