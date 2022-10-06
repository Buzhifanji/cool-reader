import { Rendition } from "epubjs";
import { PDFViewer } from "pdfjs-dist/web/pdf_viewer";
import Highlighter from "web-highlighter";
import HighlightSource from "web-highlighter/dist/model/source";
import { CreateFrom } from "web-highlighter/dist/types";
import { highlights } from "../../components/highlight/highlight";
import { controlNodesSection } from "../../components/reader/notes";
import { toolBar, toolBarStyle } from "../../components/tool-bar/tool-bar";
import { getHighlights, saveHighlight } from "../service/highlight";
import { ExtnameFn, StorageBook } from "../type";
import { Bookextname } from "../utils/enums";
import { getReaderToolRoot } from "./document";
import { getPosition } from "./postion";
import { Context } from "./type";

let highlighter: Highlighter | null = null;
let book: StorageBook | null = null;
let context: Context = null;

export function openReaderTool(doc?: Document) {
  const docum = doc ? doc : window;
  const selection = docum.getSelection();
  if (selection) {
    if (selection?.isCollapsed) {
      return;
    } else {
      closeReanderTool();
      // 激活 创建工具栏
      highlighter?.fromRange(selection.getRangeAt(0));
      docum.getSelection()!.removeAllRanges();
    }
  }
}

export function closeReanderTool() {
  toolBar.show = false;
  if (!toolBar.save && highlighter) {
    // 删除没有保存的数据
    // highlighter.removeClass("highlight-mengshou-wrap", toolBar.id);
    highlighter.remove(toolBar.id);
  }
}

function initHighlighter() {
  const $root = getReaderToolRoot(book!);
  if ($root) {
    highlighter = new Highlighter({
      $root,
      exceptSelectors: [".tool-bar-wrapper", "pre", "code"],
    });
    // 高亮区域被创建
    highlighter.on(Highlighter.event.CREATE, createHighlight);
    // // 点击高亮区域
    // highlighter.on(Highlighter.event.CLICK, clickHighlight);
    // // 鼠标移至高亮区域
    // highlighter.on(Highlighter.event.HOVER, hoverHighlight);
    // // 鼠标移出高亮区域
    // highlighter.on(Highlighter.event.HOVER_OUT, hoverOutHighlight);
    // // 高亮区域被清除
    // highlighter.on(Highlighter.event.REMOVE, removeHighlight);
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

// epub.js 渲染文本采用了 iframe，原本监听的事件无效。所以需要重新处理事件
function epubEvent(rendition: Rendition) {
  rendition.on("click", () => {
    // 关闭笔记栏
    controlNodesSection(false);
    const $root = getReaderToolRoot(book!);
    if ($root) {
      openReaderTool($root as Document);
    }
  });
}

function pdfEvent(pdfViewer: PDFViewer) {
  pdfViewer.eventBus.on("pagechanging", (value: any) => {
    console.log("pagechanging", value);
    console.log(pdfViewer!.currentPageNumber);
  });
}

export function useReaderTool(_book: StorageBook, _context: Context) {
  book = _book;
  context = _context;
  initHighlighter();

  // 处理不同格式数据的 监听事件
  if (context) {
    const contextEventStatus: ExtnameFn = {
      [Bookextname.pdf]: pdfEvent,
      [Bookextname.epub]: epubEvent,
    };
    contextEventStatus[book.extname]?.(context);
  }

  getHighlights(book!.id).then((value) => (highlights.value = value));
}

export function useReaderToolBar() {
  // 获取 当前笔记所在页数
  const pageNoStatus: ExtnameFn = {
    [Bookextname.pdf]: () => (context as PDFViewer).currentPageNumber,
    [Bookextname.epub]: () => 1,
  };
  function save(
    { startMeta, endMeta, text, id }: HighlightSource,
    className: string
  ) {
    highlighter!.setOption({ style: { className } });
    toolBar.show = false;
    toolBar.save = true;
    const pageNumber = pageNoStatus[book!.extname]?.() || 1;

    const param = {
      startMeta,
      endMeta,
      text,
      id,
      bookId: book!.id,
      className,
      pageNumber,
    };
    saveHighlight(param);
  }
  // 高亮
  function addTextHighlight() {
    save(toolBar.source!, "c-text-highlight");
  }
  // 添加波浪线
  function addTilde() {
    save(toolBar.source!, "c-tilde");
  }
  // 添加直线
  function addStraightLine() {
    save(toolBar.source!, "c-straight-line");
  }
  return { addTextHighlight, addTilde, addStraightLine };
}
