import { DATA_SOURCE_ID } from "@/constants";
import { DomMeta, DomSource } from "@/interfaces";
import { isElementNode, isTextNode, selectorAll } from "@/utils";
import { getTextOffset } from "./offset";

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

function getOrinalParent(node: HTMLElement): HTMLElement {
  if (isElementNode(node)) {
    if (node.hasAttribute(DATA_SOURCE_ID)) {
      return node.parentElement!;
    } else {
      return node;
    }
  } else {
    return node.parentElement!;
  }
}

export function setMeteDom(
  contianer: HTMLElement,
  tagetDom: Node,
  textOffset: number
): DomMeta {
  const tagetDomParent = getOrinalParent(tagetDom.parentElement!);
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
    if (isElementNode(node as HTMLElement)) {
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
    isElementNode(node.firstChild! as HTMLElement)
  );
}

export function getMeteDom(
  source: DomSource,
  key: "startMeta" | "endMeta",
  contianer: HTMLElement
) {
  const { parentTagName, parentIndex } = source[key];
  return selectorAll(parentTagName, contianer)[parentIndex];
}
