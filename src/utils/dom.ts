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

export const crateLink = (url: string) => {
  const link = createEle('link')
  link.rel = 'stylesheet';
  link.type = 'text/css'
  link.href = url
  return link
}