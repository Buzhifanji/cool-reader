import { reactive, ref } from "vue";
import { epubGotoPage, getEpubCatalog } from "../../core/file/epub";
import { getPdfCatalogs, pdfGotoPage } from "../../core/file/pdf";
import { ExtnameFn, StorageBook } from "../../core/type";
import { Bookextname } from "../../core/utils/enums";

export const useCatalog = ({ extname }: StorageBook) => {
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

  catalogStatus[extname]?.();

  return { catalog, menuFieds };
};

export function generateGotoPage({
  extname,
  item,
}: {
  extname: Bookextname;
  item: any;
}) {
  const pageStatus: ExtnameFn = {
    [Bookextname.pdf]: () => pdfGotoPage(item.dest),
    [Bookextname.epub]: () => epubGotoPage(item.href),
  };
  pageStatus[extname]?.();
}
