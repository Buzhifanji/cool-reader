import { DATA_WEB_HIGHLIGHT } from "./constant";

export const isTextNode = (node: Node): boolean =>
  node.nodeType === Node.TEXT_NODE;

export const isElementNode = (node: Node): boolean =>
  node.nodeType === Node.ELEMENT_NODE;

export const isHeightWrap = (node: HTMLElement): boolean => node.hasAttribute(DATA_WEB_HIGHLIGHT)

export const isNodeEmpty = (node: Node): boolean => !node || !node.textContent;