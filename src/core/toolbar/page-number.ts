import { Bookextname } from "src/enums";
import { getReadingBook } from "src/store";
import { getPdfCurrentPageNumber } from "src/core/file";

export function getPageNumber() {
  const readingBook = getReadingBook();
  let result: number = 0;
  switch (readingBook.extname) {
    case Bookextname.pdf:
      result = getPdfCurrentPageNumber();
  }
  return result;
}
