import { VIEWER } from "@/constants";
import { Bookextname } from "@/enums";
import { ExtnameFn } from "@/interfaces";
import { getReadingBook } from "@/store";
import { getEleById } from "@/utils";

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
