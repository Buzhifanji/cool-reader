import { toRaw } from "vue";
import { updateHighlights } from "../../components/highlight/highlight";
import {
  resetToolBar,
  toolBar,
  toolBarStyle,
} from "../../components/toolbar/toolbar";
import { removeHighlight } from "../service/highlight";
import { getDomSource, getReadingBook, removeDomSource } from "../store";
import {
  deleteDomSource,
  getDomContianer,
  getMeteDom,
  getPaintSource,
  initDomSource,
} from "../toolbar";
import { getDomContent } from "../toolbar/dom";
import { DomRange } from "../toolbar/selection";
import { DomSource } from "../toolbar/type";
import { DATA_SOURCE_ID } from "../utils/constant";
import { isObjEqual } from "../utils/is";
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
function setToolBarData(source: DomSource, isEdit: boolean) {
  toolBar.id = source.id;
  toolBar.show = true;
  toolBar.edit = isEdit;
  toolBar.source = source;
}

function showToolBar(source: DomSource, isEdit: boolean) {
  setToolBarPosition(source);
  setToolBarData(source, isEdit);
}

function editeToolBar(node: HTMLElement) {
  const id = node.getAttribute(DATA_SOURCE_ID)!;
  const source = getDomSource(id);
  if (source) {
    showToolBar(source, true);
  }
}

export function openTooBar(event: Event) {
  const domRange = new DomRange();
  const range = domRange.getDomRange();
  if (range) {
    const source = initDomSource(range);
    if (
      source &&
      !isObjEqual<DomSource>(toRaw<DomSource>(toolBar.source!), source)
    ) {
      event.stopPropagation();
      showToolBar(source, false);
    }
  } else {
    const node = event.target as HTMLElement;
    if (node.hasAttribute(DATA_SOURCE_ID)) {
      event.stopPropagation();
      editeToolBar(node);
    }
  }
}

export function closeTooBar() {
  if (toolBar.source && toolBar.show) {
    resetToolBar();
  }
}

export function useRemoveHighlight(id: string, isTip = true) {
  const readingBook = getReadingBook();
  const source = getDomSource(id);
  if (source) {
    // 清楚缓存
    deleteDomSource(source);
    // 清楚 ui
    removeDomSource(id);
    // 清楚数据库
    removeHighlight(readingBook.id, id, isTip).then(() => {
      updateHighlights();
    });
    resetToolBar();
  }
}
