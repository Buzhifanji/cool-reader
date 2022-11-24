import { VIEWER } from "src/constants";
import { getEleById } from "./dom";

export function getEpubIframe() {
  const contianer = getEleById(VIEWER)!;
  return contianer.getElementsByTagName("iframe")[0];
}

export function getEpubDoc() {
  const iframe = getEpubIframe();
  if (!iframe) return null;
  let doc = iframe.contentDocument;

  if (!doc) {
    return null;
  }
  return doc;
}
