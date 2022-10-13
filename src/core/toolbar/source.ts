import { getDomContianer, getPageNumber } from ".";
import { getReadingBook, removeDomSource, saveDomSource } from "../store";
import { DATA_SOURCE_ID, DEFAULT_DOM_CLASS_NAME } from "../utils/constant";
import { selectorAll } from "../utils/dom";
import { stringTohash } from "../utils/union";
import { removePaint } from "./delete";
import { getMeteDom, setMeteDom } from "./dom";
import { paintWrap } from "./paint";
import { DomSource, PaintSource } from "./type";

export function initDomSource(range: Range): DomSource | null {
  const contianer = getDomContianer();
  if (contianer) {
    const {
      startContainer: startDom,
      endContainer: endDom,
      startOffset,
      endOffset,
    } = range;

    const text = range.toString();
    const id = stringTohash(text);

    return {
      id,
      text,
      startMeta: setMeteDom(contianer, startDom, startOffset),
      endMeta: setMeteDom(contianer, endDom, endOffset),
      pageNumber: getPageNumber(),
      bookId: getReadingBook().id,
      className: DEFAULT_DOM_CLASS_NAME,
    };
  }
  return null;
}

// 从 Range 对象中 创建 高亮笔记
export function domSourceFromRange(source: DomSource) {
  return paintSourceAction(source);
}

// 从 存储 数据中还原 高亮笔记
export function domSourceFromStore(source: DomSource | DomSource[]) {
  if (Array.isArray(source)) {
    source.forEach((item) => {
      domSourceFromStore(item);
    });
  } else {
    paintSourceAction(source);
  }
}

export function deleteDomSource(source: DomSource) {
  const paintSource = getPaintSource(source);
  if (paintSource) {
    removePaint(paintSource);
  }
}

export function updateDomSource(source: DomSource, className: string) {
  const paintSource = getPaintSource(source);
  if (paintSource) {
    const nodes = selectorAll(
      `.${className}[${DATA_SOURCE_ID}=${source.id}]`,
      paintSource.parentDom
    );
    nodes.forEach((node) => {
      node.className = source.className;
    });
  }
}

export function getPaintSource(source: DomSource): PaintSource | null {
  const contianer = getDomContianer();
  let result: PaintSource | null = null;
  if (contianer) {
    const startDom = getMeteDom(source, "startMeta", contianer);
    const endDom = getMeteDom(source, "endMeta", contianer);
    result = { parentDom: contianer, startDom, endDom, id: source.id };
  }
  return result;
}

function paintSourceAction(source: DomSource) {
  const paintSource = getPaintSource(source);
  if (paintSource && paintSource.startDom && paintSource.endDom) {
    const result = paintWrap(paintSource, source);
    if (result.result) {
      saveDomSource(source);
    } else {
      removeDomSource(source.id);
    }
    return result;
  }
  return { result: false, deleteIds: [] };
}
