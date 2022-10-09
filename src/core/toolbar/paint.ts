import { getDomSource } from "../store/dom-source";
import { DATA_SOURCE_ID } from "../utils/constant";
import { createEle } from "../utils/dom";
import { isTextNode } from "../utils/is";
import { getOrinalParent } from "./dom";
import { getTextOffset, getTextOffsetById } from "./offset";
import { Intervals, PaintSource } from "./type";

function createWrapper(text: string, id: string) {
  const className = getDomSource(id)?.className || "wrapper_source";
  const textNode = document.createTextNode(text);
  const wrapper = createEle("i");
  wrapper.setAttribute("class", className);
  wrapper.setAttribute(DATA_SOURCE_ID, id);
  wrapper.appendChild(textNode);
  return wrapper;
}

function generateDom(source: PaintSource) {
  const { startDom, endDom, parentDom, id } = source;
  const startParent = getOrinalParent(parentDom, startDom.parentElement!); // 开始文本父节点
  const endParent = getOrinalParent(parentDom, endDom.parentElement!); // 结束文本父节点
  return { id, startParent, endParent };
}

function getDomContent(nodes: HTMLElement): string {
  let content = "";
  nodes.childNodes.forEach((node) => {
    if (node instanceof HTMLElement && node.hasAttribute(DATA_SOURCE_ID)) {
      content += node.innerText;
    } else if (isTextNode(node as Text)) {
      content += (node as Text).textContent!;
    }
  });
  return content;
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

// 合并区间
function mergeIntervals(list: Intervals[], newList: Intervals): Intervals[] {
  const intervals = [...list, newList].sort((a, b) => a[0] - b[0]); // 排序从小到大;

  if (intervals.length < 2) {
    return intervals;
  }

  let current = intervals[0];

  const result: Intervals[] = [];

  for (let interval of intervals) {
    if (current[1] >= interval[0]) {
      // 重叠 更新 右边界
      current[1] = Math.max(current[1], interval[1]);
    } else {
      result.push(current);
      current = interval;
    }
  }

  result.push(current);

  return result;
}

function paintRangeText(list: Intervals[], id: string, content: string) {
  const fragment = document.createDocumentFragment();

  // 用标签包裹笔记内容
  const paintWrap = (start: number, end: number) => {
    const text = content.substring(start, end);
    const wrapper = createWrapper(text, id);
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
    const wrapper = paintRangeText(result, id, content);
    parent.innerHTML = "";
    parent.appendChild(wrapper);
  }
}

// 相同节点
function paintSameElement(source: PaintSource) {
  const { id, startParent } = generateDom(source);
  const offset = getTextOffsetById(id);
  if (offset) {
    const content = getDomContent(startParent);
    paintAction(startParent, offset.start, offset.end, id, content);
  }
}

// 有间隔的节点
function paintSpaceElments(source: PaintSource) {
  const { startParent, endParent, id } = generateDom(source);
  const offset = getTextOffsetById(id);
  if (offset) {
    const { start, end } = offset;
    let current = startParent;
    while (current) {
      const content = getDomContent(current);
      const n = content.length;
      if (current === startParent) {
        paintAction(current, start, n - start, id, content);
      } else if (current === endParent) {
        paintAction(current, 0, end, id, content);
        break;
      } else {
        paintAction(current, 0, n, id, content);
      }
      current = current.nextSibling as HTMLElement;
    }
  }
}

export function paintWrap(source: PaintSource) {
  const { startParent, endParent } = generateDom(source);
  if (startParent === endParent) {
    paintSameElement(source);
  } else {
    paintSpaceElments(source);
  }
}
