import { Bookextname } from "@/enums";
import { ExtnameFn } from "@/interfaces";
import { getReadingBook } from "@/store";
import { useEpubChangePage } from "@core/file/epub";
import { usePdfChangePage } from "@core/file/pdf";

export const useCatalog = () => {
  const readingBook = getReadingBook();

  class Keys {
    constructor(
      public key: string,
      public label: string,
      public children: string
    ) {}
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

export function generateGotoPage(item: any) {
  const { pdfJumpFromCatalog } = usePdfChangePage();
  const { epubJumpFromCatalog } = useEpubChangePage();
  const readingBook = getReadingBook();
  const pageStatus: ExtnameFn = {
    [Bookextname.pdf]: () => pdfJumpFromCatalog(item.dest),
    [Bookextname.epub]: () => epubJumpFromCatalog(item.href),
  };
  pageStatus[readingBook.extname]?.();
}
