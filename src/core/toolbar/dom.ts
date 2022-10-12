import { DATA_SOURCE_ID } from "../utils/constant";
import { selectorAll } from "../utils/dom";
import { isTextNode } from "../utils/is";
import { getTextOffset } from "./offset";
import { DomMeta } from "./type";

function queryChildDomIndex(
  container: HTMLElement,
  taget: HTMLElement
): number {
  const nodes = selectorAll(taget.tagName, container);
  let result = -1;
  nodes.forEach((node, index) => {
    if (node === taget) {
      result = index;
    }
  });
  return result;
}

export function getOrinalParent(
  container: HTMLElement,
  tagetNode: HTMLElement
): HTMLElement {
  let result = container;
  let current: HTMLElement = tagetNode;
  while (current && current.parentElement) {
    if (current.parentElement === container) {
      result = current;
      break;
    }
    current = current.parentElement;
  }
  return result;
}

export function getDomMeta(
  contianer: HTMLElement,
  tagetDom: Node,
  textOffset: number
): DomMeta {
  const tagetDomParent = getOrinalParent(contianer, tagetDom.parentElement!);
  const preNodeOffset = getTextOffset(tagetDomParent, tagetDom);
  return {
    parentTagName: tagetDomParent.tagName,
    parentIndex: queryChildDomIndex(contianer, tagetDomParent),
    textOffset: preNodeOffset + textOffset,
  };
}

export function getDomContent(nodes: HTMLElement): string {
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

export function getOldElement(parent: HTMLElement, content: string) {
  const result = new Map<string, HTMLElement>();
  parent.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      if (el.hasAttribute(DATA_SOURCE_ID)) {
        const text = el.innerText;
        // 如果 text 与 content 相等，则代表着覆盖，需要更新 id
        if (text !== content) {
          result.set(text, el);
        }
      }
    }
  });
  return result;
}

// 判断某个节点是否全部做成了笔记内容
export function hasPaint(node: HTMLElement): boolean {
  return (
    node.childNodes.length === 1 &&
    node.firstChild!.nodeType === Node.ELEMENT_NODE
  );
}
