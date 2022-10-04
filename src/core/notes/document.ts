import { StorageBook } from "../type";
import { Bookextname } from "../utils/enums";
import { getEleById } from "../utils/utils";

export function getReaderToolRoot(book: StorageBook) {
  switch (book!.extname) {
    case Bookextname.pdf:
      return getEleById("viewer")!;
    case Bookextname.epub:
      return getIframe();
  }
  return null;
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
