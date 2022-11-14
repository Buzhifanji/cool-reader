import { ROOT_INDEX, UNKNOWN_INDEX } from "./constant";
import { DomMeta, rootType } from "./interface";
import { getTextPreOffset } from "./offset";
import { isHeightWrap } from "./util";

function queryDomIndex(node: HTMLElement, root: rootType) {
  const nodeList = root.getElementsByTagName(node.tagName);

  for (let i = 0; i < nodeList.length; i++) {
    if (node === nodeList[i]) {
      return i;
    }
  }

  return UNKNOWN_INDEX
}

export function getDomByTagNameIndex({ tagName, index }: DomMeta, root: rootType) {
  if (index === ROOT_INDEX) {
    return root as HTMLElement
  } else if (index === UNKNOWN_INDEX) {
    throw new Error(`cann't find element by 【 tagName: ${tagName} 】 and  【 index: ${index} 】`)
  } else {
    return root.getElementsByTagName(tagName)[index] as HTMLElement
  }
}

/**
 * 获取划词最近的一个父节点。
 * @param node
 * @returns
 */
function getOrinalParent(node: HTMLElement): HTMLElement {
  if (node instanceof HTMLElement && !isHeightWrap(node)) {
    return node;
  }

  let parent = node.parentNode as HTMLElement;

  while (isHeightWrap(parent)) {
    parent = parent.parentNode as HTMLElement;
  }

  return parent;
}

export function getDomMeta(node: HTMLElement, offset: number, root: rootType): DomMeta {
  const orinalParent = getOrinalParent(node)
  const preOffset = getTextPreOffset(orinalParent, node);
  const index = orinalParent === root ? ROOT_INDEX : queryDomIndex(orinalParent, root);

  return { tagName: orinalParent.tagName, index, offset: preOffset + offset }
}
