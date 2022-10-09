import SparkMD5 from "spark-md5";
import { hasDomSource, saveDomSource } from "../store/dom-source";
import { selectorAll } from "../utils/dom";
import { getDomMeta } from "./dom";
import { paintWrap } from "./paint";
import { DomSource } from "./type";

export function domSourceFromRange(
  range: Range,
  parentDom: HTMLElement,
  pageNumber: number
) {
  const {
    startContainer: startDom,
    endContainer: endDom,
    startOffset,
    endOffset,
  } = range;

  const startMeta = getDomMeta(parentDom, startDom, startOffset);
  const endMeta = getDomMeta(parentDom, endDom, endOffset);

  const text = range.toString();
  const id = SparkMD5.hash(text);

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
    paintWrap({ parentDom, startDom, endDom, id });
  } else {
    console.log("todo: same text");
  }
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
