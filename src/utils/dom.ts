import { NIcon } from "naive-ui";
import { Component } from "vue";

export function createEle<K extends keyof HTMLElementTagNameMap>(tagName: K): HTMLElementTagNameMap[K] {
  return document.createElement<K>(tagName);
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

/**
 * 由于DOMRect是只读，当需要对DOMRect进行修改的时候，需要把数据修改为可以读写
 * @param rect 
 * @returns 
 */
export const getRectDomData = (rect: DOMRect) => {
  const { width, height, x, y, bottom, left, top, right, toJSON } = rect
  return { width, height, x, y, bottom, left, top, right, toJSON }
}

export const concatRectDom = (react1: DOMRect, react2?: DOMRect) => {
  const rect = getRectDomData(react1)

  if (react2) {
    rect.top += react2.top
    rect.left += (react2.left - 10)
  }

  return rect
}