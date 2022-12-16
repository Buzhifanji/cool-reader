import { Bookextname } from "src/enums";
import { getReadingBook } from "src/store";

const readingBook = getReadingBook();

export function getCatalogFieldKey() {
  switch (readingBook.extname) {
    case Bookextname.pdf:
      return ["title", "items"];
    case Bookextname.epub:
    case Bookextname.mobi:
    case Bookextname.azw3:
    case Bookextname.txt:
      return ["label", "subitems"];
    default:
      console.warn("TODO: Unknown readingBook.chilren key: " + readingBook.extname);
      return ["label", "children"];
  }
}

export function getCurrentBookCatalog(key?: string) {
  const [label, childrenField] = getCatalogFieldKey();

  const { chapter, catalog } = readingBook

  const chapterKey = key ? key : chapter
  const stack = [...catalog]

  let cur = catalog[0];

  while (cur = stack.pop()) {
    if (cur[label] === chapterKey) {
      break
    }
    const children = cur[childrenField]
    for (let i = 0; i < children.length; i++) {
      stack.push(children[i])
    }
  }

  return cur
}