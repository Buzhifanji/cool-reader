import { invoke } from "@tauri-apps/api";
import Highlighter from "web-highlighter";
import HighlightSource from "web-highlighter/dist/model/source";
import { CreateFrom } from "web-highlighter/dist/types";
import { toolBar, toolBarStyle } from "../../components/tool-bar/tool-bar";
import { StorageBook } from "../type";
import { Bookextname } from "../utils/enums";
import { getEleById } from "../utils/utils";
import { HData, HEvent } from "./type";

let highlighter: Highlighter | null = null;

/**
 * 目的：为了获取解析电子的dom的根节点
 * 原因：不同格式电子书，使用的解析库 也不一样，例如有些嵌套了 iframe,获取dom组件需要特殊处理
 * @param book
 * @returns
 */
function getReaderToolRoot(book: StorageBook) {
  switch (book.extname) {
    case Bookextname.pdf:
      return getEleById("viewer")!;
    case Bookextname.epub:
      break;
  }
  return null;
}

function createReaderTool(book: StorageBook) {
  const $root = getReaderToolRoot(book);
  if ($root) {
    highlighter = new Highlighter({
      $root,
      exceptSelectors: [".tool-bar-wrapper", "pre", "code"],
    });
  }
}

/**
 * 监听鼠标选中的文字
 * @param event
 * @returns
 */
export function addReaderTool(event: Event) {
  const selection = window.getSelection();
  if (selection) {
    if (selection?.isCollapsed) {
      return;
    } else {
      deleteReaderTool();
      // 激活 创建工具栏
      highlighter?.fromRange(selection.getRangeAt(0));
      window.getSelection()!.removeAllRanges();
    }
  }
}

export const useReaderTool = (book: StorageBook) => {
  createReaderTool(book);
  function addhighlighterEvents() {
    if (highlighter) {
      // 点击高亮区域
      highlighter.on(Highlighter.event.CLICK, clickrHighlight);
      // 鼠标移至高亮区域
      highlighter.on(Highlighter.event.HOVER, hoverHighlight);
      // 鼠标移出高亮区域
      highlighter.on(Highlighter.event.HOVER_OUT, hoverOutHighlight);
      // 高亮区域被创建
      highlighter.on(Highlighter.event.CREATE, createHighlight);
      // 高亮区域被清除
      highlighter.on(Highlighter.event.REMOVE, removeHighlight);
    }
  }
  function getHighlights() {
    console.log("book.id", book.id);
    invoke("get_highlightes", { bookId: book.id })
      .then((value) => {
        debugger;
        console.log("value", value);
      })
      .catch((err) => {
        debugger;
        console.log("error", err);
      });
  }
  function createHighlight(
    data: { sources: HighlightSource[]; type: CreateFrom },
    h: Highlighter
  ) {
    const { sources, type } = data;
    sources.forEach((source) => {
      setToolBarPosition(h.getDoms(source.id)[0]);
      setToolBarData(source);
    });
    // if (sources.length) {
    //   invoke("add_highlight", { data: handleParams(sources[0], book.id) })
    //     .then((value) => {
    //       console.log("Highlight success", value);
    //     })
    //     .catch((err) => {
    //       console.log("Highlight err", err);
    //     });
    // }
    console.log(data);
  }

  function clickrHighlight(data: HData, h: Highlighter, e: HEvent) {}

  function hoverHighlight(data: HData, h: Highlighter, e: HEvent) {}

  function hoverOutHighlight(data: HData, h: Highlighter, e: HEvent) {}

  function removeHighlight(
    data: {
      ids: string[];
    },
    h: Highlighter
  ) {}
  addhighlighterEvents();
};

export function deleteReaderTool() {
  toolBar.show = false;
  if (!toolBar.save && highlighter) {
    // 删除没有保存的数据
    // highlighter.removeClass("highlight-mengshou-wrap", toolBar.id);
    highlighter.remove(toolBar.id);
  }
}

export function useReaderToolBar() {
  // 高亮
  function addTextHighlight() {
    const { startMeta, endMeta, id, text } = toolBar.source!;
    highlighter!.fromStore(startMeta, endMeta, text, id);
    toolBar.show = false;
    toolBar.save = true;
  }
  // 添加波浪线
  function addTilde() {}
  // 添加直线
  function addStraightLine() {}
  return { addTextHighlight, addTilde, addStraightLine };
}

function setToolBarPosition(node: HTMLElement) {
  const { top, left } = getPosition(node);
  toolBarStyle.left = `${left - 20}px`;
  toolBarStyle.top = `${top - 25}px`;
}

function setToolBarData(data: HighlightSource) {
  toolBar.id = data.id;
  toolBar.show = true;
  toolBar.source = data;
}

function getPosition(node: HTMLElement) {
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
