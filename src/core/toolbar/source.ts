import { hasDomSource, saveDomSource } from "../store/dom-source";
import { selectorAll } from "../utils/dom";
import { stringTohash } from "../utils/union";
import { getDomMeta } from "./dom";
import { paintWrap } from "./paint";
import { DomSource } from "./type";

export function domSourceFromRange(
  range: Range,
  contianer: HTMLElement,
  pageNumber: number
) {
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
    pageNumber,
    className: "wrapper_source",
  };
  if (!hasDomSource(id)) {
    saveDomSource(source);
    paintWrap({ parentDom: contianer, startDom, endDom, id });
    return source;
  } else {
    return null;
    console.log("todo: same text");
  }
}

export function getStartParantDom(source: DomSource, parentDom: HTMLElement) {
  const {
    startMeta: { parentIndex: startIndex, parentTagName: startTagName },
  } = source;
  const startDom = selectorAll(startTagName, parentDom)[startIndex];
  return startDom;
}

export function domSourceFromStore(source: DomSource, parentDom: HTMLElement) {
  const {
    startMeta: { parentIndex: startIndex, parentTagName: startTagName },
    endMeta: { parentIndex: endIndex, parentTagName: endTagName },
    id,
  } = source;

  const startDom = selectorAll(startTagName, parentDom)[startIndex];
  const endDom = selectorAll(endTagName, parentDom)[endIndex];
  if (startDom && endDom) {
    saveDomSource(source);
    paintWrap({ parentDom, startDom, endDom, id });
  }
}
