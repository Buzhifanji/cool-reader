import { VIEWER, VIEWERCONTAINER } from "src/constants";
import { getEleById } from "src/utils";

export function getPosition(node: HTMLElement) {
  let offset = { top: 0, left: 0 };
  while (node) {
    offset.top += node.offsetTop;
    offset.left += node.offsetLeft;
    node = node.offsetParent as HTMLElement;
    if (node.id === VIEWERCONTAINER) {
      break;
    }
    if (node.tagName === "BODY") {
      const contianer = getEleById(VIEWER)!;
      node = contianer.getElementsByTagName("iframe")[0];
    }
  }
  return offset;
}
