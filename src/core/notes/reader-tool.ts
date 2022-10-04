import { invoke } from "@tauri-apps/api";
import { Rendition } from "epubjs";
import Highlighter from "web-highlighter";
import HighlightSource from "web-highlighter/dist/model/source";
import { CreateFrom } from "web-highlighter/dist/types";
import { highlights } from "../../components/highlight/highlight";
import { controlNodesSection } from "../../components/reader/notes";
import { toolBar, toolBarStyle } from "../../components/tool-bar/tool-bar";
import { message } from "../../naive";
import { StorageBook } from "../type";
import { generateServiceParams } from "../utils/change-name";
import { getEleById } from "../utils/utils";
import { getReaderToolRoot } from "./document";
import { HData, HEvent, highlightParam, highlightResponse } from "./type";

let highlighter: Highlighter | null = null;
let book: StorageBook | null = null;

function createReaderTool() {
  const $root = getReaderToolRoot(book!);
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
export function addReaderTool(doc?: Document) {
  const docum = doc ? doc : window;
  const selection = docum.getSelection();
  if (selection) {
    if (selection?.isCollapsed) {
      return;
    } else {
      deleteReaderTool();
      // 激活 创建工具栏
      highlighter?.fromRange(selection.getRangeAt(0));
      docum.getSelection()!.removeAllRanges();
    }
  }
}

export const useReaderTool = (
  _book: StorageBook,
  context: Rendition | null
) => {
  book = _book;
  createReaderTool();
  function addEvents() {
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

    // epub.js 渲染文本采用了 iframe，原本监听的事件无效。所以需要重新处理事件
    if (context) {
      const rendition = context;
      rendition.on("click", () => {
        // 关闭笔记栏
        controlNodesSection(false);
        const $root = getReaderToolRoot(book!);
        if ($root) {
          addReaderTool($root as Document);
        }
      });
    }
  }

  function createHighlight(
    data: { sources: HighlightSource[]; type: CreateFrom },
    h: Highlighter
  ) {
    const { sources, type } = data;
    // 当渲染文本 容器是 iframe的时候，页面发生了变化，比如进行了翻页操作，此时iframe里面的节点数据发生了变化，所以需要重置
    h.setOption({ $root: getReaderToolRoot(book!)! });
    sources.forEach((source) => {
      setToolBarPosition(h.getDoms(source.id)[0]);
      if (type === "from-input") {
        setToolBarData(source);
      }
    });
    console.log(data);
  }

  function clickrHighlight(data: HData, h: Highlighter, e: HEvent) {
    console.log(data);
    toolBar.id = data.id;
  }

  function hoverHighlight(data: HData, h: Highlighter, e: HEvent) {}

  function hoverOutHighlight(data: HData, h: Highlighter, e: HEvent) {}

  function removeHighlight(
    data: {
      ids: string[];
    },
    h: Highlighter
  ) {}
  addEvents();
  getHighlights();
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
    saveHighlight(toolBar.source!, "c-text-highlight");
  }
  // 添加波浪线
  function addTilde() {
    saveHighlight(toolBar.source!, "c-tilde");
  }
  // 添加直线
  function addStraightLine() {
    saveHighlight(toolBar.source!, "c-straight-line");
  }
  return { addTextHighlight, addTilde, addStraightLine };
}
// 保存到数据库
function saveHighlight(source: HighlightSource, className: string) {
  const { startMeta, endMeta, text, id } = source;

  highlighter!.setOption({ style: { className } });
  highlighter!.fromStore(startMeta, endMeta, text, id);
  toolBar.show = false;
  toolBar.save = true;
  const param = Object.assign(source, { bookId: book!.id, className });
  const data = generateServiceParams<highlightParam, highlightResponse>(param);
  invoke("add_highlight", { data })
    .then((value) => {
      message.success("添加成功");
      // getHighlights();
    })
    .catch((err) => {
      message.error(err);
    });
}

// 从数据库获取之前保存好的数据
function getHighlights() {
  invoke("get_highlightes", { bookId: book!.id })
    .then((value) => {
      const list = (value as highlightResponse[]).map((item) =>
        generateServiceParams<highlightResponse, highlightParam>(item, false)
      );
      highlights.value = [...list];
      list.forEach(({ startMeta, endMeta, id, text }) =>
        highlighter!.fromStore(startMeta, endMeta, text, id)
      );
      console.log(list);
    })
    .catch((err) => {
      message.error(err);
    });
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
    if (node.tagName === "BODY") {
      const contianer = getEleById("viewer")!;
      node = contianer.getElementsByTagName("iframe")[0];
    }
  }
  return offset;
}
