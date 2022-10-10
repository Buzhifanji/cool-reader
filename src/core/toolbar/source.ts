import SparkMD5 from "spark-md5";
import { hasDomSource, saveDomSource } from "../store/dom-source";
import { selectorAll } from "../utils/dom";
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

  // 解决获取不到dom 问题，由于 querySelector是按css规范来实现的，所以它传入的字符串中第一个字符不能是数字、特殊字符，
  const id = "a" + SparkMD5.hash(text);

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
