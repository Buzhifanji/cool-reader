import { DATA_WEB_HIGHLIGHT, DATA_WEB_HIGHLIGHT_EXTRA, ID_DIVIDION } from "./constant";
import { getDomByTagNameIndex } from "./dom";
import { DomSource, EleOrText, rootType, SelectNode, SelectTextNode, WebHighlightOptions, WrapNode } from "./interface";
import { getTextNodeByOffset } from "./offset";
import { isBr, isElementNode, isHeightWrap, isNodeEmpty, isTextNode } from "./util";

function initNodeStack(start: SelectTextNode, end: SelectTextNode) {
  const startParent = start.parent;
  const endParent = end.parent;

  const result = [startParent];

  let current = startParent;
  while (current !== endParent) {
    // 跨段落
    current = current.nextSibling as HTMLElement;

    if (isElementNode(current)) {
      if (isBr(current)) {
        continue
      }
      result.unshift(current)
    }
  }
  return result
}

function paintSameTextNode(text: Text, startOffset: number, endOffset: number): SelectNode[] {
  text.splitText(startOffset);

  const node = text.nextSibling as Text;

  node.splitText(endOffset - startOffset)

  return [{ node }]
}

/**
 * https://developer.mozilla.org/zh-CN/docs/Web/API/Text/splitText
 * 
 * 从开始到结束节点直接的所有Node节点
 */
function getAllSelectDom(start: SelectTextNode, end: SelectTextNode, root: rootType): SelectNode[] {
  const { node: startNode, offset: startOffset } = start;
  const { node: endNode, offset: endOffset } = end;

  if (startNode === endNode && isTextNode(startNode)) {
    return paintSameTextNode(startNode as Text, startOffset, endOffset)
  }

  const nodeStack: (EleOrText)[] = initNodeStack(start, end);

  const selectTextNodes: SelectNode[] = [];

  let currentNode: EleOrText | undefined = undefined;

  let isBetween: boolean = false;

  while (currentNode = nodeStack.pop()) {

    const children = currentNode.childNodes;

    for (let i = children.length - 1; i >= 0; i--) {
      nodeStack.push(children[i] as unknown as EleOrText)
    }

    if (currentNode === startNode) { // 开始节点
      if (isTextNode(currentNode)) { // 只收集文本节点
        (currentNode as Text).splitText(startOffset)

        const node = currentNode.nextSibling as Text;

        isBetween = true;

        selectTextNodes.push({ node })
      }
    } else if (currentNode === endNode) { // 结束节点
      if (isTextNode(currentNode)) {
        const node = currentNode as Text;

        node.splitText(endOffset)
        selectTextNodes.push({ node })
      }

      break
    } else if (isBetween && isTextNode(currentNode)) { // 中间节点
      selectTextNodes.push({ node: currentNode as Text })
    }
  }
  return selectTextNodes
}


function getUpperLevelDom(node: Node) {
  const parent = node.parentNode as HTMLElement;
  const prev = node.previousSibling as Node;
  const next = node.nextSibling as Node;
  return { parent, prev, next }
}

function createEleByTagName(tagName: string, id: string, className: string, extraInfo?: string | null) {
  const wrap = document.createElement(tagName)
  wrap.setAttribute(DATA_WEB_HIGHLIGHT, id)

  if (extraInfo) {
    wrap.setAttribute(DATA_WEB_HIGHLIGHT_EXTRA, extraInfo)
  }

  wrap.classList.add(className)

  return wrap
}

function getNodeExtraId(node: HTMLElement) {
  const id = node.getAttribute(DATA_WEB_HIGHLIGHT)
  const extraId = node.getAttribute(DATA_WEB_HIGHLIGHT_EXTRA)
  return extraId ? extraId + ID_DIVIDION + id : id;
}


/**
 * 创建一个新的
 */
function createWrap({ select, id, className, tagName }: WrapNode) {
  const { node } = select

  const wrap = createEleByTagName(tagName, id, className)

  wrap.appendChild(node.cloneNode(false))
  node.parentNode?.replaceChild(wrap, node)

  return wrap
}

/**
 * 在已经是高亮的基础上进行切割
 */
function spliteWrap({ select, id, className, tagName }: WrapNode) {
  const { node } = select;
  const fragment = document.createDocumentFragment();

  const { parent, prev, next } = getUpperLevelDom(node)

  const extraInfo = getNodeExtraId(parent)

  const wrap = createEleByTagName(tagName, id, className, extraInfo)

  wrap.appendChild(node.cloneNode(false))

  const cloneNode = (node: Node) => {
    if (node) {
      const span = parent.cloneNode(false)

      span.textContent = node.textContent;
      fragment.appendChild(span)
    }
  }

  // prev
  cloneNode(prev);

  fragment.appendChild(wrap)

  // next 
  cloneNode(next);

  parent.parentNode?.replaceChild(fragment, parent)

  return wrap
}

function updateWrapAttr({ select, id, className }: WrapNode) {
  const wrap = select.node.parentNode as HTMLElement;

  // remove className
  wrap.className = ''
  // update className
  wrap.classList.add(className)

  const extraId = getNodeExtraId(wrap)
  wrap.setAttribute(DATA_WEB_HIGHLIGHT, id)
  wrap.setAttribute(DATA_WEB_HIGHLIGHT_EXTRA, extraId)

  return wrap
}

function paintWrap(wrapNode: WrapNode) {
  const { parent, prev, next } = getUpperLevelDom(wrapNode.select.node)

  let result: HTMLElement;

  if (!isHeightWrap(parent)) {
    // 新建 wrap
    result = createWrap(wrapNode)
  } else if (isHeightWrap(parent) && (!isNodeEmpty(prev) || !isNodeEmpty(next))) {
    result = spliteWrap(wrapNode)
  } else {
    // 覆盖上一个 wrap
    result = updateWrapAttr(wrapNode)
  }

  // 规划化 DOM，因为 Text.splitText() 的时，如果指定的偏移量刚好等于原文本节点所包含字符串的长度，则返回一个内容为空的文本节点。
  // 调用 normalize 会删除这些空的文本节点
  result.normalize();

  return result
}

export class Paint {
  constructor(public options: WebHighlightOptions) {
  }
  /**
  * 更新配置参数，对于动态DOM，需要及时更新变化的配置参数，比如 root 根节点
  */
  setOption(options: WebHighlightOptions) {
    Object.assign(this.options, options)
  }

  paintDom(domSource: DomSource) {
    const { start, end } = this._getDomNode(domSource);
    const root = this.getRoot();
    const selectNodes = getAllSelectDom(start, end, root);

    const { id, className, tagName } = domSource

    selectNodes.map(select => {
      const wrapNode: WrapNode = { select, id, className, tagName }
      paintWrap(wrapNode)
    })

    selectNodes.length = 0;
  }

  removePaintedDom({ startDomMeta, endDomMeta, id, createTime, notes, tagName }: DomSource) {
    const root = this.getRoot();
    const selctor = `${tagName}[${DATA_WEB_HIGHLIGHT}='${id}']`
    const doms = root.querySelectorAll<HTMLElement>(selctor);

    const toRemove: HTMLElement[] = []
    const toUpdate: HTMLElement[] = []

    doms.forEach(dom => {
      const extraId = dom.getAttribute(DATA_WEB_HIGHLIGHT_EXTRA)
      extraId ? toUpdate.push(dom) : toRemove.push(dom)
    })

    toRemove.forEach(node => {
      const parent = node.parentNode;
      const fragment = document.createDocumentFragment();

      node.childNodes.forEach(child => fragment.appendChild(child.cloneNode(false)))

      parent.replaceChild(fragment, node)
    })

    toUpdate.forEach(node => {
      const ids = node.getAttribute(DATA_WEB_HIGHLIGHT_EXTRA).split(ID_DIVIDION)
      const newId = ids.pop()

      node.setAttribute(DATA_WEB_HIGHLIGHT, newId)

      if (ids.length) {
        node.setAttribute(DATA_WEB_HIGHLIGHT_EXTRA, ids.join(ID_DIVIDION))
      }
    })
  }

  getRoot(): rootType {
    const root = this.options.root
    return root ? root : document.documentElement
  }

  private _getDomNode({ startDomMeta, endDomMeta }: DomSource) {
    const root = this.getRoot();
    const startOffset = startDomMeta.offset;
    const endOffset = endDomMeta.offset;

    const startDom = getDomByTagNameIndex(startDomMeta, root!);
    const endDom = getDomByTagNameIndex(endDomMeta, root!);

    const startTextNode = getTextNodeByOffset(startDom, startOffset)
    const endTextNode = getTextNodeByOffset(endDom, endOffset, false)

    const start: SelectTextNode = {
      parent: startDom,
      parentOffset: startOffset,
      ...startTextNode,
    }
    const end: SelectTextNode = {
      parent: endDom,
      parentOffset: endOffset,
      ...endTextNode
    }

    return { start, end }
  }
}