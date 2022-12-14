import { VIEWER } from "src/constants";
import { getEleById } from "./dom";

export function getIframe() {
  const contianer = getEleById(VIEWER)!;
  return contianer.getElementsByTagName("iframe")[0];
}

export function getIframeDoc() {
  const iframe = getIframe();
  if (!iframe) return null;
  let doc = iframe.contentDocument;

  if (!doc) {
    return null;
  }
  return doc;
}
