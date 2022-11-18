import { VIEWER } from "src/constants";
import { Bookextname } from "src/enums";
import { getReadingBook } from "src/store";
import { getEleById, getPDFPageSelector, selector } from "src/utils";
import { getPdfCurrentPageNumber } from "src/core/file";

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
