import { toolBar, toolBarStyle } from "../../components/toolbar/toolbar";
import { deleteDomSource, getDomContianer, getMeteDom } from "../toolbar";
import { DomRange } from "../toolbar/selection";
import { initDomSource } from "../toolbar/source";
import { DomSource } from "../toolbar/type";
import { getPosition } from "./postion";

// 设置 工具栏 定位信息
function setToolBarPosition(source: DomSource) {
  const container = getDomContianer();
  if (container) {
    const startDom = getMeteDom(source, "startMeta", container);
    const { top, left } = getPosition(startDom);
    toolBarStyle.left = `${left + source.startMeta.textOffset}px`;
    toolBarStyle.top = `${top - 61}px`;
  }
}

// 工具栏绑定数据
function setToolBarData(source: DomSource) {
  toolBar.id = source.id;
  toolBar.show = true;
  toolBar.save = false;
  toolBar.source = source;
}

export function openTooBar(event: Event) {
  const domRange = new DomRange();
  const range = domRange.getDomRange();
  if (range) {
    const source = initDomSource(range);
    if (source) {
      event.stopPropagation();
      setToolBarPosition(source);
      setToolBarData(source);
    }
  }
}

export function closeTooBar() {
  if (!toolBar.save && toolBar.source && toolBar.show) {
    deleteDomSource(toolBar.source);
    toolBar.show = false;
  }
}
