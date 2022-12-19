import { Bookextname } from "src/enums";
import { getReadingBook } from "src/store";
import { useEpubChangePage } from "src/core/file/epub";
import { usePdfChangePage } from "src/core/file/pdf";
import { useMobiChangePage } from "src/core/file/mobi";
import { useAzw3ChangePage } from "src/core/file/azw3";
import { useTextChangePage } from "src/core/file/txt";
import { getCurrentBookCatalog } from "src/utils/book";

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
      case Bookextname.azw3:
        return new Keys("label", "label", "subitems");
      case Bookextname.txt:
        return new Keys("label", "label", "subitems");
      default:
        console.warn("TODO: Unknown readingBook.extname");
        return new Keys("key", "label", "children");
    }
  });

  return { readingBook, menuKes };
};

export const useBookJump = () => {
  const { pdfJumpFromCatalog } = usePdfChangePage();
  const { epubJumpFromCatalog } = useEpubChangePage();
  const { mobiJumpFromCatalog } = useMobiChangePage();
  const { azw3JumpFromCatalog } = useAzw3ChangePage();
  const { textJumpFromCatalog } = useTextChangePage();

  // 点击目录跳转
  async function catalogJump(item: any) {
    switch (readingBook.extname) {
      case Bookextname.pdf:
        return await pdfJumpFromCatalog(item.dest)
      case Bookextname.epub:
        return await epubJumpFromCatalog(item.href)
      case Bookextname.mobi:
        return await mobiJumpFromCatalog(item.label)
      case Bookextname.azw3:
        return await azw3JumpFromCatalog(item.label)
      case Bookextname.txt:
        return await textJumpFromCatalog(item.label)
      default:
        console.warn("TODO: Unknown readingBook.extname");
    }
  }

  async function jumpByChapter(chapter: string) {
    const chapterData = getCurrentBookCatalog(chapter);

    await catalogJump(chapterData)
    readingBook.chapter = chapter;
  }

  return { catalogJump, jumpByChapter }
}
