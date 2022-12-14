import { VIEWER } from "src/constants";
import { Bookextname } from "src/enums";
import { ExtnameFn } from "src/interfaces";
import { getReadingBook } from "src/store";
import { getEleById } from "src/utils";

export function getReaderToolRoot() {
  const readingBook = getReadingBook();
  const rootStatus: ExtnameFn = {
    [Bookextname.pdf]: () => getEleById(VIEWER)!,
    [Bookextname.epub]: getIframe,
    [Bookextname.mobi]: getIframe,
    [Bookextname.azw3]: getIframe,
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
