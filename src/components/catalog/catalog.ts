import { Bookextname } from "src/enums";
import { getReadingBook } from "src/store";
import { useEpubChangePage } from "src/core/file/epub";
import { usePdfChangePage } from "src/core/file/pdf";
import { DomSource } from "src/core/web-highlight";

const readingBook = getReadingBook();

export const useCatalog = () => {
  class Keys {
    constructor(
      public key: string,
      public label: string,
      public children: string
    ) { }
  }

  const menuKes = computed(() => {
    switch (readingBook.extname) {
      case Bookextname.pdf:
        return new Keys("title", "title", "items");
      case Bookextname.epub:
        return new Keys("id", "label", "subitems");
      default:
        console.warn("TODO: Unknown readingBook.extname");
        return new Keys("key", "label", "children");
    }
  });

  return { readingBook, menuKes };
};


export const useBookJump = () => {
  const { pdfJumpFromCatalog, pdfJumpToPage } = usePdfChangePage();
  const { epubJumpFromCatalog } = useEpubChangePage();

  // 点击目录跳转
  function catalogJump(item: any) {
    switch (readingBook.extname) {
      case Bookextname.pdf:
        pdfJumpFromCatalog(item.dest)
        break;
      case Bookextname.epub:
        epubJumpFromCatalog(item.href)
        break;
      default:
        console.warn("TODO: Unknown readingBook.extname");
    }
  }

  // 根据 页面数 跳转
  function pageNumberJump({ pageNumber }: DomSource) {
    switch (readingBook.extname) {
      case Bookextname.pdf:
        pdfJumpToPage(pageNumber)
        break
      case Bookextname.epub:
      default:
        console.warn("TODO: Unknown readingBook.extname");
    }
  }
  return { catalogJump, pageNumberJump }
}
