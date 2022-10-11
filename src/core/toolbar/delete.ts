import { getDomContent } from "./dom";
import { PaintSource } from "./type";

function removeWrap(parent: HTMLElement) {
  const content = getDomContent(parent);
  parent.innerHTML = "";
  parent.innerText = content;
}

function removeSamePaint(dom: HTMLElement) {
  removeWrap(dom);
}

function removeSpacePaint({ startDom, endDom }: PaintSource) {
  let current = startDom as HTMLElement;
  while (current) {
    removeWrap(current);
    if (current === endDom) break;
    current = current.nextSibling as HTMLElement;
  }
}

export function removePaint(source: PaintSource) {
  const { startDom, endDom } = source;
  if (startDom === endDom) {
    removeSamePaint(startDom as HTMLElement);
  } else {
    removeSpacePaint(source);
  }
}
