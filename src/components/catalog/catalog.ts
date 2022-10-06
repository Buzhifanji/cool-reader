import { reactive, ref } from "vue";
import { epubGotoPage, getEpubCatalog } from "../../core/file/epub";
import { getPdfCatalogs, pdfGotoPage } from "../../core/file/pdf";
import { getReadingBook } from "../../core/store";
import { ExtnameFn } from "../../core/type";
import { Bookextname } from "../../core/utils/enums";

export const useCatalog = () => {
  const readingBook = getReadingBook();
  const catalog = ref<any[]>([]);
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
    [Bookextname.pdf]: () => {
      setField("title", "title", "items");
      catalog.value = getPdfCatalogs();
    },
    [Bookextname.epub]: () => {
      setField("id", "label", "subitems");
      catalog.value = getEpubCatalog();
    },
  };

  catalogStatus[readingBook.extname]?.();

  return { catalog, menuFieds };
};

export function generateGotoPage(item: any) {
  const readingBook = getReadingBook();
  const pageStatus: ExtnameFn = {
    [Bookextname.pdf]: () => pdfGotoPage(item.dest),
    [Bookextname.epub]: () => epubGotoPage(item.href),
  };
  pageStatus[readingBook.extname]?.();
}
