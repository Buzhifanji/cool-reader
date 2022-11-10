import { NIcon } from "naive-ui";

export function createEle(tagName: string) {
  return document.createElement(tagName);
}

export function getEleById(id: string) {
  return document.getElementById(id);
}

export function selectorAll(selectors: string, doc?: HTMLElement) {
  const $root = doc || document;
  return $root.querySelectorAll<HTMLElement>(selectors);
}

export function selector(selector: string, doc?: HTMLElement) {
  const $root = doc || document;
  return $root.querySelector<HTMLElement>(selector);
}

export const renderIcon = (icon: Component) => () =>
  h(NIcon, null, { default: () => h(icon) });

export const getPDFPageSelector = (pageNumber: number) =>
  `div.page[data-page-number="${pageNumber}"] .textLayer`;
