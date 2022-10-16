import { VIEWER } from "@/constants";
import { Bookextname } from "@/enums";
import { getReadingBook } from "@/store";
import { getEleById, getPDFPageSelector, selector } from "@/utils";
import { getPdfCurrentPageNumber } from "@core/file";

function handePdfContainer() {
  const pageNumber = getPdfCurrentPageNumber();
  return selector(getPDFPageSelector(pageNumber), getEleById(VIEWER)!)!;
}

// 获取不同格式的渲染文本容器
export function getDomContianer() {
  const readingBook = getReadingBook();
  let result: HTMLElement | null = null;
  switch (readingBook.extname) {
    case Bookextname.pdf:
      result = handePdfContainer();
  }
  return result;
}
