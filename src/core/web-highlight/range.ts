// 详情查看：https://developer.mozilla.org/zh-CN/docs/Web/API/Window/getSelection

import { contextTpe } from "./interface";

export function getRange(root: contextTpe = window): Range | null {
  const selection = root.getSelection();
  if (selection && !selection.isCollapsed) {
    return selection.getRangeAt(0);
  }
  return null;
}

export function removeAllRanges(root: contextTpe = window) {
  root.getSelection()?.removeAllRanges();
}
