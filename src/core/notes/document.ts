import { getReadingBook } from "../store";
import { ExtnameFn } from "../type";
import { getEleById } from "../utils/dom";
import { Bookextname } from "../utils/enums";

export function getReaderToolRoot() {
  const readingBook = getReadingBook();
  const rootStatus: ExtnameFn = {
    [Bookextname.pdf]: () => getEleById("viewer")!,
    [Bookextname.epub]: getIframe,
  };
  return rootStatus[readingBook.extname]?.();
}

export function getIframe() {
  const contianer = getEleById("viewer")!;
  const iframe = contianer.getElementsByTagName("iframe")[0];
  if (!iframe) return null;
  let doc = iframe.contentDocument;

  if (!doc) {
    return null;
  }
  return doc;
}
