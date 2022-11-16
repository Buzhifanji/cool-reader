/**
 * web-highlight
 * 高亮 划词 笔记
 */

import { getDomMeta } from "./dom";
import { contextTpe, DomSource, rootType, WebHighlightOptions } from "./interface";
import { Paint } from "./paint";
import { getRange } from "./range";
import { Store } from "./store";
import createUUID from "./uuid";

export class WebHighlight extends Paint {

  private _store: Store = new Store();

  private _root: rootType = document.documentElement;

  constructor(options: WebHighlightOptions, private context?: contextTpe) {
    super(options)

    if (options.root) {
      this._root = options.root;
    }
  }
  /**
   * 更新配置参数，对于动态DOM，需要及时更新变化的配置参数，比如 root 根节点
   */
  setOption(options: WebHighlightOptions) {
    super.updateOption(options);
  }
  /**
   * 监听  window.getSelection() 事件，获取 Range 对象
   */
  range() {
    const { _root } = this

    const range = getRange(this.context);
    if (!range) return null;

    const { startContainer, startOffset, endContainer, endOffset } = range;

    const startDomMeta = getDomMeta(startContainer as HTMLElement, startOffset, _root)
    const endDomMeta = getDomMeta(endContainer as HTMLElement, endOffset, _root)

    const createTime = new Date().valueOf();

    const id = createUUID();

    const source = { startDomMeta, endDomMeta, createTime, id }

    return this._store.save(source)
  }
  /**
   * 已经有了DomSource数据，比如从数据库获取，这个时候还原绘制的DOm。
   */
  source(source: DomSource | DomSource[]) {
    const ids = this._store.save(source)

    if (Array.isArray(ids)) {
      this._praint(ids)
    } else {
      this.paint(ids)
    }
  }

  /**
   * 绘制 划线 高亮
   */
  paint(id: string) {
    const domSource = this._store.get(id);
    if (!domSource) return;

    this.paintDom(domSource)
  }
  getSource(id: string) {
    return this._store.get(id);
  }
  /**
   * 移除 _store 里存储的数据，（此时并不会删除绘制的划线 高亮）
   */
  removeSource(id: string) {
    this._store.remove(id);
  }

  /**
   * 删除绘制的划线 高亮
   */
  removeDom(id: string) {
    const domSource = this._store.get(id);
    if (!domSource) return;

    this.removePaintedDom(domSource)
  }

  /**
   * 绘制多条数据
   */
  private _praint(ids: string[]) {
    ids.forEach(id => this.paint(id))
  }
}
