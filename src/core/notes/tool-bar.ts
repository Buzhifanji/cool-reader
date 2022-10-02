import { createEle, getEleById } from "../utils/utils";

export function createNoteToolBar(top: number, left: number, id: string) {
  const tag = createEle("div");
  tag.style.left = `${left - 20}px`;
  tag.style.top = `${top - 25}px`;
  tag.dataset["id"] = id;
  tag.textContent = "delete";
  tag.classList.add("my-remove-tip");
  const container = getEleById("viewerContainer")!;
  container.appendChild(tag);
}

export function getPosition(node: HTMLElement) {
  let offset = { top: 0, left: 0 };
  while (node) {
    offset.top += node.offsetTop;
    offset.left += node.offsetLeft;
    node = node.offsetParent as HTMLElement;
    if (node.id === "viewerContainer") {
      break;
    }
  }
  return offset;
}
