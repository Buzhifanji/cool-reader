import { getReadingBook } from "@/store";
import { getPdfCurrentPageNumber } from "@core/file";
import { Bookextname } from "../utils/enums";

export function getPageNumber() {
  const readingBook = getReadingBook();
  let result: number = 0;
  switch (readingBook.extname) {
    case Bookextname.pdf:
      result = getPdfCurrentPageNumber();
  }
  return result;
}
