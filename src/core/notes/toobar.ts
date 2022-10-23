import { editIdea } from "@/components/toolbar/idea";
import {
  resetToolBar,
  toolBar,
  toolBarStyle,
} from "@/components/toolbar/toolbar";
import { DATA_SOURCE_ID, NOTES_ID } from "@/constants";
import { DomSource } from "@/interfaces";
import { getDomSource } from "@/store";
import { getTextWidth, hasHighlight, hasNotes, isObjEqual } from "@/utils";
import { toRaw } from "vue";

import {
  getDomContianer,
  getMeteDom,
  getPaintSource,
  initDomSource,
} from "../toolbar";
import { getDomContent } from "../toolbar/dom";
import { DomRange } from "../toolbar/selection";
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

function reductToolBar(
  event: Event,
  node: HTMLElement,
  attr: string,
  isEdit: boolean
) {
  if (node.hasAttribute(attr)) {
    event.stopPropagation();
    const id = node.getAttribute(attr)!;
    const source = getDomSource(id);
    source && showToolBar(source, isEdit);
  }
}

function editeToolBar(event: Event, node: HTMLElement) {
  if (hasHighlight(node)) {
    event.stopPropagation();
    const id = node.getAttribute(DATA_SOURCE_ID)!;
    const source = getDomSource(id);
    source && showToolBar(source, true);
  }
}

function editIdeaBar(event: Event, node: HTMLElement) {
  if (hasNotes(node)) {
    event.stopPropagation();
    const id = node.getAttribute(NOTES_ID)!;
    const source = getDomSource(id);
    source && editIdea(source);
  }
}

export function openTooBar(event: Event) {
  const domRange = new DomRange();
  const range = domRange.getDomRange();
  resetToolBar();
  if (range) {
    // 新增
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
    // 编辑高亮
    editeToolBar(event, node);
    // 编辑笔记
    editIdeaBar(event, node);
  }
}

export function closeTooBar() {
  if (toolBar.source && toolBar.show) {
    resetToolBar();
  }
}
