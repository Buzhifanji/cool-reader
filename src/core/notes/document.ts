import { getReadingBook } from "../store";
import { ExtnameFn } from "../type";
import { VIEWER } from "../utils/constant";
import { getEleById } from "../utils/dom";
import { Bookextname } from "../utils/enums";

export function getReaderToolRoot() {
  const readingBook = getReadingBook();
  const rootStatus: ExtnameFn = {
    [Bookextname.pdf]: () => getEleById(VIEWER)!,
    [Bookextname.epub]: getIframe,
  };
  return rootStatus[readingBook.extname]?.();
}

export function getIframe() {
  const contianer = getEleById(VIEWER)!;
  const iframe = contianer.getElementsByTagName("iframe")[0];
  if (!iframe) return null;
  let doc = iframe.contentDocument;

  if (!doc) {
    return null;
  }
  return doc;
}
