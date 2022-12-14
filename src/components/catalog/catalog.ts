import { Bookextname } from "src/enums";
import { getReadingBook } from "src/store";
import { useEpubChangePage } from "src/core/file/epub";
import { usePdfChangePage } from "src/core/file/pdf";
import { DomSource } from "src/core/web-highlight";
import { useMobiChangePage } from "src/core/file/mobi";
import { azw3JumpFromCatalog } from "src/core/file/azw3";

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
        return new Keys("dest", "title", "items");
      case Bookextname.epub:
        return new Keys("href", "label", "subitems");
      case Bookextname.mobi:
        return new Keys("label", "label", "subitems");
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
  const { mobiJumpFromCatalog } = useMobiChangePage();

  // 点击目录跳转
  function catalogJump(key: string) {
    switch (readingBook.extname) {
      case Bookextname.pdf:
        pdfJumpFromCatalog(key)
        break;
      case Bookextname.epub:
        epubJumpFromCatalog(key)
        break;
      case Bookextname.mobi:
        mobiJumpFromCatalog(key)
        break;
      case Bookextname.azw3:
        azw3JumpFromCatalog(key)
        break;
      default:
        console.warn("TODO: Unknown readingBook.extname");
    }
  }

  // 根据 页面数 跳转
  function pageNumberJump({ pageNumber }: DomSource) {
    switch (readingBook.extname) {
      case Bookextname.pdf:
        pdfJumpToPage(+pageNumber)
        break
      case Bookextname.epub:
        epubJumpFromCatalog(pageNumber as string,)
        break
      default:
        console.warn("TODO: Unknown readingBook.extname");
    }
  }
  return { catalogJump, pageNumberJump }
}
