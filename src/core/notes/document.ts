import { ExtnameFn, StorageBook } from "../type";
import { Bookextname } from "../utils/enums";
import { getEleById } from "../utils/utils";

export function getReaderToolRoot({ extname }: StorageBook) {
  const rootStatus: ExtnameFn = {
    [Bookextname.pdf]: () => getEleById("viewer")!,
    [Bookextname.epub]: getIframe,
  };
  return rootStatus[extname]?.();
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
