import { isTextNode } from "src/utils";

// 获取 相对于父元素的文本偏移量
export function getTextOffset(root: Node, text: Node) {
  const nodeStack: Node[] = [root];

  let curNode: Node | string | undefined = undefined;
  let offset = 0;
  let count = 0;

  while ((curNode = nodeStack.pop())) {
    count += 1;
    const children = curNode.childNodes;

    for (let i = children.length - 1; i >= 0; i--) {
      nodeStack.push(children[i]);
    }
    if (curNode === text) {
      break;
    } else if (isTextNode(curNode as Text)) {
      offset += curNode.textContent!.length;
    }

    // 防止死递归
    if (count === 200) {
      break;
    }
  }

  return offset;
}
