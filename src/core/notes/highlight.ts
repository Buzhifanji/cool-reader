import { invoke } from "@tauri-apps/api";
import Highlighter from "web-highlighter";
import HighlightSource from "web-highlighter/dist/model/source";
import { CreateFrom, DomMeta } from "web-highlighter/dist/types";
import { handleToolBar } from "../../components/tool-bar/tool-bar";
import { StorageBook } from "../../core/type";
import { Bookextname } from "../../core/utils/enums";
import { getEleById } from "../../core/utils/utils";
import { HData, HEvent } from "./type";

function getHighlightRoot(book: StorageBook) {
  switch (book.extname) {
    case Bookextname.pdf:
      return getEleById("viewer")!;
    case Bookextname.epub:
      break;
  }
  return null;
}

function createHighlighter(book: StorageBook) {
  let result: Highlighter | null = null;
  const $root = getHighlightRoot(book);
  if ($root) {
    result = new Highlighter({
      $root,
      exceptSelectors: [".tool-bar-wrapper", "pre", "code"],
    });
  }
  return result;
}

// 高亮
export const usehighlight = (book: StorageBook) => {
  const highlighter = createHighlighter(book);
  function watchSelection() {
    const selection = window.getSelection();
    if (selection) {
      if (selection?.isCollapsed) {
        return;
      } else {
        // 激活高亮
        highlighter?.fromRange(selection.getRangeAt(0));
        window.getSelection()!.removeAllRanges();
      }
    }
  }
  function highlighterEvents() {}
  function init() {
    let result: Highlighter | null = null;
    const $root = getHighlightRoot(book);
    if ($root) {
      const highlighter = new Highlighter({
        $root,
        exceptSelectors: ["pre", "code"],
      });
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
      highlighter.stop();
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
      const id = source.id;
      const node = h.getDoms(id)[0];
      handleToolBar(node, id);
      // const position = getPosition(node);
      // createNoteToolBar(position.top, position.left, id);
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

  init();
  // getHighlights();
};

function handleDomDataParam({
  parentTagName,
  parentIndex,
  textOffset,
}: DomMeta) {
  return {
    parent_tag_name: parentTagName,
    parent_index: parentIndex,
    text_offset: textOffset,
  };
}

function handleParams(source: HighlightSource, bookId: string) {
  const { id, text, startMeta, endMeta } = source;
  return {
    book_id: bookId,
    id,
    text,
    start_meta: handleDomDataParam(startMeta),
    end_meta: handleDomDataParam(endMeta),
  };
}
