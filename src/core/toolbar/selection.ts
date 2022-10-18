/**
 * record log
 *<span role="presentation">对
  <span class="wrapper_source" data-source-id="081ebfd0af664b32b0bed26d9a9eb266">任何</span>
  专业技术人员来说，理解数据结构都非常重要。作为软件开发者，我们要能够借助编
  </span>

  对于 这样的结构 通过selection.getRangeAt(0) 获取的range中的text 存在问题；而换成 i 标签就没有问题

  <span role="presentation" dir="ltr">对
  <i class="wrapper_source" data-source-id="081ebfd0af664b32b0bed26d9a9eb266">任何</i>
  专业技术人员来说，理解数据结构都非常重要。作为软件开发者，我们要能够借助编
  </span>

 */

let _range: Range | null = null;

export class DomRange {
  private _root: Document | Window = window;
  static getRange() {
    return this;
  }
  constructor(private $root?: Document) {
    if ($root) {
      this._root = $root;
    }
  }
  getDomRange(): Range | null {
    const selection = this._root.getSelection();
    if (selection) {
      if (selection.isCollapsed) {
        return null;
      } else {
        _range = selection.getRangeAt(0);
        return _range;
      }
    } else {
      return null;
    }
  }
  removeAllDomRange() {
    this._root.getSelection()?.removeAllRanges();
  }
}

// 还原 range
export function reductRange() {
  const selection = window.getSelection();
  if (_range && selection) {
    selection.removeAllRanges();
    selection.addRange(_range);
  }
}

// 释放 range
export function detachRange() {
  if (_range) {
    _range.detach();
  }
}
