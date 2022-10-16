import { Bookextname } from "@/enums";
import { getReadingBook } from "@/store";
import { getPdfCurrentPageNumber } from "@core/file";

export function getPageNumber() {
  const readingBook = getReadingBook();
  let result: number = 0;
  switch (readingBook.extname) {
    case Bookextname.pdf:
      result = getPdfCurrentPageNumber();
  }
  return result;
}
