import { toolBar, toolBarStyle } from "../../components/tool-bar/tool-bar";
import { getDomSource } from "../store/dom-source";
import {
  deleteDomSource,
  domSourceFromRange,
  getDomContianer,
} from "../toolbar";
import { DomRange } from "../toolbar/selection";
import { DomSource } from "../toolbar/type";
import { DATA_SOURCE_ID, DEFAULT_DOM_CLASS_NAME } from "../utils/constant";
import { selector } from "../utils/dom";
import { getPosition } from "./postion";

// 设置 工具栏 定位信息
function setToolBarPosition(id: string) {
  const container = getDomContianer();
  if (container) {
    const target = selector(
      `.${DEFAULT_DOM_CLASS_NAME}[${DATA_SOURCE_ID}=${id}]`,
      container
    )!;
    const textOffset = getDomSource(id)!.startMeta.textOffset;
    const { top, left } = getPosition(target);
    toolBarStyle.left = `${left + textOffset}px`;
    toolBarStyle.top = `${top - 61}px`;
  }
}

// 工具栏绑定数据
function setToolBarData(data: DomSource) {
  toolBar.id = data.id;
  toolBar.show = true;
  toolBar.save = false;
  toolBar.source = data;
}

function toolBarAction(data: DomSource) {
  return new Promise(() => {
    setToolBarPosition(data.id);
    setToolBarData(data);
  });
}

export function openTooBar() {
  const domRange = new DomRange();
  const range = domRange.getDomRange();
  if (range) {
    const source = domSourceFromRange(range);
    if (source) {
      toolBarAction(source);
    }
  }
}

export function closeTooBar() {
  if (!toolBar.save && toolBar.source && toolBar.show) {
    deleteDomSource(toolBar.source);
    toolBar.show = false;
  }
}
