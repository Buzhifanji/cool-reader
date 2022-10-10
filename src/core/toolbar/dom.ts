import { selectorAll } from "../utils/dom";
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
