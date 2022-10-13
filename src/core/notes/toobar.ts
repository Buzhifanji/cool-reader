import { toolBar, toolBarStyle } from "../../components/toolbar/toolbar";
import {
  getDomContianer,
  getMeteDom,
  getPaintSource,
  initDomSource,
} from "../toolbar";
import { getDomContent } from "../toolbar/dom";
import { DomRange } from "../toolbar/selection";
import { DomSource } from "../toolbar/type";
import { getTextWidth } from "../utils/text";
import { getPosition } from "./postion";

function calculateTextWidth(node: HTMLElement, source: DomSource) {
  const paintSource = getPaintSource(source);
  let result = 0;
  if (paintSource) {
    const allText = getDomContent(node);
    const index = source.startMeta.textOffset;
    if (paintSource.startDom === paintSource.endDom) {
      result = getTextWidth(node, source.text) / 2;
      if (index > 0) {
        const preText = allText.substring(0, index);
        result = getTextWidth(node, preText) + result;
      }
    } else {
      if (index > 0) {
        const preText = allText.substring(0, index);
        const text = allText.substring(index + 1, allText.length);
        result = getTextWidth(node, preText) + getTextWidth(node, text) / 2;
      } else {
        result = getTextWidth(node, allText) / 2;
      }
    }
  }
  return result;
}

// 设置 工具栏 定位信息
function setToolBarPosition(source: DomSource) {
  const container = getDomContianer();
  if (container) {
    const startDom = getMeteDom(source, "startMeta", container);
    const width = calculateTextWidth(startDom, source);
    const { top, left } = getPosition(startDom);
    toolBarStyle.left = `${left + width}px`;
    toolBarStyle.top = `${top - 68}px`;
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
    toolBar.show = false;
    toolBar.source = null;
  }
}
