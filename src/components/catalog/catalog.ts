import { getReadingBook } from "@/store";
import { useEpubChangePage } from "@core/file/epub";
import { usePdfChangePage } from "@core/file/pdf";
import { reactive } from "vue";
import { ExtnameFn } from "../../core/type";
import { Bookextname } from "../../core/utils/enums";

export const useCatalog = () => {
  const { readingBook } = getReadingBook();
  const menuFieds = reactive({
    key: "key",
    label: "label",
    children: "children",
  });

  function setField(key: string, label: string, children: string) {
    menuFieds.key = key;
    menuFieds.label = label;
    menuFieds.children = children;
  }
  const catalogStatus: ExtnameFn = {
    [Bookextname.pdf]: () => setField("title", "title", "items"),
    [Bookextname.epub]: () => setField("id", "label", "subitems"),
  };
  catalogStatus[readingBook.extname]?.();

  return { menuFieds, readingBook };
};

export function generateGotoPage(item: any) {
  const { pdfJumpFromCatalog } = usePdfChangePage();
  const { epubJumpFromCatalog } = useEpubChangePage();
  const { readingBook } = getReadingBook();
  const pageStatus: ExtnameFn = {
    [Bookextname.pdf]: () => pdfJumpFromCatalog(item.dest),
    [Bookextname.epub]: () => epubJumpFromCatalog(item.href),
  };
  pageStatus[readingBook.extname]?.();
}
