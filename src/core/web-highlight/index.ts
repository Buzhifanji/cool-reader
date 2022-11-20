/**
 * web-highlight
 * 高亮 划词 笔记
 */

import { EventBus, EventType } from "./eventBus";
import { DATA_WEB_HIGHLIGHT, getDefaultOptions } from "./constant";
import { getDomMeta } from "./dom";
import { contextTpe, DomSource, Handler, WebHighlightOptions } from "./interface";
import { Paint } from "./paint";
import { getRange } from "./range";
import { Store } from "./store";
import { isHeightWrap } from "./util";
import createUUID from "./uuid";

export { EventType, type DomSource, type WebHighlightOptions };

export class WebHighlight extends Paint {

  private _store: Store = new Store();

  private _bus: EventBus = new EventBus()

  private _range: Range | null = null;

  constructor(_config: WebHighlightOptions, private context?: contextTpe) {
    super(_config)
    this._initEvent();
  }
  /**
   * 监听  window.getSelection() 事件，获取 Range 对象
   */
  range() {
    this._range = getRange(this.context);
    return this._range
  }

  fromRange() {
    const range = this._range
    const root = this.getRoot()

    const { startContainer, startOffset, endContainer, endOffset } = range;

    const startDomMeta = getDomMeta(startContainer as HTMLElement, startOffset, root)
    const endDomMeta = getDomMeta(endContainer as HTMLElement, endOffset, root)

    const createTime = new Date().valueOf();

    const id = createUUID();

    const { className, tagName } = this._getClasAndTagName()

    const text = range.toString();

    const source: DomSource = { startDomMeta, endDomMeta, createTime, id, className, tagName, text, pageNumber: 0, bookId: '', notes: '' }

    const rect = range.getClientRects()[0] || range.getBoundingClientRect();

    this._store.save(source)

    return { source, rect }

  }
  /**
   * 已经有了DomSource数据，比如从数据库获取，这个时候还原绘制的DOm。
   */
  fromSource(source: DomSource | DomSource[]) {
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
  paint(id: string, className?: string) {
    const domSource = this._store.get(id);
    if (!domSource) return;

    if (className) { // 自定义 className
      domSource.className = className;
    }
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

  on(type: EventType, callback: Handler) {
    return this._bus.on(type, callback);
  }

  private _initEvent() {
    const root = this.getRoot()

    root.addEventListener(EventType.click, (e) => {
      const target = e.target as HTMLElement;

      if (isHeightWrap(target)) {
        const id = target.getAttribute(DATA_WEB_HIGHLIGHT)
        const source = this._store.get(id);
        const data = this._getBoundingClientRect(id);
        if (data) {
          this._bus.emit(EventType.click, data, source)
        }
      }
    })
  }

  /**
   * 绘制多条数据
   */
  private _praint(ids: string[]) {
    ids.forEach(id => this.paint(id))
  }


  private _getClasAndTagName() {
    const defaultOptions = getDefaultOptions();

    let { className, tagName } = this.options
    className = (className || defaultOptions.className) as string;
    tagName = tagName || defaultOptions.tagName

    return { className, tagName }
  }

  /**
   * 处理上下文，如果有 iframe，则需要在初始化的时候传入，默认是 document
   */
  private _handleContext(): Document {
    let context = this.context;
    if (context) {
      if (context === window) {
        context = window.document;
      }
    } else {
      context = document;
    }
    return context as Document
  }

  private _getBoundingClientRect(id: string) {
    const domSource = this._store.get(id)

    if (domSource) {
      const context = this._handleContext();
      const selector = `${domSource.tagName}[${DATA_WEB_HIGHLIGHT}='${id}']`
      const firstElement = context.querySelectorAll<HTMLElement>(selector)[0]

      return firstElement.getBoundingClientRect();
    } else {
      return null
    }
  }
}
