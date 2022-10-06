import { reactive, ref } from "vue";
import { epubGotoPage, getEpubCatalog } from "../../core/file/epub";
import { getPdfCatalogs, pdfGotoPage } from "../../core/file/pdf";
import { StorageBook } from "../../core/type";
import { Bookextname } from "../../core/utils/enums";

export const useCatalog = ({ extname, id }: StorageBook) => {
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
  function switchBookCatalog() {
    switch (extname) {
      case Bookextname.pdf:
        setField("title", "title", "items");
        catalog.value = getPdfCatalogs();
        break;
      case Bookextname.epub:
        setField("id", "label", "subitems");
        catalog.value = getEpubCatalog();
        break;
    }
  }

  switchBookCatalog();

  return { catalog, menuFieds };
};

export function generateGotoPage({
  extname,
  item,
}: {
  extname: string;
  item: any;
}) {
  switch (extname) {
    case Bookextname.pdf:
      pdfGotoPage(item.dest);
      break;
    case Bookextname.epub:
      epubGotoPage(item.href);
      break;
  }
}
