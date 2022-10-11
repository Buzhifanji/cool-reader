import { getDomContianer, getPageNumber } from ".";
import { getReadingBook } from "../store";
import {
  hasDomSource,
  removeDomSource,
  saveDomSource,
} from "../store/dom-source";
import { DEFAULT_DOM_CLASS_NAME } from "../utils/constant";
import { selectorAll } from "../utils/dom";
import { DomSourceType } from "../utils/enums";
import { stringTohash } from "../utils/union";
import { removePaint } from "./delete";
import { getDomMeta } from "./dom";
import { paintWrap } from "./paint";
import { DomSource, PaintSource } from "./type";

// 从 Range 对象中 创建 高亮笔记
export function domSourceFromRange(range: Range) {
  const contianer = getDomContianer();
  if (contianer) {
    const {
      startContainer: startDom,
      endContainer: endDom,
      startOffset,
      endOffset,
    } = range;
    const startMeta = getDomMeta(contianer, startDom, startOffset);
    const endMeta = getDomMeta(contianer, endDom, endOffset);

    const text = range.toString();

    const id = stringTohash(text);
    const source: DomSource = {
      id,
      text,
      startMeta,
      endMeta,
      pageNumber: getPageNumber(),
      bookId: getReadingBook().id,
      className: DEFAULT_DOM_CLASS_NAME,
    };
    if (!hasDomSource(id)) {
      saveDomSource(source);
      paintWrap(
        { parentDom: contianer, startDom, endDom, id },
        DomSourceType.range
      );
      return source;
    }
  }
  return null;
}

// 从 存储 数据中还原 高亮笔记
export function domSourceFromStore(source: DomSource | DomSource[]) {
  if (Array.isArray(source)) {
    source.forEach((item) => {
      domSourceFromStore(item);
    });
  } else {
    const paintSource = getPaintSource(source);
    if (paintSource && paintSource.startDom && paintSource.endDom) {
      saveDomSource(source);
      paintWrap(paintSource, DomSourceType.store);
    } else {
      console.log("还原", paintSource);
    }
  }
}

export function deleteDomSource(source: DomSource) {
  const paintSource = getPaintSource(source);
  if (paintSource) {
    removeDomSource(source.id);
    removePaint(paintSource);
  }
}

function getPaintSource(source: DomSource): PaintSource | null {
  const contianer = getDomContianer();
  let result: PaintSource | null = null;
  if (contianer) {
    const {
      startMeta: { parentIndex: startIndex, parentTagName: startTagName },
      endMeta: { parentIndex: endIndex, parentTagName: endTagName },
      id,
    } = source;

    const startDom = selectorAll(startTagName, contianer)[startIndex];
    const endDom = selectorAll(endTagName, contianer)[endIndex];
    result = { parentDom: contianer, startDom, endDom, id };
  }
  return result;
}
