import { DomSource, WebHighlight, WebHighlightOptions } from "src/core/web-highlight";
import { Bookextname } from "src/enums";
import { NumberOrString } from "src/interfaces";
import { getEpubDoc, getPDFPageSelector, selector } from "src/utils";
import { getReadingBook } from "./book";

let webHighlight: WebHighlight | null = null;

function getBookRoot(pageNumber: NumberOrString) {
  const readingBook = getReadingBook();
  switch (readingBook.extname) {
    case Bookextname.pdf:
      const selctor = getPDFPageSelector(pageNumber as number);
      return selector(selctor);
    case Bookextname.epub:
      return getEpubDoc()
    default:
      return document;
  }
}



export function initWebHighlight(option: WebHighlightOptions) {
  webHighlight = new WebHighlight(option);
}

export function getWebHighlight(): WebHighlight {
  return webHighlight!;
}

// dom 和 store 缓存的数据 一并删除
export function removeWebHighlight(id: string) {
  removeWebHighlightDom(id)
  removeWebHighlightCache(id)
}

// 只删除dom
export function removeWebHighlightDom(id: string) {
  return webHighlight!.removeDom(id)
}

// 只删除 store 缓存的数据
export function removeWebHighlightCache(id: string) {
  return webHighlight!.removeSource(id)
}

// 如果是 书本， 则需要更新 root 
function updateOptionRoot(pageNumber: NumberOrString, isBook: boolean) {
  if (isBook) {
    const root = getBookRoot(pageNumber)
    updateWebHighlightOption({ root })
  }
}

export function updateWebHighlightOption(options: WebHighlightOptions) {
  webHighlight!.setOption(options)
}

export function paintWebHighlightFromSource(domSource: DomSource[] | DomSource, isBook = true) {
  if (webHighlight) {
    const pageNumber = Array.isArray(domSource) ? domSource[0].pageNumber : domSource.pageNumber;
    updateOptionRoot(pageNumber, isBook)
    webHighlight.fromSource(domSource)
  }
}

export function prevWebHighlight(pageNumber: NumberOrString, isBook = true, range?: Range) {
  updateOptionRoot(pageNumber, isBook)
  return webHighlight!.fromRange(range)
}

export function paintWebHighlightFromRange({ id, className, pageNumber }: DomSource, isBook = true) {
  updateOptionRoot(pageNumber, isBook)
  return webHighlight!.paint(id, className)
}

export function updateWebHighlight(domSource: DomSource, isBook = true) {
  updateOptionRoot(domSource.pageNumber, isBook)
  webHighlight!.updateClass(domSource)
}
