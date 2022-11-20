import { DomSource, WebHighlight, WebHighlightOptions } from "src/core/web-highlight";
import { Bookextname } from "src/enums";
import { getPDFPageSelector, selector } from "src/utils";
import { getReadingBook } from "./book";

let webHighlight: WebHighlight | null = null;

function getBookRoot(pageNumber: number) {
  const readingBook = getReadingBook();
  switch (readingBook.extname) {
    case Bookextname.pdf:
      const selctor = getPDFPageSelector(pageNumber);
      return selector(selctor);
    case Bookextname.epub:

    default:
      return document;
  }
}


export function initWebHighlight(option: WebHighlightOptions) {
  webHighlight = new WebHighlight(option);
}

export function getWebHighlight(): WebHighlight {
  return webHighlight;
}

export function removeWebHighlight(id: string) {
  return webHighlight.removeDom(id)
}

// 如果是 书本， 则需要更新 root 
function updateOptionRoot(pageNumber, isBook: boolean) {
  if (isBook) {
    const root = getBookRoot(pageNumber)
    webHighlight.setOption({ root })
  }
}
export function paintHighlightFromSource(domSource: DomSource[] | DomSource, isBook = true) {
  if (webHighlight) {
    const pageNumber = Array.isArray(domSource) ? domSource[0].pageNumber : domSource.pageNumber;
    updateOptionRoot(pageNumber, isBook)
    webHighlight.source(domSource)
  }
}

export function paintHighlightFromRange({ id, className, pageNumber }: DomSource, isBook = true) {
  updateOptionRoot(pageNumber, isBook)
  webHighlight.paint(id, className)
}

export function paintHighlight(domSource: DomSource[] | DomSource) {
  if (webHighlight) {
    webHighlight.source(domSource)
  }
}