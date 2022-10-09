import { getTextOffset } from "./offset";
import { DomMeta } from "./type";

// 查找 子元素所在位置
function queryChildDomIndex(
  container: HTMLElement,
  taget: HTMLElement
): number {
  let result = -1;
  container.childNodes.forEach((node, index) => {
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
  parentElement: HTMLElement,
  contianer: Node,
  textOffset: number
): DomMeta {
  const contianerParent = getOrinalParent(
    parentElement,
    contianer.parentElement!
  );
  const preNodeOffset = getTextOffset(contianerParent, contianer);
  return {
    parentTagName: contianerParent.tagName,
    parentIndex: queryChildDomIndex(parentElement, contianerParent),
    textOffset: preNodeOffset + textOffset,
  };
}
