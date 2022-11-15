import { DATA_WEB_HIGHLIGHT, DATA_WEB_HIGHLIGHT_TYPE, getDefaultOptions } from "./constant";
import { getDomByTagNameIndex } from "./dom";
import { ClassName, DomSource, EleOrText, rootType, SelectNode, SelectTextNode, WebHighlightOptions, WrapNode } from "./interface";
import { getTextNodeByOffset } from "./offset";
import { isHeightWrap, isNodeEmpty, isTextNode } from "./util";

function initNodeStack(start: SelectTextNode, end: SelectTextNode) {
  const startParent = start.parent;
  const endParent = end.parent;

  const result = [startParent];
  if (startParent === endParent) {
    return result
  } else {
    // 跨段落
    let current = startParent;
    while (current !== endParent) {
      current = startParent.nextSibling as HTMLElement;
      result.unshift(current)
    }
    return result
  }
}

function paintSameTextNode(text: Text, startOffset: number, endOffset: number): SelectNode[] {
  text.splitText(startOffset);

  const node = text.nextSibling as Text;

  node.splitText(endOffset - startOffset)

  return [{ node, splitType: 'both' }]
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

        selectTextNodes.push({ node, splitType: 'head' })
      }
    } else if (currentNode === endNode) { // 结束节点
      if (isTextNode(currentNode)) {
        const node = currentNode as Text;

        node.splitText(endOffset)
        selectTextNodes.push({ node, splitType: 'tail' })
      }
    } else if (isBetween && isTextNode(currentNode)) { // 中间节点
      selectTextNodes.push({ node: currentNode as Text, splitType: 'none' })
    }
  }
  return selectTextNodes
}


function paintSelectedNode(nodes: SelectNode[], id: string) {

}

function addClassName(el: HTMLElement, className: ClassName) {
  const classNames = Array.isArray(className) ? className : [className]
  // classNames = classNames.length === 0 ? [getDefaultOptions().className as string] : classNames;
  classNames.forEach(item => {
    el.classList.add(item)
  })
  return el
}

function getUpperLevelDom(node: Node) {
  const parent = node.parentNode as HTMLElement;
  const prev = node.previousSibling as Node;
  const next = node.nextSibling as Node;
  return { parent, prev, next }
}

function createEleByTagName(tagName: string, id: string, type: string, className: ClassName) {
  const wrap = document.createElement(tagName)
  wrap.setAttribute(DATA_WEB_HIGHLIGHT, id)
  wrap.setAttribute(DATA_WEB_HIGHLIGHT_TYPE, type)

  addClassName(wrap, className)

  return wrap
}

function getNodeAttr(node: HTMLElement) {
  const id = node.getAttribute(DATA_WEB_HIGHLIGHT)
  const classes = node.getAttribute(DATA_WEB_HIGHLIGHT)
  const type = node.getAttribute(DATA_WEB_HIGHLIGHT_TYPE)

  return { id, classes, type }
}

/**
 * 创建一个新的
 */
function createWrap({ select, id, className, tagName }: WrapNode) {
  const { splitType, node } = select

  const wrap = createEleByTagName(tagName, id, splitType, className)

  wrap.appendChild(node.cloneNode(false))
  node.parentNode?.replaceChild(wrap, node)

  return wrap
}

function spliteWrap({ select, id, className, tagName }: WrapNode) {
  const { node, splitType } = select;
  const fragment = document.createDocumentFragment();

  const { parent, prev, next } = getUpperLevelDom(node)

  const wrap = createEleByTagName(tagName, id, splitType, className)

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
  const parent = select.node.parentNode as HTMLElement;
  const wrap = parent;

  // remove className
  wrap.className = ''
  // update className
  addClassName(wrap, className)

  // const oldId = wrap.getAttribute(DATA_WEB_HIGHLIGHT)
  wrap.setAttribute(DATA_WEB_HIGHLIGHT, id)

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
    result = updateWrapAttr(wrapNode)
  }
  return result
}

export class Paint {
  constructor(public options: WebHighlightOptions) {
    if (!this.options.root) {
      this.options.root = document;
    }
  }

  updateOption(options: WebHighlightOptions) {
    Object.assign(this.options, options)
  }

  paintDom(domSource: DomSource) {
    const { start, end } = this._getDomNode(domSource);
    const selectNodes = getAllSelectDom(start, end, this.options.root!);

    const defaultOption = getDefaultOptions();
    let { className, tagName } = this.options
    className = className || defaultOption.className;
    tagName = tagName || defaultOption.tagName;

    selectNodes.map(select => {
      const wrapNode: WrapNode = {
        select,
        id: domSource.id,
        className: className as string,
        tagName: tagName as string
      }
      paintWrap(wrapNode)
    })
  }


  removePaintedDom({ startDomMeta, endDomMeta, id, createTime, notes }: DomSource) {

  }

  private _getDomNode({ startDomMeta, endDomMeta }: DomSource) {
    const { root } = this.options;
    const startOffset = startDomMeta.offset;
    const endOffset = endDomMeta.offset;

    const startDom = getDomByTagNameIndex(startDomMeta, root!);
    const endDom = getDomByTagNameIndex(endDomMeta, root!);

    const startTextNode = getTextNodeByOffset(startDom, startOffset)
    const endTextNode = getTextNodeByOffset(endDom, endOffset)

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