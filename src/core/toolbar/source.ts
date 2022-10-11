import { getDomContianer, getPageNumber } from ".";
import {
  hasDomSource,
  removeDomSource,
  saveDomSource,
} from "../store/dom-source";
import { selectorAll } from "../utils/dom";
import { stringTohash } from "../utils/union";
import { getDomMeta } from "./dom";
import { paintWrap, removePaint } from "./paint";
import { DomSource, PaintSource } from "./type";

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
      className: "wrapper_source",
    };
    if (!hasDomSource(id)) {
      saveDomSource(source);
      paintWrap({ parentDom: contianer, startDom, endDom, id });
      return source;
    }
  }
  return null;
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

export function domSourceFromStore(source: DomSource) {
  const paintSource = getPaintSource(source);
  if (paintSource && paintSource.startDom && paintSource.endDom) {
    saveDomSource(source);
    paintWrap(paintSource);
  }
}

export function deleteDomSource(source: DomSource) {
  const paintSource = getPaintSource(source);
  if (paintSource) {
    removeDomSource(source.id);
    removePaint(paintSource);
  }
}
