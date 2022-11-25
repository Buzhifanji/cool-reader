// 详情查看：https://developer.mozilla.org/zh-CN/docs/Web/API/Window/getSelection

import { contextTpe } from "./interface";

export class RangeContext {
  public _range: Range | null = null
  constructor(private context: contextTpe = window) { }

  getRange(): Range | null {
    const selection = this.getSelection();
    if (selection && !selection.isCollapsed) {
      this._range = selection.getRangeAt(0)
      return this._range;
    }
    return null;
  }

  removeAllRanges() {
    const selection = this.getSelection();
    if (selection && selection.rangeCount > 0) {
      selection.removeAllRanges();
    }
  }

  private getSelection() {
    return this.context.getSelection()
  }
}
