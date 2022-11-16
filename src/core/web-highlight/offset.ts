import { DomNode } from "./interface";
import { isTextNode } from "./util";

const getTextLen = (node: Node) => node!.textContent!.length;

/**
 * 找到文本节点的相对源父节点 偏移量
 */
export function getTextPreOffset(orinalParent: Node, textNode: Node): number {
  const nodeStack: Node[] = [orinalParent]

  let currentNode: Node | undefined = undefined;
  let offset: number = 0;

  while ((currentNode = nodeStack.pop())) {

    const children = currentNode.childNodes
    for (let i = children.length - 1; i >= 0; i--) {
      nodeStack.push(children[i])
    }

    if (isTextNode(currentNode)) {
      if (currentNode === textNode) {
        break
      } else {
        offset += getTextLen(currentNode);
      }
    }
  }
  return offset
}

/**
 * 根据偏移量找到点击的文本节点
 */
export function getTextNodeByOffset(parent: HTMLElement, offset: number): DomNode {
  const nodeStack: Node[] = [parent]

  let currentNode: Node | undefined = undefined;
  let curOffset = 0;
  let startOffset = 0;

  while (currentNode = nodeStack.pop()) {

    const children = currentNode.childNodes
    for (let i = children.length - 1; i >= 0; i--) {
      nodeStack.push(children[i])
    }

    if (isTextNode(currentNode)) {
      startOffset = offset - curOffset;
      curOffset += getTextLen(currentNode)

      if (curOffset >= offset) {
        break;
      }
    }
  }

  if (!currentNode) {
    currentNode = parent
  }

  return {
    node: currentNode,
    offset: startOffset
  }
}