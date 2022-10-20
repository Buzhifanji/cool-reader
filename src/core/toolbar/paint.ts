import {
  DATA_SOURCE_ID,
  DEFAULT_DOM_CLASS_NAME,
  HIGHLIGHT_STRAIGHT_CLASS_NAME,
  HIGHLIGHT_TIIDE_CLASS_NAME,
  NOTES_ID,
  NOTES_LINE_CLASS_NAME,
  WARP_TAG_NAME,
} from "@/constants";
import { DomSource, PaintSource } from "@/interfaces";
import {
  createEle,
  hasHighlight,
  hasNotes,
  isElementNode,
  isNotes,
  mergeIntervals,
} from "@/utils";
import { getDomContent, getOldElement, HanderEleAttr, hasPaint } from "./dom";
import { getTextOffset } from "./offset";

class Paint {
  private startDom: HTMLElement;
  private endDom: HTMLElement;
  constructor(private paintSource: PaintSource, private domSource: DomSource) {
    this.startDom = paintSource.startDom as HTMLElement;
    this.endDom = paintSource.endDom as HTMLElement;
  }
  action() {
    const { startDom, endDom } = this;
    if (startDom === endDom) {
      return this.paintSameElement();
    } else {
      return this.paintSpaceElments();
    }
  }
  // 相同节点
  private paintSameElement() {
    const { startDom } = this;
    const content = getDomContent(startDom);
    if (hasPaint(startDom)) {
      return { result: false, deleteIds: [] };
    } else {
      const { startMeta, endMeta, id, className } = this.domSource;
      const deleteIds = new PaintDom(
        startDom,
        startMeta.textOffset,
        endMeta.textOffset,
        id,
        content,
        className
      ).action();
      return { result: true, deleteIds };
    }
  }
  private isSpaceElementPaint() {
    const { startDom, endDom } = this;
    let current = startDom;
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
      if (current === endDom) {
        break;
      }
      current = current.nextSibling as HTMLElement;
    }
    return result;
  }
  // 有间隔的节点
  private paintSpaceElments() {
    let deleteIds: string[] = [];
    if (!this.isSpaceElementPaint()) {
      const { startMeta, endMeta, id, className } = this.domSource;
      const { startDom, endDom } = this;
      const start = startMeta.textOffset;
      const end = endMeta.textOffset;
      let current = startDom;

      while (current) {
        const content = getDomContent(current);
        const n = content.length;
        if (current === startDom) {
          const ids = new PaintDom(
            current,
            start,
            n - start + 1,
            id,
            content,
            className
          ).action();
          deleteIds = deleteIds.concat(ids);
        } else if (current === endDom) {
          const ids = new PaintDom(
            current,
            0,
            end,
            id,
            content,
            className
          ).action();
          deleteIds = deleteIds.concat(ids);
          break;
        } else {
          const ids = new PaintDom(
            current,
            0,
            n,
            id,
            content,
            className
          ).action();
          deleteIds = deleteIds.concat(ids);
        }
        current = current.nextSibling as HTMLElement;
      }
    }
    return { result: false, deleteIds };
  }
}

class PaintDom {
  constructor(
    private container: HTMLElement,
    private start: number,
    private end: number,
    private id: string,
    private content: string,
    private className: string
  ) {}
  action() {
    const oldIds = this.getDeleteIds();
    this.paint();
    const newIds = this.getDeleteIds();
    const result: string[] = [];
    oldIds.forEach((id) => {
      if (!newIds.has(id)) {
        result.push(id);
      }
    });
    return result;
  }
  private getDeleteIds(): Set<string> {
    const result: Set<string> = new Set();
    this.container.childNodes.forEach((child) => {
      const current = child as HTMLElement;
      // 只处理元素节点
      if (isElementNode(current)) {
        if (isNotes(this.className)) {
          if (hasNotes(current)) {
            result.add(current.getAttribute(NOTES_ID)!);
          }
        } else {
          if (hasHighlight(current)) {
            result.add(current.getAttribute(DATA_SOURCE_ID)!);
          }
        }
      }
    });
    return result;
  }
  private getPaintRange(): [number, number][] {
    const paintedRange: [number, number][] = [];
    this.container.childNodes.forEach((node) => {
      const offset = getTextOffset(this.container, node);
      if (
        node instanceof HTMLElement &&
        (hasNotes(node) || hasHighlight(node))
      ) {
        paintedRange.push([offset, offset + node.innerText.length]);
      }
    });
    return paintedRange;
  }
  private getText(start: number, end: number): string {
    return this.content.substring(start, end);
  }
  // 不是笔记的文本内容
  private paintText(start: number, end: number): Text {
    const text = this.getText(start, end);
    return document.createTextNode(text);
  }
  // 用标签包裹笔记内容
  private paintWrapper(start: number, end: number): HTMLElement {
    const text = this.getText(start, end);
    const { className, id } = this;
    const oldEl = getOldElement(this.container, this.content);
    if (oldEl.has(text)) {
      const el = oldEl.get(text)!;
      const handler = new HanderEleAttr(el);
      if (!handler.has(className)) {
        if (isNotes(className)) {
          if (!handler.has(NOTES_LINE_CLASS_NAME)) {
            handler.updateClass(`${handler.name()} ${className}`);
            handler.updateAttr(NOTES_ID, id);
          }
        } else {
          if (
            !(
              handler.has(DEFAULT_DOM_CLASS_NAME) ||
              handler.has(HIGHLIGHT_TIIDE_CLASS_NAME) ||
              handler.has(HIGHLIGHT_STRAIGHT_CLASS_NAME)
            )
          ) {
            handler.updateClass(`${handler.name()} ${className}`);
            handler.updateAttr(DATA_SOURCE_ID, id);
          }
        }
      }
      return el;
    } else {
      return this.createWrapper(text);
    }
  }
  private createWrapper(text: string): HTMLElement {
    const { className, id } = this;
    const textNode = document.createTextNode(text);
    const wrapper = createEle(WARP_TAG_NAME);
    const attrName = isNotes(className) ? NOTES_ID : DATA_SOURCE_ID;
    wrapper.setAttribute("class", className);
    wrapper.setAttribute(attrName, id);
    wrapper.appendChild(textNode);
    return wrapper;
  }
  private paint() {
    const paintedRange = this.getPaintRange();
    const intervals = mergeIntervals(paintedRange, [this.start, this.end]);

    const fragment = document.createDocumentFragment();
    const append = (node: HTMLElement | Text) => fragment.appendChild(node);

    const { content } = this;
    let postion = 0;
    const n = content.length;
    for (let i = 0; i < intervals.length; i++) {
      const [start, end] = intervals[i];
      if (start > postion) {
        // 文本节点
        append(this.paintText(postion, start));
      }
      append(this.paintWrapper(start, end));
      postion = end;
      if (intervals[i + 1]) {
        // 有下一个包裹节点
        postion = intervals[i + 1][0];
        append(this.paintText(end, postion));
      } else if (postion < n) {
        // 没有的话 直接绘制剩余的文本节点
        append(this.paintText(end, n));
      }
    }

    this.container.innerHTML = "";
    this.container.appendChild(fragment);
  }
}

export function paintWrap(paintSource: PaintSource, domSource: DomSource) {
  return new Paint(paintSource, domSource).action();
}
